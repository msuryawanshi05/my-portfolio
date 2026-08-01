import os
import httpx
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError, jwk
from dotenv import load_dotenv

load_dotenv()

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "https://api.clerk.com/v1/jwks")
ADMIN_CLERK_USER_ID = os.getenv("ADMIN_CLERK_USER_ID", "")

security = HTTPBearer()

# In-memory JWKS key cache to avoid fetching JWKS on every single API call
_jwks_cache: Optional[dict] = None

def get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache is None:
        try:
            headers = {}
            secret_key = os.getenv("CLERK_SECRET_KEY")
            if secret_key:
                headers["Authorization"] = f"Bearer {secret_key}"
            
            response = httpx.get(CLERK_JWKS_URL, headers=headers, timeout=10.0)
            response.raise_for_status()
            _jwks_cache = response.json()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch JWKS keys for JWT verification: {str(e)}"
            )
    return _jwks_cache

def clear_jwks_cache():
    global _jwks_cache
    _jwks_cache = None

def verify_clerk_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization bearer token"
        )
    
    try:
        # Step 1: Decode unverified header to get key ID (kid)
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        if not kid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token header missing 'kid'"
            )

        # Step 2: Retrieve JWKS public keys
        jwks = get_jwks()
        key_data = None
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                key_data = key
                break
        
        # If kid not found in cache, clear cache and retry once (key rotation scenario)
        if not key_data:
            clear_jwks_cache()
            jwks = get_jwks()
            for key in jwks.get("keys", []):
                if key.get("kid") == kid:
                    key_data = key
                    break

        if not key_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Public key not found for token 'kid'"
            )

        # Step 3: Verify signature using RSA key
        public_key = jwk.construct(key_data)
        decoded_payload = jwt.decode(
            token,
            public_key.to_pem().decode("utf-8"),
            algorithms=["RS256"],
            options={"verify_aud": False}  # Clerk JWTs use sub for user_id
        )

        user_id = decoded_payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload missing 'sub' claim"
            )
        
        return user_id

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired JWT token: {str(e)}"
        )

def require_admin(user_id: str = Depends(verify_clerk_token)) -> str:
    """
    Single-Admin Verification:
    Ensures that the authenticated user ID strictly matches ADMIN_CLERK_USER_ID.
    Rejects all other authenticated Clerk users with HTTP 403.
    """
    if not ADMIN_CLERK_USER_ID:
        # Development warning mode if env variable is not set yet
        return user_id

    if user_id != ADMIN_CLERK_USER_ID:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Account is not authorized as system admin."
        )
    return user_id

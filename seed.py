import os
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app import models

# Seed dataset matching config.js and current portfolio content
PORTFOLIO_CONFIG_SEED = {
    "stat_tiles": [
        { "label": "ICYS CTF", "value": "#3", "icon_or_symbol": "#3", "link_url": "", "order": 1, "show": True },
        { "label": "Machines Pwned", "value": "22", "icon_or_symbol": "", "link_url": "", "order": 2, "show": True },
        { "label": "LeetCode Solved", "value": "10", "icon_or_symbol": "↗", "link_url": "https://leetcode.com/u/msuryawanshi05/", "order": 3, "show": True },
        { "label": "Certifications", "value": "4+", "icon_or_symbol": "", "link_url": "", "order": 4, "show": True }
    ],
    "projects": [
        {
            "id": "f1",
            "name": "PITWALL",
            "github": "https://github.com/msuryawanshi05/Project-f1",
            "live": "",
            "description": "Data analysis and visualization project built around Formula 1 race datasets.",
            "language": "Python",
            "is_customized": True,
            "show": True
        },
        {
            "id": "log",
            "name": "Portable Log Analysis Tool for Isolated Networks",
            "github": "https://github.com/msuryawanshi05/Portable-Log-Analysis-Tool",
            "live": "",
            "description": "USB-deployable offline forensic tool for log analysis in air-gapped environments.",
            "language": "Python",
            "is_customized": False,
            "show": True
        },
        {
            "id": "soc",
            "name": "Distributed SOC Platform",
            "github": "https://github.com/msuryawanshi05/Distributed-SOC-Platform",
            "live": "",
            "description": "Tamper-evident event collection engine, threat correlation, and alert dashboard.",
            "language": "Python",
            "is_customized": False,
            "show": True
        },
        {
            "id": "rxrewards",
            "name": "RxRewards",
            "github": "https://github.com/msuryawanshi05/RxRewards",
            "live": "",
            "description": "Healthcare rewards & prescription management platform.",
            "language": "JavaScript",
            "is_customized": False,
            "show": True
        },
        {
            "id": "ship",
            "name": "StoryShip - IP Leak Defense System",
            "github": "https://github.com/msuryawanshi05/IP-Leak-Defense-System-StoryShip",
            "live": "",
            "description": "Content-integrity platform tracking creative asset versions via cryptographic hashing and IPFS.",
            "language": "Python",
            "is_customized": False,
            "show": False  # Hidden until demo video added
        },
        {
            "id": "aidchain",
            "name": "AidChain",
            "github": "https://github.com/msuryawanshi05/AidChain",
            "live": "",
            "description": "Collaborator / external project.",
            "language": "Solidity",
            "is_customized": False,
            "show": False  # Explicitly hidden
        }
    ],
    "certs": [
        { "file": "assets/Certify/CASA_Exam.pdf", "label": "CASA", "show": True },
        { "file": "assets/Certify/ICYS.pdf", "label": "ICYS CTF", "show": True },
        { "file": "assets/Certify/Cryptography and Network Security.pdf", "label": "NPTEL Crypto", "show": True },
        { "file": "assets/Certify/IIRS GEOSAT.pdf", "label": "ISRO IIRS", "show": True },
        { "file": "assets/Certify/Shadowfox_.pdf", "label": "ShadowFox", "show": True },
        { "file": "assets/Certify/EncipherX.pdf", "label": "EncipherX", "show": True },
        { "file": "assets/Certify/Crest Ctf.pdf", "label": "CREST CTF", "show": True },
        { "file": "assets/Certify/Seasides_Goa.pdf", "label": "Seasides 2K26", "show": True },
        { "file": "assets/Certify/Unstop ehax ctf.pdf", "label": "eHax CTF", "show": True },
        { "file": "assets/Certify/YCCE ctf.png", "label": "YCCE CTF", "show": True },
        { "file": "assets/Certify/PECB_Certificate_of_Attestation.pdf", "label": "PECB", "show": True },
        { "file": "assets/Certify/be10x.pdf", "label": "Be10x", "show": False },
        { "file": "assets/Certify/codetantra.pdf", "label": "CodeTantra", "show": False },
        { "file": "assets/Certify/HWI_volunter.pdf", "label": "HWI Volunteer", "show": False },
        { "file": "assets/Certify/Nikistain.pdf", "label": "Nikistain", "show": False },
        { "file": "assets/Certify/TCS microintern.pdf", "label": "TCS", "show": False }
    ],
    "skills": {
        "security": [
            "Vulnerability Assessment", "Penetration Testing", "Log Analysis",
            "OWASP Top 10", "SOC L1", "Incident Response", "Threat Analysis",
            "SIEM", "Burp Suite", "Metasploit", "Nmap", "Wireshark",
            "Nessus", "Wazuh", "OWASP ZAP", "IDS/IPS", "Traffic Analysis"
        ],
        "development": [
            "Python", "C", "Java", "JavaScript", "HTML / CSS", "SQL",
            "Bash", "Git & GitHub", "Kali Linux", "Parrot OS", "Linux"
        ],
        "radar": [
            { "label": "Web Security", "value": 83 },
            { "label": "Scripting & Dev", "value": 79 },
            { "label": "Exploitation", "value": 72 },
            { "label": "SIEM / Monitoring", "value": 61 },
            { "label": "Recon & OSINT", "value": 57 }
        ]
    },
    "experiences": [
        {
            "title": "Cybersecurity Intern",
            "organization": "ShadowFox",
            "tag": "INTERNSHIP",
            "date_start": "2025-07",
            "date_end": "2025-08",
            "description": "Exploited 10+ vulnerabilities across Metasploitable 2 and TryHackMe using Metasploit, Wireshark, and custom wordlists; executed privilege escalation and Wi-Fi attack workflows. Conducted 5+ network security assessments with Nmap and Wireshark; delivered structured vulnerability reports with prioritized remediation steps.",
            "order": 1,
            "show": True
        },
        {
            "title": "Cybersecurity Intern",
            "organization": "Redynox",
            "tag": "INTERNSHIP",
            "date_start": "2025-06",
            "date_end": "2025-07",
            "description": "Assessed 3+ web applications against OWASP Top 10 using Burp Suite and Nessus, uncovering 8+ injection, authentication, and misconfiguration findings with CVSS-referenced severity ratings. Documented vulnerabilities with structured severity ratings and actionable remediation guidance.",
            "order": 2,
            "show": True
        }
    ]
}

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Seed StatTiles
        if db.query(models.StatTile).count() == 0:
            for st in PORTFOLIO_CONFIG_SEED["stat_tiles"]:
                db.add(models.StatTile(**st))
            print(f"[+] Seeded {len(PORTFOLIO_CONFIG_SEED['stat_tiles'])} stat tiles")

        # Seed Projects
        if db.query(models.Project).count() == 0:
            for p in PORTFOLIO_CONFIG_SEED["projects"]:
                db.add(models.Project(**p))
            print(f"[+] Seeded {len(PORTFOLIO_CONFIG_SEED['projects'])} projects")

        # Seed Certs
        if db.query(models.Cert).count() == 0:
            for c in PORTFOLIO_CONFIG_SEED["certs"]:
                db.add(models.Cert(file=c["file"], label=c["label"], show=c["show"]))
            print(f"[+] Seeded {len(PORTFOLIO_CONFIG_SEED['certs'])} certificates")

        # Seed Skills
        if db.query(models.Skill).count() == 0:
            for sec in PORTFOLIO_CONFIG_SEED["skills"]["security"]:
                db.add(models.Skill(category="security", name=sec, show=True))
            for dev in PORTFOLIO_CONFIG_SEED["skills"]["development"]:
                db.add(models.Skill(category="development", name=dev, show=True))
            print("[+] Seeded Security & Dev skills")

        # Seed Radar
        if db.query(models.RadarEntry).count() == 0:
            for r in PORTFOLIO_CONFIG_SEED["skills"]["radar"]:
                db.add(models.RadarEntry(label=r["label"], value=r["value"]))
            print(f"[+] Seeded {len(PORTFOLIO_CONFIG_SEED['skills']['radar'])} radar entries")

        # Seed Experiences
        if db.query(models.Experience).count() == 0:
            for exp in PORTFOLIO_CONFIG_SEED["experiences"]:
                db.add(models.Experience(**exp))
            print(f"[+] Seeded {len(PORTFOLIO_CONFIG_SEED['experiences'])} experience entries")

        db.commit()
        print("[✓] Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"[!] Database seeding failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

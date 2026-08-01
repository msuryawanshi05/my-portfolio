"""Initial migration

Revision ID: 0001_initial
Revises: 
Create Date: 2026-08-01 20:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'projects',
        sa.Column('id', sa.String(), nullable=False, primary_key=True),
        sa.Column('github', sa.String(), nullable=False),
        sa.Column('live', sa.String(), nullable=True, server_default=''),
    )
    op.create_table(
        'certs',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, autoincrement=True),
        sa.Column('file', sa.String(), nullable=False),
        sa.Column('label', sa.String(), nullable=False),
        sa.Column('show', sa.Boolean(), nullable=False, server_default='true'),
    )
    op.create_table(
        'skills',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, autoincrement=True),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
    )
    op.create_table(
        'radar',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, autoincrement=True),
        sa.Column('label', sa.String(), nullable=False),
        sa.Column('value', sa.Integer(), nullable=False),
    )
    op.create_table(
        'stats',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, server_default='1'),
        sa.Column('ctf_rank', sa.String(), nullable=False, server_default='#3'),
        sa.Column('machines', sa.Integer(), nullable=False, server_default='22'),
        sa.Column('certifications', sa.Integer(), nullable=False, server_default='4'),
        sa.Column('leetcode_solved', sa.Integer(), nullable=False, server_default='10'),
        sa.Column('leetcode_url', sa.String(), nullable=False, server_default='https://leetcode.com/u/msuryawanshi05/'),
        sa.Column('resume_file', sa.String(), nullable=False, server_default='assets/Mukul_Resume.pdf'),
    )

def downgrade() -> None:
    op.drop_table('stats')
    op.drop_table('radar')
    op.drop_table('skills')
    op.drop_table('certs')
    op.drop_table('projects')

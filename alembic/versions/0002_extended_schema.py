"""Extended schema for GitHub sync, StatTile, Experience, and universal show toggle

Revision ID: 0002_extended_schema
Revises: 0001_initial
Create Date: 2026-08-01 20:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0002_extended_schema'
down_revision: Union[str, None] = '0001_initial'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Add new columns to projects
    op.add_column('projects', sa.Column('name', sa.String(), nullable=True, server_default=''))
    op.add_column('projects', sa.Column('description', sa.Text(), nullable=True, server_default=''))
    op.add_column('projects', sa.Column('language', sa.String(), nullable=True, server_default=''))
    op.add_column('projects', sa.Column('last_synced_at', sa.String(), nullable=True, server_default=''))
    op.add_column('projects', sa.Column('is_customized', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('projects', sa.Column('show', sa.Boolean(), nullable=False, server_default='true'))

    # Add show column to skills
    op.add_column('skills', sa.Column('show', sa.Boolean(), nullable=False, server_default='true'))

    # Create stat_tiles table
    op.create_table(
        'stat_tiles',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, autoincrement=True),
        sa.Column('label', sa.String(), nullable=False),
        sa.Column('value', sa.String(), nullable=False),
        sa.Column('icon_or_symbol', sa.String(), nullable=True, server_default=''),
        sa.Column('link_url', sa.String(), nullable=True, server_default=''),
        sa.Column('order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('show', sa.Boolean(), nullable=False, server_default='true'),
    )

    # Create experiences table
    op.create_table(
        'experiences',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, autoincrement=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('organization', sa.String(), nullable=False),
        sa.Column('tag', sa.String(), nullable=False, server_default='INTERNSHIP'),
        sa.Column('date_start', sa.String(), nullable=False),
        sa.Column('date_end', sa.String(), nullable=True, server_default=''),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('show', sa.Boolean(), nullable=False, server_default='true'),
    )

def downgrade() -> None:
    op.drop_table('experiences')
    op.drop_table('stat_tiles')
    op.drop_column('skills', 'show')
    op.drop_column('projects', 'show')
    op.drop_column('projects', 'is_customized')
    op.drop_column('projects', 'last_synced_at')
    op.drop_column('projects', 'language')
    op.drop_column('projects', 'description')
    op.drop_column('projects', 'name')

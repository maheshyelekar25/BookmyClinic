"""create clinics and doctors tables"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "20260818_0002"
down_revision = "20260818_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "clinics",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("address", sa.String(length=500), nullable=False),
        sa.Column("city", sa.String(length=100), nullable=False),
        sa.Column("state", sa.String(length=100), nullable=False),
        sa.Column("pincode", sa.String(length=10), nullable=False),
        sa.Column("lat", sa.Float(), nullable=False),
        sa.Column("lng", sa.Float(), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("specialties", sa.JSON(), nullable=False),
        sa.Column("rating", sa.Float(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_clinics_city", "clinics", ["city"])
    op.create_index("ix_clinics_state", "clinics", ["state"])
    op.create_index("ix_clinics_pincode", "clinics", ["pincode"])
    op.create_table(
        "doctors",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("clinic_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("specialization", sa.String(length=150), nullable=False),
        sa.Column("experience_years", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["clinic_id"], ["clinics.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_doctors_clinic_id", "doctors", ["clinic_id"])


def downgrade() -> None:
    op.drop_index("ix_doctors_clinic_id", table_name="doctors")
    op.drop_table("doctors")
    op.drop_index("ix_clinics_pincode", table_name="clinics")
    op.drop_index("ix_clinics_state", table_name="clinics")
    op.drop_index("ix_clinics_city", table_name="clinics")
    op.drop_table("clinics")

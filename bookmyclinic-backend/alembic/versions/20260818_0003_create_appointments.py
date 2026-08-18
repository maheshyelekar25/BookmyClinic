"""create appointment slots and appointments tables"""

import sqlalchemy as sa
from alembic import op

revision = "20260818_0003"
down_revision = "20260818_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "appointment_slots",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("doctor_id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.Column("is_booked", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.ForeignKeyConstraint(["doctor_id"], ["doctors.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_appointment_slots_doctor_id", "appointment_slots", ["doctor_id"])
    op.create_index("ix_appointment_slots_date", "appointment_slots", ["date"])
    op.create_table(
        "appointments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("slot_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="booked"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["slot_id"], ["appointment_slots.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_appointments_user_id", "appointments", ["user_id"])
    op.create_index("ix_appointments_slot_id", "appointments", ["slot_id"])


def downgrade() -> None:
    op.drop_index("ix_appointments_slot_id", table_name="appointments")
    op.drop_index("ix_appointments_user_id", table_name="appointments")
    op.drop_table("appointments")
    op.drop_index("ix_appointment_slots_date", table_name="appointment_slots")
    op.drop_index("ix_appointment_slots_doctor_id", table_name="appointment_slots")
    op.drop_table("appointment_slots")

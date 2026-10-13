from sqlalchemy import Column, BigInteger, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Material(Base):
    __tablename__ = "materials"

    id = Column(BigInteger, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(20), nullable=False, default="TEXT")  # TEXT | LINK
    content = Column(Text, nullable=False)
    teacher_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    teacher = relationship("User", foreign_keys=[teacher_id])
    student = relationship("User", foreign_keys=[student_id])
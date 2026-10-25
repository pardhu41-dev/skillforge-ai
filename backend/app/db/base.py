# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.student import Student  # noqa
from app.models.skill import Skill, StudentSkill  # noqa
from app.models.career import JobRole  # noqa

from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('admin_tecnico', 'admin', 'cajero'), default='cajero', nullable=False)
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expires = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        role_labels = {
            'admin_tecnico': 'Administrador Técnico',
            'admin': 'Administrador de Tienda',
            'cajero': 'Cajero'
        }
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'role_label': role_labels.get(self.role, self.role),
            'is_active': self.is_active,
            'estado': 'Activo' if self.is_active else 'Desactivado',
            'created_at': str(self.created_at)
        }

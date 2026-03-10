from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.user import User
from extensions import db

def _is_admin(claims):
    return claims.get('role') in ('admin', 'admin_tecnico')

@jwt_required()
def get_users():
    claims = get_jwt()
    if not _is_admin(claims):
        return jsonify({'message': 'Acceso denegado'}), 403
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@jwt_required()
def get_user(id):
    claims = get_jwt()
    if not _is_admin(claims):
        return jsonify({'message': 'Acceso denegado'}), 403
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict()), 200

@jwt_required()
def create_user():
    claims = get_jwt()
    if not _is_admin(claims):
        return jsonify({'message': 'Acceso denegado'}), 403
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Correo ya registrado'}), 400
    allowed = ['admin_tecnico', 'admin', 'cajero']
    role = data.get('role', 'cajero')
    if role not in allowed:
        role = 'cajero'
    user = User(name=data['name'], email=data['email'], role=role,
                is_active=data.get('is_active', True))
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@jwt_required()
def update_user(id):
    claims = get_jwt()
    if not _is_admin(claims):
        return jsonify({'message': 'Acceso denegado'}), 403
    user = User.query.get_or_404(id)
    data = request.get_json()
    if 'password' in data and data['password']:
        user.set_password(data.pop('password'))
    else:
        data.pop('password', None)
    if 'name' in data: user.name = data['name']
    if 'email' in data: user.email = data['email']
    if 'role' in data: user.role = data['role']
    if 'is_active' in data: user.is_active = bool(data['is_active'])
    db.session.commit()
    return jsonify(user.to_dict()), 200

@jwt_required()
def delete_user(id):
    claims = get_jwt()
    if not _is_admin(claims):
        return jsonify({'message': 'Acceso denegado'}), 403
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Usuario eliminado'}), 200

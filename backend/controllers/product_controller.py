from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.product import Product
from extensions import db

@jwt_required()
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200

@jwt_required()
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict()), 200

@jwt_required()
def create_product():
    claims = get_jwt()
    role = claims.get('role', '')
    if role not in ('admin', 'admin_tecnico'):
        return jsonify({'message': 'Acceso denegado'}), 403
    data = request.get_json()
    # Remove None barcode to avoid unique constraint issues
    if not data.get('barcode'):
        data.pop('barcode', None)
    product = Product(**data)
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@jwt_required()
def update_product(id):
    claims = get_jwt()
    role = claims.get('role', '')
    if role not in ('admin', 'admin_tecnico'):
        return jsonify({'message': 'Acceso denegado'}), 403
    product = Product.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        if hasattr(product, key):
            setattr(product, key, value)
    db.session.commit()
    return jsonify(product.to_dict()), 200

@jwt_required()
def delete_product(id):
    claims = get_jwt()
    role = claims.get('role', '')
    if role not in ('admin', 'admin_tecnico'):
        return jsonify({'message': 'Acceso denegado'}), 403
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Producto eliminado'}), 200

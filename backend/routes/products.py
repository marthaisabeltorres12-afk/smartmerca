from flask import Blueprint
from controllers.product_controller import (
    get_products, get_product, create_product, update_product, delete_product
)

products_bp = Blueprint('products', __name__)

products_bp.route('/', methods=['GET'])(get_products)
products_bp.route('/<int:id>', methods=['GET'])(get_product)
products_bp.route('/', methods=['POST'])(create_product)
products_bp.route('/<int:id>', methods=['PUT'])(update_product)
products_bp.route('/<int:id>', methods=['DELETE'])(delete_product)

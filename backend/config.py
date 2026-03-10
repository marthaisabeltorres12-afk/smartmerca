import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'smartmerca_secret_key')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        "mysql+pymysql://root:@localhost:3307/smartmerca"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt_smartmerca_key')

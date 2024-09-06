from flask_pymongo import PyMongo

# Create an instance of PyMongo with the URI configuration
mongo = PyMongo(uri="mongodb://localhost:27017/github")

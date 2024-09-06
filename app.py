from flask import Flask, render_template
from flask import Flask
from app.extensions import mongo
from app.webhook.routes import webhook

app = Flask(__name__)

# MongoDb intialization
mongo.init_app(app)

# Register Blueprints
app.register_blueprint(webhook)
    
# Landing route
@app.route("/")
def index():
    return {"message": "This is homepage"},200

# Home page
@app.route('/home')
def test():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(host='localhost' ,debug=True)

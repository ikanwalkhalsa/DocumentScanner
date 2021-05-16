from flask import Blueprint, render_template, Response, jsonify, render_template_string, request
from .scanner import realTimeDocScan

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("home.html")

@views.route('camera')
def camera():
    return render_template("camera.html")

@views.route('/livefeed', methods = ['POST','GET'])
def livefeed():
    frame = request.form['frame']
    src = realTimeDocScan(frame)
    return jsonify({"data_uri":src})

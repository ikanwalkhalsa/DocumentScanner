from flask import Blueprint, render_template, Response, jsonify, redirect, request
from flask.helpers import url_for
from .scanner import processFrame

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("home.html")

@views.route('/favicon.ico')
def logo():
    return redirect(url_for('static', filename = 'imgs/favicon.ico'))

@views.route('camera')
def camera():
    return render_template("camera.html")

@views.route('/livefeed', methods = ['POST','GET'])
def livefeed():
    frame = [v for _,v in request.form.items()]
    src = processFrame(frame)
    return jsonify({"data_uri":src})

@views.route('preview', methods = ['GET'])
def preview():
    return render_template("preview.html")
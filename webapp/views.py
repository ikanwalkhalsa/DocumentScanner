from flask import Blueprint, render_template, Response
from scanner import *

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("home.html")

@views.route('camera')
def camera():
    return render_template("camera.html")
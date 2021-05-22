from flask import Blueprint, render_template, Response, jsonify, redirect, request
from flask.helpers import url_for
from .scanner import processFrame, enhanceImg, cropImg

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
    frame = [v for _,v in request.form.items()][0]
    src = processFrame(frame)
    return jsonify({"data_uri":src})

@views.route('preview', methods = ['GET','POST'])
def preview():
    return jsonify("",render_template("preview.html"))

@views.route('spinner')
def spinner():
    path = request.args['path']
    return redirect(url_for('static', filename = f'imgs/{path}.gif'))

@views.route('/enhance', methods = ['POST','GET'])
def enhance():
    doc = request.form["doc"]
    enhanced = enhanceImg(doc)
    return jsonify({"enhanced":enhanced})

@views.route('/crop', methods = ['POST','GET'])
def crop():
    p1 = [int(x) for x in list(request.form.getlist('croppts[0][]'))]
    p2 = [int(x) for x in list(request.form.getlist('croppts[1][]'))]
    p3 = [int(x) for x in list(request.form.getlist('croppts[2][]'))]
    p4 = [int(x) for x in list(request.form.getlist('croppts[3][]'))]
    img = request.form['src']
    src = cropImg([p1,p2,p3,p4],img)
    return jsonify({"data_uri":src})
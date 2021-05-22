import io
import cv2
import base64
import numpy as np
from PIL import Image

def preProcess(img):
    grey_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur_img = cv2.GaussianBlur(grey_img, (5, 5), 1)
    canny_img = cv2.Canny(blur_img, 200, 200)
    kernal = np.ones((7, 7))
    dialated_img = cv2.dilate(canny_img, kernal, iterations = 2)
    eroded_img = cv2.erode(dialated_img, kernal, iterations = 1)
    return eroded_img

def getBiggestQuad(img, frame):
    contours, _ = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    maximum_area = 0
    biggest = np.array([])
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area>5000:
            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, 0.02*peri, True)
            if area > maximum_area and len(approx) == 4:
                biggest = approx
                maximum_area = area
    cv2.drawContours(frame, biggest, -1, (0, 255, 0), 20)
    return biggest

def getDocument(img, biggest):
    biggest = biggest.reshape((4, 2))
    sorted_points = np.zeros((4, 1, 2), np.int32)
    add = biggest.sum(1)
    sorted_points[0] = biggest[np.argmin(add)]
    sorted_points[3] = biggest[np.argmax(add)]
    diff = np.diff(biggest, axis = 1)
    sorted_points[1] = biggest[np.argmin(diff)]
    sorted_points[2] = biggest[np.argmax(diff)]
    pts1 = np.float32(sorted_points)
    h = max(sorted_points[2][0][0], sorted_points[1][0][0])
    w = max(sorted_points[2][0][1], sorted_points[1][0][1])
    pts2 = np.float32([[0, 0], [w, 0], [0, h], [w, h]])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    wrapped_document = cv2.warpPerspective(img, matrix, (w, h))
    cropped_document = wrapped_document[10 : wrapped_document.shape[0] - 10, 10 : wrapped_document.shape[1] - 10]
    return cropped_document


def processFrame(frame):
    if len(frame)>30:
        _,frame = frame.split(",",1)
        frame = base64.b64decode(frame)
        pimg = Image.open(io.BytesIO(frame))
        frame = cv2.cvtColor(np.array(pimg), cv2.COLOR_BGR2RGB)
        img = frame.copy()
        pre_processed_frame = preProcess(frame)
        biggest_quadilatral = getBiggestQuad(pre_processed_frame, frame)
        if biggest_quadilatral.shape == (4,1,2):
            frame = getDocument(img, biggest_quadilatral)
            if frame.shape[0] > 1980 or frame.shape[1] > 1080:
                frame = cv2.resize(frame, (0,0), fx=1920/frame.shape[1], fy=1080/frame.shape[0])

        if (type(img==frame) == bool and img != frame) or (type(img==frame) != bool and (img == frame).all()!=True):
            _, buffer = cv2.imencode('.png', frame)
            frame = buffer.tobytes()
            b64frame = base64.b64encode(frame)
            return f"data:image/png;base64,{b64frame.decode('ascii')}"
    return ''

def enhanceImg(doc):
    _,doc = doc.split(",",1)
    docb64 = base64.b64decode(doc)
    docimg = Image.open(io.BytesIO(docb64))
    doc = cv2.cvtColor(np.array(docimg), cv2.COLOR_BGR2RGB)
    rgb_planes = cv2.split(doc)
    result_planes = []
    for plane in rgb_planes:
        dilated_img = cv2.dilate(plane, np.ones((7,7), np.uint8))
        bg_img = cv2.medianBlur(dilated_img, 21)
        diff_img = 255 - cv2.absdiff(plane, bg_img)
        norm_img = cv2.normalize(diff_img,None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8UC1)
        result_planes.append(norm_img)
    enhanced = cv2.merge(result_planes)
    _,buffer = cv2.imencode('.png',enhanced)
    datauri = base64.b64encode(buffer)
    return f"data:image/png;base64,{datauri.decode('ascii')}"

def cropImg(biggest, frame):
    _,frame = frame.split(",",1)
    frame = base64.b64decode(frame)
    pimg = Image.open(io.BytesIO(frame))
    frame = cv2.cvtColor(np.array(pimg), cv2.COLOR_BGR2RGB)
    biggest = np.array(biggest)
    sorted_points = np.zeros((4, 1, 2), np.int32)
    add = biggest.sum(1)
    sorted_points[0] = biggest[np.argmin(add)]
    sorted_points[3] = biggest[np.argmax(add)]
    diff = np.diff(biggest, axis = 1)
    sorted_points[1] = biggest[np.argmin(diff)]
    sorted_points[2] = biggest[np.argmax(diff)]
    pts1 = np.float32(sorted_points)
    h = max(sorted_points[2][0][0], sorted_points[1][0][0])
    w = max(sorted_points[2][0][1], sorted_points[1][0][1])
    pts2 = np.float32([[0, 0], [w, 0], [0, h], [w, h]])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    frame = cv2.warpPerspective(frame, matrix, (w, h))
    _, buffer = cv2.imencode('.png', frame)
    frame = buffer.tobytes()
    b64frame = base64.b64encode(frame)
    return f"data:image/png;base64,{b64frame.decode('ascii')}"



if __name__ == "__main__":
    frame = cv2.imread("D:\\docScanner\\webapp\\static\\imgs\\demo_img1.jpg")
    img = frame.copy()
    pre_processed_frame = preProcess(frame)
    biggest_quadilatral = getBiggestQuad(pre_processed_frame, frame)
    if biggest_quadilatral.shape == (4,1,2):
        frame = getDocument(img, biggest_quadilatral)
        if frame.shape[0] > 1980 or frame.shape[1] > 1080:
            frame = cv2.resize(frame, (0,0), fx=1920/frame.shape[1], fy=1080/frame.shape[0])
    cv2.imshow("",frame)
    cv2.waitKey(0)
""" rgb_planes = cv2.split(doc)
    result_planes = []
    for plane in rgb_planes:
        dilated_img = cv2.dilate(plane, np.ones((7,7), np.uint8))
        bg_img = cv2.medianBlur(dilated_img, 21)
        diff_img = 255 - cv2.absdiff(plane, bg_img)
        norm_img = cv2.normalize(diff_img,None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8UC1)
        result_planes.append(norm_img)
    enhanced = cv2.merge(result_planes)
    enhanced = cv2.cvtColor(enhanced, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 7) """
    

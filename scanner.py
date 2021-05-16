import cv2
import numpy as np

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
    return wrapped_document


def realTimeDocScan(CAM_INDEX):
    vid = cv2.VideoCapture(CAM_INDEX)
    while True:
        _, frame = vid.read()
        copy = frame.copy()
        if frame.shape[0] > 1980 or frame.shape[1] > 1080:
            frame = cv2.resize(frame, (0,0), fx=1920/frame.shape[1], fy=1080/frame.shape[0])
        pre_processed_frame = preProcess(frame)
        biggest_quadilatral = getBiggestQuad(pre_processed_frame, frame)
        if biggest_quadilatral.shape == (4,1,2):
            document_frame = getDocument(copy, biggest_quadilatral)
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n') 

        

def scanImage(img_path):
    
    img = cv2.imread(img_path, cv2.IMREAD_COLOR)
    if img.shape[0] > 1980 or img.shape[1] > 1080:
        img = cv2.resize(img, (0,0), fx=1920/img.shape[1], fy=1080/img.shape[0])
    pre_processed_frame = preProcess(img)
    biggest_quadilatral = getBiggestQuad(pre_processed_frame, img.copy())
    if biggest_quadilatral.shape == (4,1,2):
        docuemnt_frame = getDocument(img, biggest_quadilatral)
        return docuemnt_frame
    return None
    

if __name__ == "__main__":
    cv2.imshow("",realTimeDocScan(1))
    cv2.waitKey(0)

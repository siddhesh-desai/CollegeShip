import sys
import os
from pyzbar.pyzbar import decode
from pyaadhaar.decode import AadhaarSecureQr
from pyaadhaar.utils import Qr_img_to_text, isSecureQr
# from pyaadhaar.decode import AadhaarSecureQr
# from pyaadhaar.decode import AadhaarOldQr
from pyaadhaar.utils import Qr_img_to_text
import cv2
import xmltodict

import numpy as np

path = str(sys.argv[1])
# print("Hello Path")
# path = str(os.getcwd()) + "/public/upload/"+"addhar-1660849744954.jpeg"
image = cv2.imread(path)
original = image.copy()
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (9, 9), 0)
thresh = cv2.threshold(
    blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

# Morph close
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
close = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)

# Find contours and filter for QR code
cnts = cv2.findContours(close, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cnts = cnts[0] if len(cnts) == 2 else cnts[1]
for c in cnts:
    peri = cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, 0.04 * peri, True)
    x, y, w, h = cv2.boundingRect(approx)
    area = cv2.contourArea(c)
    ar = w / float(h)
    if len(approx) == 4 and area > 1000 and (ar > .85 and ar < 1.3):
        cv2.rectangle(image, (x, y), (x + w, y + h), (36, 255, 12), 3)
        ROI = original[y:y+h, x:x+w]
        cv2.imwrite('ROI.png', ROI)

# cv2.imshow('thresh', thresh)
# cv2.imshow('close', close)
# cv2.imshow('image', image)
# cv2.imshow('ROI', ROI)
# cv2.waitKey()

# d = decode(image)
# print(d)
# string = d[0]
d = decode(ROI)
string = ""
if len(d) != 0:
    # print((d[0].data))
    # print(d[0].data.decode("utf-8"))
    string = d[0].data.decode("utf-8")

else:

    # if len(d) == 0:
    qrData = Qr_img_to_text(path)
    # print(qrData[0])

    if len(qrData) == 0:
        print(" No QR Code Detected !!")
    else:
        isSecureQR = (isSecureQr(qrData[0]))
        string = str(qrData[0])
# else:
#     string = d[0]
#     print(string)
# print(string)
dic = xmltodict.parse(string)
print(dic["PrintLetterBarcodeData"])
# print(dic)

# data = dic["PrintLetterBarcodeData"]

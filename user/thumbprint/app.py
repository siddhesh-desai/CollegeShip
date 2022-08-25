import os
import cv2

name = input().replace(" ", "").lower()

ip_file = cv2.imread("DataSet/Input/now.dib")
og_file = cv2.imread("DataSet/Real/" + name + ".dib")

if og_file.all():
    print("Invalid Input")

else:
    best_score = 0
    image = None
    kp1, kp2, mp = None, None, None

    sift = cv2.SIFT_create()
    keypoints_1, descriptors_1 = sift.detectAndCompute(ip_file, None)
    keypoints_2, descriptors_2 = sift.detectAndCompute(og_file, None)

    matches = cv2.FlannBasedMatcher({'algorithm': 1, 'trees':10},{}).knnMatch(descriptors_1, descriptors_2, k=2)

    match_points =[]

    for p, q in matches:
        if p.distance < 0.1 * q.distance:
            match_points.append(p)

    keypoints = 0

    if len(keypoints_1) < len(keypoints_2):
        keypoints = len(keypoints_1)
    else:
        keypoints = len(keypoints_2)

    best_score = len(match_points)/keypoints*100

    if int(best_score) >50:
        print("Fingerprint Matched!")
    else:
        print("Fingerprint Not Matched!")
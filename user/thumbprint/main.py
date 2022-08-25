import os
import cv2

sample = cv2.imread("DataSet/Input/11.dib")
best_score = 0
filename = None
image = None
kp1, kp2, mp = None, None, None

for file in [file for file in os.listdir("DataSet/Real")]:
    fingerprint_image = cv2.imread("DataSet/Real/" + file)
    sift = cv2.SIFT_create()

    keypoints_1, descriptors_1 = sift.detectAndCompute(sample, None)
    keypoints_2, descriptors_2 = sift.detectAndCompute(fingerprint_image, None)

    matches = cv2.FlannBasedMatcher({'algorithm': 1, 'trees':10},{}).knnMatch(descriptors_1, descriptors_2, k=2)

    match_points =[]

    for p,q in matches:
        if p.distance <0.1 * q.distance:
            match_points.append(p)

    keypoints = 0

    if len(keypoints_1) < len(keypoints_2):
        keypoints = len(keypoints_1)
    else:
        keypoints = len(keypoints_2)


    if len(match_points) / keypoints*100 >best_score:
        best_score = len(match_points)/keypoints*100
        filename = file
        image = fingerprint_image
        kp1, kp2, mp = keypoints_1, keypoints_2, match_points
        result = cv2.drawMatches(sample,kp1,fingerprint_image,kp2,mp, None)






print("Best Match:" + filename)
print("Score" + str(best_score))

cv2.imshow("Result", result)
cv2.waitKey(0)
cv2.destroyAllWindows()

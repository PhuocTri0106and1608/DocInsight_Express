import cv2
import numpy as np
import lungs_finder as lf


def process_data(img_path, IMAGE_RESOLUTION, BORDER):
    try:
        # Read the image
        img = cv2.imread(img_path)
        # Resize the image
        img = cv2.resize(img, IMAGE_RESOLUTION[:2])

        # Transform the color to grayscale
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Identify lungs
        img = lf.get_lungs(img, padding=0)

        # Scale the image between zero and one
        img = img / 255.0

        # Resize the image
        img = cv2.resize(img, IMAGE_RESOLUTION[:2])

        # Reshape the image
        img = np.reshape(img, IMAGE_RESOLUTION)

        return img
    except:
        # Read the image again
        img = cv2.imread(img_path)
        # Resize the image
        img = cv2.resize(img, IMAGE_RESOLUTION[:2])

        # Transform the color to grayscale
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Scale the image between zero and one
        img = img / 255.0

        # Cut the image
        img = img[
            BORDER : IMAGE_RESOLUTION[0] - BORDER, BORDER : IMAGE_RESOLUTION[0] - BORDER
        ]

        # Resize the image
        img = cv2.resize(img, IMAGE_RESOLUTION[:2])

        # Reshape the image
        img = np.reshape(img, IMAGE_RESOLUTION)

        return img

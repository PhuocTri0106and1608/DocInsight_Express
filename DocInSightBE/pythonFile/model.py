import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1' 

import numpy as np
import pickle
import matplotlib.pyplot as plt
import tensorflow as tf
import shap
import requests
from helpers_data import process_data
import sys


IMAGE_RESOLUTION = (250, 250, 1)
BORDER = 30

image_url = sys.argv[1]

response = requests.get(image_url, stream=True)
if response.status_code == 200:
    with open('pythonFile/input.jpg', 'wb') as file:
        for chunk in response.iter_content():
            file.write(chunk)
else:
    print('Image not found')
    sys.stdout.flush()
img_path = 'pythonFile/input.jpg'
data = []
data.append(process_data(img_path, IMAGE_RESOLUTION, BORDER))
image = np.array(data)

model = tf.keras.models.load_model('pythonFile/cnn6_ann3_pow10_adamax_model.h5')

with open('pythonFile/shap_values.pkl', 'rb') as file:
    shap_values = pickle.load(file)
# Plot the image explaining the predictions
shap.image_plot(shap_values, image, show=False)
f = plt.gcf()
plt.savefig('pythonFile/result.png')

predictions = model.predict(image)

result = predictions[0].tolist()

print(result)
sys.stdout.flush()

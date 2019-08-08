from flask import Flask, send_from_directory

import api_registerer
import app_constants

APP_NAME = 'Image Styler'
app = Flask(APP_NAME)


@app.route('/')
def open_home_page():
    """
    Open home page
    :return: static index html file
    """
    return send_from_directory(app_constants.PUBLIC_PATH, 'index.html')


@app.route('/modules/<path:filename>')
def send_static(filename):
    """
    Send static files requested by front end
    :param filename: the path to the static file being requested
    :return: the static file being requested
    """
    return send_from_directory(app_constants.STATIC_PATH, filename)


@app.route('/public/<path:filename>')
def send_public(filename):
    """
    Send public files like js, css requested by front end
    :param filename: the path to the public file being requested
    :return: the public file being requested
    """
    return send_from_directory(app_constants.PUBLIC_PATH, filename)


@app.route('/image/converted/<path:image_name>')
def send_converted_image(image_name):
    """
    Send the converted image as a static file
    :param image_name: file name of converted image
    :return: the converted image file being requested
    """
    return send_from_directory(app_constants.CONVERTED_IMAGE_PATH, image_name)


# test
@app.route('/upload')
def upload_file():
    return send_from_directory(app_constants.PUBLIC_PATH, 'upload.html')


api_registerer.register(app)

if __name__ == '__main__':
    app.run(debug=True)

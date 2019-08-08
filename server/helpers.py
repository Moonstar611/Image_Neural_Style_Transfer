import json
import os
from datetime import datetime

from flask.wrappers import Response
from werkzeug.utils import secure_filename

import app_constants


class FileNameUtils(object):
    def __init__(self):
        pass

    @staticmethod
    def generate_file_name(filename):
        dt_str = str(datetime.now())
        return secure_filename(dt_str + '-' + filename)

    @staticmethod
    def original_image_path(filename):
        return os.path.join(app_constants.ORIGINAL_IMAGE_PATH, filename)

    @staticmethod
    def converted_image_path(filename):
        return os.path.join(app_constants.CONVERTED_IMAGE_PATH, filename)

    @staticmethod
    def is_allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1] in app_constants.SUPPORTED_TYPE


class RestUtils(object):
    def __init__(self):
        pass

    @staticmethod
    def response(body, status_code):
        return Response(
            response=json.dumps(body, cls=_JSONEncoder),
            status=status_code,
            mimetype='application/json'
        )


class HttpCode(object):
    NOT_SUPPORTED = 415
    NOT_FOUND = 404
    INTERNAL_SERVER_ERROR = 500
    OK = 200

    def __init__(self):
        pass


class _JSONEncoder(json.JSONEncoder):
    """ This is a helper function to change the behavior of the default JSON
        encoder for (1) datetime: not JSON serializable, encode to milli
        second format; (2) use __dict__ if it is not JSON serializable.
    """

    def default(self, obj):
        try:
            return json.JSONEncoder.default(self, obj)
        except TypeError:
            return obj.__dict__

import env_params
import os
import json
from datetime import datetime
from flask.wrappers import Response
from werkzeug.utils import secure_filename


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in env_params.SUPPORTED_TYPE


def generate_img_file_name(filename):
    dt_str = str(datetime.now())
    return secure_filename(dt_str + '-' + filename)


def generate_file_path(filename):
    return os.path.join(env_params.ORIGINAL_IMAGE_PATH, filename)


def response(body, code):
    return Response(
        response=json.dumps(body, cls=_JSONEncoder),
        status=code,
        mimetype='application/json'
    )





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

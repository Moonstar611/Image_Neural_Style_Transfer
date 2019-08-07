

class RestResponse(object):

    def __init__(self, message=None, code=0):
        self.message = message
        self.code = code


class JobProgressInfo(object):

    def __init__(self, job_id, status, progress, conv_img_id):
        self.job_id = job_id
        self.status = status
        self.progress = progress
        self.converted_image_id = conv_img_id



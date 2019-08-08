from flask import Flask, request

import app_constants
from helpers import FileNameUtils, RestUtils, HttpCode
from models.db_models import Job
from models.rest_models import RestResponse
from repo_management import job_repo_service as jrs
from repo_management import original_image_repo_service as oirs
from repo_management import converted_image_repo_service as cirs
from


def register(app: Flask):
    @app.route('/api/rest/img/upload', methods=['POST'])
    def upload_original_img():
        """
        Upload the original image and save it to original image repo
        :return: response body with id assigned to the uploaded image
        :type: flask.wrappers.Response with body: rest_models.RestResponse
        """
        f = request.files['file']
        if not FileNameUtils.is_allowed_file(f.filename):
            error_msg = 'Not supported file type: '.format(f.filename)
            return RestUtils.response(RestResponse(error_msg, 1), HttpCode.NOT_SUPPORTED)
        filename = FileNameUtils.generate_file_name(f.filename)
        f.save(FileNameUtils.original_image_path(filename))
        image_id = oirs.add_new_image_file(filename)
        return RestUtils.response(RestResponse(image_id), HttpCode.OK)

    @app.route('/api/rest/job/start', methods=['POST'])
    def start_job():
        """
        Start to convert the image with img_id
        :return: response body with id assigned to the job
        :type: flask.wrappers.Response with body: rest_models.RestResponse
        """
        req_data = request.get_json()
        job_type = req_data['type']
        img_id = req_data['img_id']
        new_job = Job(job_type, img_id)
        jrs.add_job(new_job)
        # TODO:
        # job_id = job_manager

        # return helpers.response(RestResponse(job_id), 200)

    @app.route('/api/rest/job/progress/<int: job_id>', methods=['GET'])
    def get_job_progress(job_id):
        """
        Fetch and return job progress from job db
        :param job_id: id of the designated job
        :return: flask.wrappers.Response with body: rest_models.JobProgressInfo
        """
        pass

    @app.route('/api/rest/img/download/<int: converted_img_id>', methods=['GET'])
    def get_converted_image(converted_img_id):
        """
        Get the converted image
        :param converted_img_id: id of the converted image, previously returned by job api
        :return: response body with converted image file path
        :type: flask.wrappers.Response with body: rest_models.RestResponse
        """
        pass
        image_file_name = ''
        url = app_constants.CONVERTED_IMAGE_URL_TEMP.format(image_file_name)

from flask import Flask, request

import app_constants
from helpers import FileNameUtils, RestUtils, HttpCode
from models.db_models import Job
from models.rest_models import RestResponse, JobProgressInfo
from repo_management import job_repo_service as jrs
from repo_management import original_image_repo_service as oirs
from repo_management import converted_image_repo_service as cirs
from job_management import get_job_manager


def register(app: Flask):

    job_manager = get_job_manager(jrs, oirs, cirs)
    @app.route('/api/rest/img/upload', methods=['POST'])
    def upload_original_img():
        """
        Upload the original image and save it to original image repo
        :return: response body with id assigned to the uploaded image
        :type: flask.wrappers.Response with body: rest_models.RestResponse
        """
        f = request.files['file']
        print(type(f))
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
        job_id = jrs.add_job(new_job)
        job_manager.start_job(job_id)
        return RestUtils.response(RestResponse(job_id), 200)

    @app.route('/api/rest/job/progress/<int:job_id>', methods=['GET'])
    def get_job_progress(job_id):
        """
        Fetch and return job progress from job db
        :param job_id: id of the designated job
        :return: flask.wrappers.Response with body: rest_models.JobProgressInfo
        """
        try:
            job = jrs.find_job_by_id(job_id)
        except ValueError as e:
            msg = "Job not found"
            error_body = RestResponse(msg, 1)
            return RestUtils.response(error_body, HttpCode.INTERNAL_SERVER_ERROR)
        body = JobProgressInfo(job.job_id, job.status, job.progress, job.converted_image_id)
        return RestUtils.response(body, HttpCode.OK)

    @app.route('/api/rest/img/original/<int:original_img_id>', methods=['GET'])
    def get_original_image_url(original_img_id):
        """
        Get the original image
        :param original_img_id: id of the converted image, previously returned by job api
        :return: response body with converted image file path
        :type: flask.wrappers.Response with body: rest_models.RestResponse
        """
        image = oirs.find_image_by_id(original_img_id)
        file_name = image.name
        url = app_constants.ORIGINAL_IMAGE_URL_TEMP.format(file_name)
        body = RestResponse(url)
        return RestUtils.response(body, HttpCode.OK)

    @app.route('/api/rest/img/converted/<int:converted_img_id>', methods=['GET'])
    def get_converted_image_url(converted_img_id):
        """
        Get the converted image
        :param converted_img_id: id of the converted image, previously returned by job api
        :return: response body with converted image file path
        :type: flask.wrappers.Response with body: rest_models.RestResponse
        """
        image = cirs.find_image_by_id(converted_img_id)
        file_name = image.name
        url = app_constants.CONVERTED_IMAGE_URL_TEMP.format(file_name)
        body = RestResponse(url)
        return RestUtils.response(body, HttpCode.OK)

import json
import os

from helpers import _JSONEncoder
from models.db_models import ImageRepo, JobRepo, ImageModel, Job

ORG_IMG_REPO_DIR = os.path.join('../storage/', 'org_img_repo.json')
CONV_IMG_REPO_DIR = os.path.join('../storage/', 'conv_img_repo.json')
JOB_REPO_DIR = os.path.join('../storage/', 'job_repo.json')


class _ImageRepoService(object):

    def __init__(self, image_repo_dir):
        self.image_repo_dir = image_repo_dir
        with open(self.image_repo_dir, 'r') as f:
            json_obj = json.load(f)
            self.image_repo = ImageRepo(json_obj)

    def _reload(self):
        with open(self.image_repo_dir, 'r') as f:
            json_obj = json.load(f)
            self.image_repo = ImageRepo(json_obj)

    def _save(self):
        with open(self.image_repo_dir, 'w') as f:
            json.dump(self.image_repo, f, cls=_JSONEncoder)
        self._reload()

    def add_image(self, image):
        image_id = self.image_repo.add_image(image)
        self._save()
        return image_id

    def add_new_image_file(self, filename):
        image = ImageModel(filename)
        image_id = self.add_image(image)
        return image_id

    def delete_image_by_id(self, image_id):
        self.image_repo.delete_image_by_id(image_id)
        self._save()

    def delete_image_by_name(self, image_name):
        self.image_repo.delete_image_by_name(image_name)
        self._save()

    def find_image_by_id(self, image_id):
        return self.image_repo.find_image_by_id(image_id)

    def find_image_by_name(self, image_name):
        return self.image_repo.find_image_by_name(image_name)


class _JobRepoService(object):

    def __init__(self, job_repo_dir):
        self.job_repo_dir = job_repo_dir
        with open(self.job_repo_dir, 'r') as f:
            json_obj = json.load(f)
            self.job_repo = JobRepo(json_obj)

    def _reload(self):
        with open(self.job_repo_dir, 'r') as f:
            json_obj = json.load(f)
            self.job_repo = JobRepo(json_obj)

    def _save(self):
        with open(self.job_repo_dir, 'w') as f:
            json.dump(self.job_repo, f, cls=_JSONEncoder)
        self._reload()

    def add_job(self, job: Job):
        job_id = self.job_repo.add_job(job)
        self._save()
        return job_id

    def delete_job_by_id(self, job_id):
        self.job_repo.delete_job_by_id(job_id)
        self._save()

    def find_job_by_id(self, job_id):
        return self.job_repo.find_job_by_id(job_id)

    def update_job(self, job: Job):
        try:
            old_job = self.find_job_by_id(job.job_id)
        except ValueError:
            raise ValueError('Cannot find the job with id: {} to update'.format(job.job_id))
        old_job.type = job.type
        old_job.original_image_id = job.original_image_id
        old_job.converted_image_id = job.converted_image_id
        old_job.status = job.status
        old_job.progress = job.progress
        self._save()

    def update_job_progress(self, job_id, progress: int):
        if type(progress) != int or progress < 0 or progress > 100:
            raise TypeError('Job progress should be integer between 0 and 100')
        try:
            old_job = self.find_job_by_id(job_id)
        except ValueError:
            raise ValueError('Cannot find the job with id: {} to update'.format(job_id))
        old_job.progress = progress
        self._save()

    def update_job_status(self, job_id, status):
        if status != Job.JobStatus.NOT_STARTED and status != Job.JobStatus.RUNNING \
                and status != Job.JobStatus.FINISHED and status != Job.JobStatus.FAILED:
            raise TypeError('Job status not supported: {}'.format(status))
        try:
            old_job = self.find_job_by_id(job_id)
        except ValueError:
            raise ValueError('Cannot find the job with id: {} to update'.format(job_id))
        old_job.status = status
        self._save()

    def update_job_conv_img(self, job_id, conv_img_id):
        try:
            old_job = self.find_job_by_id(job_id)
        except ValueError:
            raise ValueError('Cannot find the job with id: {} to update'.format(job_id))
        old_job.converted_image_id = conv_img_id
        self._save()


original_image_repo_service = _ImageRepoService(ORG_IMG_REPO_DIR)
converted_image_repo_service = _ImageRepoService(CONV_IMG_REPO_DIR)
job_repo_service = _JobRepoService(JOB_REPO_DIR)

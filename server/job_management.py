import threading
import time

from models.db_models import Job, Image
from repo_management import _JobRepoService, _ImageRepoService


class _JobManager(object):

    def __init__(self, job_repo_svc: _JobRepoService, org_img_repo_svc: _ImageRepoService,
                 conv_img_repo_svc: _ImageRepoService):
        self.job_repo_svc = job_repo_svc
        self.org_img_repo_svc = org_img_repo_svc
        self.conv_img_repo_svc = conv_img_repo_svc
        self._running_jobs_map = {}  # {job_id: conversion_job}
        self.progress_listener = _ProgressListener(self._running_jobs_map, self.job_repo_svc)
        self.progress_listener.start()

    def _reset_listener(self):
        self.progress_listener.stop_listen()
        self.progress_listener = _ProgressListener(self._running_jobs_map, self.job_repo_svc)

    def _start_listener(self):
        if self.progress_listener.is_alive():
            return
        else:
            self.progress_listener.start()

    def start_job(self, job_id):
        job = self.job_repo_svc.find_job_by_id(job_id)
        image = self.org_img_repo_svc.find_image_by_id(job.original_image_id)
        conv_job = _ConversionJob(job, image)
        self._running_jobs_map[conv_job.id] = conv_job
        conv_job.start()


class _ProgressListener(threading.Thread):

    def __init__(self, job_map, job_repo_svc: _JobRepoService, interval=4):
        super(_ProgressListener, self).__init__()
        self.job_map = job_map
        self.job_repo_svc = job_repo_svc
        self.running = True
        self.interval = interval

    def run(self):
        while self.running:
            need_to_delete = 0
            for job_id in self.job_map:
                conversion_job = self.job_map[job_id]  # type: _ConversionJob
                status = conversion_job.status
                self.job_repo_svc.update_job_status(job_id, status)
                if status == Job.JobStatus.RUNNING:
                    progress = self.job_repo_svc.find_job_by_id(job_id).progress + 3
                    self.job_repo_svc.update_job_progress(job_id, progress)
                elif status == Job.JobStatus.FAILED:
                    need_to_delete = job_id
                    break
                elif status == Job.JobStatus.FINISHED:
                    self.job_repo_svc.update_job_progress(job_id, 100)
                    self.job_repo_svc.update_job_conv_img(job_id, conversion_job.converted_image_id)
                    need_to_delete = job_id
                    break
            if need_to_delete != 0:
                del self.job_map[need_to_delete]
            time.sleep(self.interval)

    def stop_listen(self):
        self.running = False


class _ConversionJob(threading.Thread):

    def __init__(self, job: Job, org_image: Image):
        super(_ConversionJob, self).__init__()
        self.job = job
        self.org_image = org_image
        self.id = job.job_id
        self.converted_image_id = None
        self.status = job.status

    def run(self):
        self.status = Job.JobStatus.RUNNING
        # # TODO:
        # try:
        #     pass
        # except:
        #     self.status = Job.JobStatus.FAILED
        # self.converted_image = ''
        # self.status = Job.JobStatus.FINISHED
        time.sleep(30)
        self.status = Job.JobStatus.FINISHED
        self.converted_image_id = 1


def get_job_manager(job_repo_svc, org_img_repo_svc, conv_img_repo_svc):
    print("Job manager generated")
    return _JobManager(job_repo_svc, org_img_repo_svc, conv_img_repo_svc)

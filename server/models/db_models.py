import datetime


class ImageRepo(object):

    def __init__(self, json_obj):
        self.images = [Image.create_image_from_json(o) for o in json_obj['images']]  # type: list
        self.time = json_obj['time']

    def add_image(self, new_image):
        if new_image.image_id:
            raise ValueError('Image ID should be empty!')
        new_image.image_id = self._generate_id()
        self.images.append(new_image)
        self._update_time()
        return new_image.image_id

    def delete_image_by_name(self, image_name):
        for image in self.images:
            if image_name == image.name:
                self.images.remove(image)
                self._update_time()
        raise ValueError("Cannot find image with name: {}".format(image_name))

    def delete_image_by_id(self, image_id):
        for image in self.images:
            if image_id == image.image_id:
                self.images.remove(image)
                self._update_time()
        raise ValueError("Cannot find image with id: {}".format(image_id))

    def find_image_by_name(self, image_name):
        for image in self.images:
            if image_name == image.name:
                return image
        raise ValueError("Cannot find image with name: {}".format(image_name))

    def find_image_by_id(self, image_id):
        for image in self.images:
            if image_id == image.image_id:
                return image
        raise ValueError("Cannot find image with id: {}".format(image_id))

    def _update_time(self):
        self.time = str(datetime.datetime.now())

    def _generate_id(self):
        image_ids = [image.image_id for image in self.images]
        if len(image_ids) == 0:
            return 1
        image_ids.sort()
        return image_ids[-1] + 1


class Image(object):

    def __init__(self, img_name, image_id=None, job_id=None):
        self.name = img_name
        self.image_id = image_id
        self.job_id = job_id

    @staticmethod
    def create_image_from_json(json_obj):
        return Image(json_obj['name'], json_obj['image_id'], json_obj['job_id'])


class JobRepo(object):

    def __init__(self, json_obj):
        self.jobs = [Job.create_job_from_json(j) for j in json_obj['jobs']]  # type: list
        self.time = json_obj['time']

    def add_job(self, new_job):
        if new_job.job_id:
            raise ValueError('Job id should be empty!')
        new_job.job_id = self._generate_id()
        self.jobs.append(new_job)
        self._update_time()
        return new_job.job_id

    def delete_job_by_id(self, job_id):
        for job in self.jobs:
            if job_id == job.job_id:
                self.jobs.remove(job)
                self._update_time()
        raise ValueError("Cannot find job with id: {}".format(job_id))

    def find_job_by_id(self, job_id):
        for job in self.jobs:
            if job_id == job.job_id:
                return job
        raise ValueError("Cannot find job with id: {}".format(job_id))

    def find_job_by_org_image_id(self, original_image_id):
        for job in self.jobs:
            if original_image_id == job.original_image_id:
                return job
        raise ValueError("Cannot find job with original image id: {}".format(original_image_id))

    def find_job_by_conv_image_id(self, converted_image_id):
        for job in self.jobs:
            if converted_image_id == job.converted_image_id:
                return job
        raise ValueError("Cannot find job with converted image id: {}".format(converted_image_id))

    def _update_time(self):
        self.time = str(datetime.datetime.now())

    def _generate_id(self):
        job_ids = [job.job_id for job in self.jobs]
        if len(job_ids) == 0:
            return 1
        job_ids.sort()
        return job_ids[-1] + 1


class Job(object):
    class JobType(object):
        TYPE_1 = '1'
        TYPE_2 = '2'
        TYPE_3 = '3'
        TYPE_4 = '4'

    class JobStatus(object):
        NOT_STARTED = 'NOT STARTED'
        RUNNING = 'RUNNING'
        FINISHED = 'FINISHED'
        FAILED = 'FAILED'

    def __init__(self, job_type, org_img_id, conv_img_id=None, job_id=None, job_status=JobStatus.NOT_STARTED,
                 job_progress=0):
        self.type = job_type
        self.original_image_id = org_img_id
        self.converted_image_id = conv_img_id
        self.job_id = job_id
        self.status = job_status
        self.progress = job_progress

    @staticmethod
    def create_job_from_json(json_obj):
        return Job(json_obj['type'],
                   json_obj['original_image_id'],
                   json_obj['converted_image_id'],
                   json_obj['job_id'],
                   json_obj['status'],
                   json_obj['progress'])

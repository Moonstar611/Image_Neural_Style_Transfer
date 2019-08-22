define(['_setup/angular-core-object'], function (CoreObject) {
  const PIC_TRANFORM_URL = '/api/rest/job/start';
  const CONV_PIC_URL_URL = '/api/rest/img/converted/';
  const JOB_PROGRESS_URL = '/api/rest/job/progress/';

  return CoreObject.extend({
    init: ['$http', function ($http) {
      this.$http = $http;
    }],

    startTransformJob: function (data) {
      return this.$http({
        method: 'POST',
        url: PIC_TRANFORM_URL,
        data: data
      }).then(
        function success(response) {
          // return job id
          return response.data.message;
        }.bind(this),
        function error(errorResponse) {
          console.log('Failed to start transformation.');
          return false;
        }.bind(this)
      );
    },

    getConvertedPicUrl: function (conv_pic_id) {
      return this.$http({
        method: 'GET',
        url: CONV_PIC_URL_URL + conv_pic_id
      }).then(
        function success(response) {
          return response.data.message;
        }.bind(this),
        function error(errorResponse) {
          return '';
        }.bind(this)
      );
    },
    //   self.job_id = job_id
    // self.status = status
    // self.progress = progress
    // self.converted_image_id = conv_img_id

    //   class JobStatus(object):
    // NOT_STARTED = 'NOT STARTED'
    // RUNNING = 'RUNNING'
    // FINISHED = 'FINISHED'
    // FAILED = 'FAILED'

    fetchTransformationProgress: function (job_id) {
      return this.$http({
        method: 'GET',
        url: JOB_PROGRESS_URL + job_id
      }).then(
        function success(response) {
          return response.data;
        }.bind(this),
        function error(errorResponse) {
          return false;
        }.bind(this)
      );
    }
  });
});
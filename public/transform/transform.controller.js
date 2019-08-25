define(['_setup/angular-core-object'], function (CoreObject) {
  const MESSAGES = {
    TRANSFORM: {
      START_FAIL: 'Encountered problem when starting transformation job.',
      JOB_FAIL: 'Transformation Job failed!',
      PROGRESS_FAIL: 'Failed to retrieve job progress',
      JOB_SUCCESS: 'Successfully transformed your image, click SHOW RESULT to checkout the result'
    },
    IMAGE: {
      GET_FAIL: 'Failed to get transformed picture with id: ',
      GET_INFO_FAIL: 'Failed to retrieve template picture information or original picture information.'
    }
  };

  return CoreObject.extend({
    init: ['$state', '$interval', 'transformService', function ($state, $interval, transformService) {
      this.$state = $state;
      this.$interval = $interval;
      this.transformService = transformService;
      this.localStorage = localStorage;
      this.loading = false;
      this.showInfoBanner = false;
      this.infoMessage = '';
      this.originalPic = this.loadOrgPic();
      this.tempPic = this.loadTempPic();
      this.convertedPic = {id: null, url: ''};
      this.job_id = 0;
      this.percentDone = 0;
      this.progressIntervalInMilliseconds = 2000;
      this.jobFailed = false;
      this.jobSucceeded = false;
    }],

    startTransform: function () {
      this.jobFailed = false;
      this.loading = true;
      this.showInfoBanner = false;
      this.infoMessage = '';
      if (this.tempPic.id == null || !this.originalPic.id == null) {
        this.loading = false;
        this.jobFailed = true;
        this.infoMessage = MESSAGES.IMAGE.GET_INFO_FAIL;
        this.showInfoBanner = true;
        return;
      }
      var body = {
        type: this.tempPic.id,
        img_id: this.originalPic.id
      };
      this.transformService.startTransformJob(body).then(
        function success(id) {
          if (id) {
            this.job_id = id;
            this.progressPoller = this.$interval(function () {
              this.fetchTransformationProgress();
            }.bind(this), this.progressIntervalInMilliseconds);
          } else {
            this.loading = false;
            this.showInfoBanner = true;
            this.infoMessage = MESSAGES.TRANSFORM.START_FAIL;
            this.jobFailed = true;
          }
        }.bind(this)
      );
    },

    fetchTransformationProgress: function () {
      this.transformService.fetchTransformationProgress(this.job_id).then(
        function success(res) {
          if (res === false) {
            this.stopAndFailedJobProgress(MESSAGES.TRANSFORM.PROGRESS_FAIL);
          } else if (res.status === 'FAILED') {
            this.stopAndFailedJobProgress(MESSAGES.TRANSFORM.JOB_FAIL);
          } else if (res.status === 'RUNNING') {
            this.percentDone = res.progress;
          } else if (res.status === 'FINISHED') {
            this.stopAndSuccess(res.converted_image_id);
          }
        }.bind(this));
    },

    stopAndFailedJobProgress: function (infoMessage) {
      if (this.progressPoller) {
        this.$interval.cancel(this.progressPoller);
      }
      this.jobFailed = true;
      this.showInfoBanner = true;
      this.infoMessage = infoMessage;
      this.percentDone = 0;
      this.loading = false;
    },

    stopAndSuccess: function (convPicId) {
      if (this.progressPoller) {
        this.$interval.cancel(this.progressPoller);
      }
      this.transformService.getConvertedPicUrl(convPicId).then(
        function success(url) {
          if (url) {
            this.convertedPic.id = convPicId;
            this.convertedPic.url = url;
            this.percentDone = 100;
            this.infoMessage = MESSAGES.TRANSFORM.JOB_SUCCESS;
            this.saveConvertedPic();
            this.jobSucceeded = true;
          } else {
            this.percentDone = 0;
            this.infoMessage = MESSAGES.IMAGE.GET_FAIL + convPicId;
            this.jobFailed = true;
          }
          this.showInfoBanner = true;
          this.loading = false;
        }.bind(this)
      );
    },

    loadOrgPic: function () {
      if (this.localStorage.getItem('originalPic')) {
        return JSON.parse(this.localStorage.getItem('originalPic'));
      } else {
        return {id: null, url: ''};
      }
    },

    loadTempPic: function () {
      if (this.localStorage.getItem('tempPicSelection')) {
        return JSON.parse(this.localStorage.getItem('tempPicSelection'));
      } else {
        return {id: null, url: ''};
      }
    },

    saveConvertedPic: function () {
      this.localStorage.setItem('convertedPic', JSON.stringify(this.convertedPic));
    },

    goToResult: function () {
      this.$state.go('result');
    },

    goToUpload: function () {
      this.$state.go('upload');
    }

  });
});
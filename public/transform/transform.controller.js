define(['_setup/angular-core-object'], function (CoreObject) {

  const JOB_PROGRESS_URL = '/api/rest/job/progress/';
  const EXPECTED_DURATION_SECONDS = 20;

  return CoreObject.extend({
    init: ['$state', '$http', '$interval', 'transformService', function ($state, $http, $interval, transformService) {
      this.$state = $state;
      this.$http = $http;
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
    }],

    startTransform: function () {
      this.loading = true;
      this.showInfoBanner = false;
      this.infoMessage = '';
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
            this.infoMessage = "Encountered problem when starting transformation job."
          }
        }.bind(this)
      );
    },

    fetchTransformationProgress: function() {
      this.transformService.fetchTransformationProgress(this.job_id).then(
        function success(res) {
          if (!res) {
            this.stopAndFailedJobProgress("Failed to retrieve job progress!");
          } else if (res.status === 'FAILED') {
            this.stopAndFailedJobProgress("Transformation Job failed!");
          } else if (res.status === 'RUNNING') {
            this.percentDone = res.progress;
          } else if (res.status === 'FINISHED') {
            this.stopAndSuccess(res.converted_image_id);
          }
        }.bind(this));
    },

    stopAndFailedJobProgress: function(infoMessage) {
      if (this.progressPoller) {
        this.$interval.cancel(this.progressPoller);
      }
      this.showInfoBanner = true;
      this.infoMessage = infoMessage;
      this.percentDone = 0;
      this.loading = false;
    },
    
    stopAndSuccess: function(convPicId) {
      if (this.progressPoller) {
        this.$interval.cancel(this.progressPoller);
      }
      this.percentDone = 100;
      this.loading = false;
      this.transformService.getConvertedPicUrl(convPicId).then(
        function success(url) {
          if (url) {
            this.convertedPic.id = convPicId;
            this.convertedPic.url = url;
            this.showInfoBanner = true;
            this.infoMessage = "Successfully transformed picture";
            this.saveConvertedPic();
          } else {
            this.showInfoBanner = true;
            this.infoMessage = "Failed to get transformed picture with id: " + convPicId;
          }
        }.bind(this)
      );
    },

    loadOrgPic: function () {
      if (this.localStorage.getItem('originalPic')) {
        return JSON.parse(this.localStorage.getItem('originalPic'));
      } else {
        return {id: 0, url: ''};
      }
    },

    loadTempPic: function () {
      if (this.localStorage.getItem('tempPicSelection')) {
        return JSON.parse(this.localStorage.getItem('tempPicSelection'));
      } else {
        return {id: 0, url: ''};
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
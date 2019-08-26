define(['_setup/angular-core-object'], function (CoreObject) {
  return CoreObject.extend({

    init: ['$state', '$cookies', '$http', '$scope', 'uploadService', function ($state, $cookies, $http, $scope, uploadService) {

      this.$state = $state;
      this.$cookies = $cookies;
      this.$http = $http;
      this.$scope = $scope;
      this.localStorage = localStorage;
      this.uploadService = uploadService;
      this.showLoadingBar = false;
      this.showInfoBanner = false;
      this.infoMessage = '';
      this.originalPic = this.loadOrgPic();
      this.labelMessage = 'Select A Image ...';
      this.$scope.SelectFile = function (e) {
        this.labelMessage = e.target.files[0].name;
      }.bind(this);
      this.jobSucceeded = false;
      this.jobFailed = false;
      // if (this.originalPic.id != null) {
      //   // var orgPicUrlPromise = this.uploadService.getOrgPicUrl(this.originalPic.id);
      //   // orgPicUrlPromise.then(
      //   //     function success(url){
      //   //         if (url) {
      //   //             this.pic_url = url;
      //   //             this.showPicPreview = true;
      //   //         } else {
      //   //             this.pic_url = "";
      //   //             this.showPicPreview = false;
      //   //         }
      //   //     }.bind(this)
      //   // )
      //   this.showPicPreview = true;
      // } else {
      //   this.showPicPreview = false;
      // }
      this.showPicPreview = this.originalPic.id != null
    }],

    upload: function () {
      var file = this.$scope.myFile;
      console.log('file is ');
      console.dir(file);
      this.showInfoBanner = false;
      this.infoMessage = '';
      var uploadPromise = this.uploadService.uploadOriginalPicture(file);
      uploadPromise.then(
        function success(id) {
          if (id) {
            var orgPicUrlPromise = this.uploadService.getOrgPicUrl(id);
            orgPicUrlPromise.then(
              function success(url) {
                if (url) {
                  this.jobSucceeded = true;
                  this.originalPic.id = id;
                  this.originalPic.url = url;
                  this.showPicPreview = true;
                  this.infoMessage = 'Successfully uploaded the selected picture.';
                  this.showInfoBanner = true;
                } else {
                  this.jobFailed = true;
                  this.originalPic = {id: null, url: ''};
                  this.showPicPreview = false;
                  this.showInfoBanner = true;
                  this.infoMessage = 'Failed to upload the selected picture.';
                }
              }.bind(this)
            );
          } else {
            this.jobFailed = true;
            this.originalPic = {id: null, url: ''};
            this.showPicPreview = false;
            this.showInfoBanner = true;
            this.infoMessage = 'Failed to upload the selected picture.';
          }
        }.bind(this)
      );
    },

    uploadEnable: function () {
      return !!this.$scope.myFile
    },

    saveOrgPic: function () {
      this.localStorage.setItem('originalPic', JSON.stringify(this.originalPic));
    },

    loadOrgPic: function () {
      if (this.localStorage.getItem('originalPic')) {
        return JSON.parse(this.localStorage.getItem('originalPic'));
      } else {
        return {id: null, url: ''};
      }
    },

    goToTransform: function () {
      this.saveOrgPic();
      this.$state.go('transform');
    },

    goToSelect: function () {
      this.$state.go('select');
    }

  });
});
define(['_setup/angular-core-object'], function (CoreObject) {
  var PIC_UPLOAD_URL = '/api/rest/img/upload';
  var ORG_PIC_URL_URL = '/api/rest/img/original/';

  return CoreObject.extend({
    init: ['$http', function ($http) {
      this.$http = $http;
    }],

    uploadOriginalPicture: function (file) {
      var fd = new FormData();
      fd.append('file', file);
      return this.$http({
        method: 'POST',
        url: PIC_UPLOAD_URL,
        data: fd,
        headers: {
          'Content-Type': undefined
        }
      }).then(
        function success(response) {
          return response.data.message;
        }.bind(this),
        function error() {
          console.log('Failed to upload picture.');
          return false;
        }.bind(this)
      );
    },

    getOrgPicUrl: function (id) {
      return this.$http({
        method: 'GET',
        url: ORG_PIC_URL_URL + id
      }).then(
        function success(response) {
          return response.data.message;
        }.bind(this),
        function error(errorResponse) {
          return '';
        }.bind(this)
      );
    }
  });
});
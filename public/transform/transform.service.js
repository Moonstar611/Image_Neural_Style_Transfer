define(['_setup/angular-core-object'], function(CoreObject) {
    var PIC_TRANFORM_URL = '/api/rest/job/start';
    var CONV_PIC_URL_URL = '/api/rest/img/converted/';

    return CoreObject.extend({
        init: ["$http", function ($http) {
            this.$http = $http;
        }],

        startTransformJob: function(data) {
            return this.$http({
                method: 'POST',
                url: PIC_TRANFORM_URL,
                data: data
            }).then(
                function success(response) {
                    return response.data.message;
                }.bind(this),
                function error(errorResponse) {
                    console.log("Failed to start tranformation.");
                    return false;
                }.bind(this)
            );
        },

        getConvertedPicUrl: function(id) {
            return this.$http({
                method: 'GET',
                url: PIC_URL_URL + id
            }).then(
                function success(response) {
                    return response.data.message;
                }.bind(this),
                function error(errorResponse) {
                    return '';
                }.bind(this)
            );
        },
    });
});
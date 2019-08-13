define(['_setup/angular-core-object'], function(CoreObject) {

    var JOB_PROGRESS_URL = '/api/rest/job/progress/';

    return CoreObject.extend({
        init: ["$state", "$http", "$interval", transformService, function ($state, $http, $interval, transformService) {
            this.$state = $state;
            this.$http = $http;
            this.$interval = $interval;
            this.transformService = transformService;
            this.localStorage = localStorage;
            this.showLoadingBar = false;
            this.showErrorBanner = false;
            this.originalPic = this.loadOrgPic();
            this.tempPic = this.loadTempPic();
            this.convertedPic = {id:null, url:""}
        }],

        startTransform: function() {
            this.showLoadingBar = true;
            body = {
                type: this.tempPic.id,
                img_id: this.originalPic.id
            }
            var uploadPromise = this.transformService.startTransformJob(body);
            uploadPromise.then(
                function success(id) {
                    if (id) {

                        
                    } else {
                        this.showErrorBanner = true;
                        this.showLoadingBar = false;
                    }
                }.bind(this)
            )
        },

        loadOrgPic: function() {
            if (this.localStorage.getItem('originalPic')) {
                return JSON.parse(this.localStorage.getItem('originalPic'));
            } else {
                return {id: 0, url: ""};
            }
        },

        loadTempPic: function() {
            if (this.localStorage.getItem('tempPicSelection')) {
                return JSON.parse(this.localStorage.getItem('tempPicSelection'));
            } else {
                return {id: 0, url: this.selections[0].url};
            }
        },

        saveConvertedPic: function() {
            this.localStorage.setItem('convertedPic', JSON.stringify(this.convertedPic));
        },

        goToResult: function() {
            this.saveOrgPic();
            this.$state.go('transform');
        },
        
        goToSelect: function() {
            this.$state.go('select');
        }

    });
});
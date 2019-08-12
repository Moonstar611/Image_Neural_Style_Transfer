define(['_setup/angular-core-object'], function(CoreObject) {
    return CoreObject.extend({
        
        init: ["$state", "$cookies", "$http", "$scope", "uploadService", function ($state, $cookies, $http, $scope, uploadService) {
            
            this.$state = $state;
            this.$cookies = $cookies;
            this.$http = $http;
            this.$scope = $scope;
            this.localStorage = localStorage;
            this.uploadService = uploadService;
            this.showLoadingBar = false;
            this.originalPic = this.loadOrgPic();
            if (!!this.originalPic.id) {
                // var orgPicUrlPromise = this.uploadService.getOrgPicUrl(this.originalPic.id);
                // orgPicUrlPromise.then(
                //     function success(url){
                //         if (url) {
                //             this.pic_url = url;
                //             this.showPicPreview = true;
                //         } else {
                //             this.pic_url = "";
                //             this.showPicPreview = false;
                //         }
                //     }.bind(this)
                // )
                this.showPicPreview = true;
            } else {
                this.showPicPreview = false;
            }
        }],

        

        upload: function() {
            var file = this.$scope.myFile;
            console.log('file is ' );
            console.dir(file);
            this.showLoadingBar = true;
            var uploadPromise = this.uploadService.uploadOriginalPicture(file);
            uploadPromise.then(
                function success(id) {
                    if (id) {
                        var orgPicUrlPromise = this.uploadService.getOrgPicUrl(id);
                        orgPicUrlPromise.then(
                            function success(url){
                                if (url) {
                                    this.originalPic.id = id;
                                    this.originalPic.url = url;
                                    this.showPicPreview = true;
                                } else {
                                    this.originalPic = {id: 0, url: ""}
                                    this.showPicPreview = false;
                                }
                            }.bind(this)
                        )
                    } else {
                        this.originalPic = {id: 0, url: ""}
                        this.showPicPreview = false;
                    }
                }.bind(this)
            )
        },

        // saveOrgPic: function() {
        //     this.$cookies.put('originalPic', JSON.stringify(this.originalPic));
        // },

        // loadOrgPic: function() {
        //     return JSON.parse(this.$cookies.get('originalPic')) || {id: 0, url: ""};
        // },

        saveOrgPic: function() {
            this.localStorage.setItem('originalPic', JSON.stringify(this.originalPic));
        },

        loadOrgPic: function() {
            if (this.localStorage.getItem('originalPic')) {
                return JSON.parse(this.localStorage.getItem('originalPic'));
            } else {
                return {id: 0, url: ""};
            }
        },

        goToTransform: function() {
            this.saveOrgPic();
            this.$state.go('transform');
        },
        
        goToSelect: function() {
            this.$state.go('select');
        }

    });
});
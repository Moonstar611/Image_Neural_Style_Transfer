define(['select/select', 'upload/upload'], function (Select, Upload) {
        //jQuery, canvas and the app/sub module are all
        //loaded and can be used here now.
        var ImageStyle = angular.module("image.style",[    
        "ui.router",
        "ngCookies",
        Select.name,
        Upload.name
        ])
        .config(function ($stateProvider, $urlRouterProvider){
            $urlRouterProvider.otherwise("/select");           
        });
        return ImageStyle;
    });
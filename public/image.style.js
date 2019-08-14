define(['select/select', 'upload/upload', 'transform/transform', 'result/result'], function (Select, Upload, Transform, Result) {
  //jQuery, canvas and the app/sub module are all
  //loaded and can be used here now.
  var ImageStyle = angular.module('image.style', [
    'ui.router',
    'ngCookies',
    Select.name,
    Upload.name,
    Transform.name,
    Result.name
  ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/select');
    });
  return ImageStyle;
});
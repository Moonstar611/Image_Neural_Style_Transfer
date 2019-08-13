define(['./upload.controller', './upload.service'], function (UploadController, UploadService) {
  var moduleName = 'upload';
  var Upload = angular.module(moduleName, ['ui.router'])
    .service('uploadService', UploadService)
    .directive('fileModel', function ($parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          element.bind('change', function () {
            scope.$apply(function () {
              modelSetter(scope, element[0].files[0]);
            });
          });
        }
      };
    })
    .controller(moduleName + '.UploadController', UploadController);
    Upload.config(function ($stateProvider) {
      $stateProvider.state('upload', {
        url: '/upload',
        views: {
          'main@': {
            templateUrl: '/public/upload/upload.template.html',
            controller: moduleName + '.UploadController',
            controllerAs: 'ctrl'
          }
        }
      });
    });
    return Upload;
});
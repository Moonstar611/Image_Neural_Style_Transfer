define(['./transform.controller', './transform.service'], function (TransformController, transformServiceService) {
  var moduleName = 'transform';
  return angular.module(moduleName, ['ui.router'])
    .service('transformService', transformServiceService)
    .controller(moduleName + '.TransformController', TransformController)
    .config(function ($stateProvider) {
      $stateProvider.state('transform', {
        url: '/transform',
        views: {
          'main@': {
            templateUrl: '/public/transform/transform.template.html',
            controller: moduleName + '.TransformController',
            controllerAs: 'ctrl'
          }
        }
      });
    });
});
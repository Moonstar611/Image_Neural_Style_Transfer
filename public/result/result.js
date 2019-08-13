define(['./result.controller'], function (ResultController) {
    var moduleName = 'result';
    return angular.module(moduleName, ['ui.router'])
      .controller(moduleName + '.ResultController', ResultController)
      .config(function ($stateProvider) {
        $stateProvider.state('result', {
          url: '/result',
          views: {
            'main@': {
              templateUrl: '/public/result/result.template.html',
              controller: moduleName + '.ResultController',
              controllerAs: 'ctrl'
            }
          }
        });
      });
  });
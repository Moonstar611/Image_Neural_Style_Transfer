define(['./select.controller'], function (SelectController) {
  var moduleName = 'select';
  return angular.module(moduleName, ['ui.router'])
    .controller(moduleName + '.SelectController', SelectController)
    .config(function ($stateProvider) {
      $stateProvider.state('select', {
        url: '/select',
        views: {
          'main@': {
            templateUrl: '/public/select/select.template.html',
            controller: moduleName + '.SelectController',
            controllerAs: 'ctrl'
          }
        }
      });
    });
});
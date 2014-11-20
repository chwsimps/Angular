(function () {

  var app = angular.module('MorningRoutine', ['ngRoute', 'restangular']);

  app.config( function ($routeProvider, RestangularProvider) {

RestangularProvider.setBaseUrl('http://tiy-atl-fe-server.herokuapp.com/collections/');

  $routeProvider.when('/', {
    templateUrl: 'templates/tasks.html',
    controller: 'taskController'
  });

  $routeProvider.when('/add')
    templateUrl: 'templates/add.html',
    controller: 'taskController'
  });

  //app.directive()

}());

(function () {

  var app = angular.module('MorningRoutine', ['ngRoute', 'restangular']);

  app.config( function ($routeProvider, RestangularProvider) {

RestangularProvider.setBaseUrl('http://tiy-atl-fe-server.herokuapp.com/collections/');

    $routeProvider.when('/', {
      templateUrl: 'templates/tasks.html',
      controller: 'TasksController'
    });

    $routeProvider.when('/add', {
      templateUrl: 'templates/add.html',
      controller: 'TasksController'
    });
  });

  app.directive('removeli', function(){
    return function($scope, element, attrs){
      element.bind('click', function(){
        console.log('delete');  document.getElementById('task-list').removeChild(document.getElementById('task-list').lastChild);


      });
    };
});

}());

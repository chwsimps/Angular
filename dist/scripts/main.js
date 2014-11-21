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

(function () {

  angular.module('MorningRoutine')
  .factory('taskFactory', ['$rootScope', 'Restangular', function ($rootScope, Restangular) {

  var taskBase = Restangular.all('routinelist3')

  function getTasks () {
    return taskBase.getList();
  }

  function getTask () {
    return taskBase.get(id);
  }

  function addTask (task) {
    taskBase.post(task).then( function () {
      $rootScope.$broadcast('task:added');
    });
  }

  function doneTask (task) {
    taskBase.delete(task).then( function () {
      $rootScope.$broadcast('tasks:deleted');
    });
  }

  // function doneTask ( task ) {
  //   var delete_task = $scope.tasks[task];
  //
  //   API.DeletePerson({ id: delete_task.id }, function (success) {
  //     $scope.tasks.splice(task, 1);
  //   });
  // };

  return {
    getTasks: getTasks,
    getTask: getTask,
    addTask: addTask,
    doneTask: doneTask
  }

  }]);

}());

(function () {

  angular.module('MorningRoutine')
  .controller('TasksController', ['taskFactory', '$scope', '$location', '$rootScope', function (taskFactory, $scope, $location, $rootScope) {

    taskFactory.getTasks().then( function(results) {
      $scope.tasks = results;
    });

    $scope.addTask = function (task) {
      taskFactory.addTask(task);

      $rootScope.$on('task:added', function () {
        $location.path('/');

        $('input')[0].reset;
      });
    }

    $scope.doneTask = function (task) {
      taskFactory.doneTask(task);

      $rootScope.$on('task:deleted', function () {
        $location.path('/');
      });
    }


  }])


}());

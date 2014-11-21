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

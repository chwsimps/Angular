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

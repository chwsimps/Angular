(function () {

  angular.module('MorningRoutine')
  .factory('taskFactory', ['$rootScope', 'Restangular', function ($rootScope, Restangular) {

  var taskBase = Restangular.all('routinelist2')

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

  return {
    getTasks: getTasks,
    getTask: getTask,
    addTask: addTask
  }

  }]);

}());

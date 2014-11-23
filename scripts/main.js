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

'use strict';
// generated on 2014-11-19 using generator-tiy-webapp 0.0.10

// Require your modules
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rimraf = require('rimraf');
var exec = require('child_process').exec;
var prompt = require('gulp-prompt');

gulp.task('styles', function () {
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber())
    .pipe($.rubySass({
      style: 'compressed',
      precision: 10
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('html', ['styles'], function () {

  return gulp.src('app/*.html')
    .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
    .pipe($.if('*.css', $.csso()))
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('templates', function () {
  return gulp.src('app/templates/**/*')
    .pipe(gulp.dest('dist/templates'));
});

gulp.task('extras', function () {
  return gulp.src(['app/*.*', '!app/*.html'], {dot: true})
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
  return $.cache.clearAll(cb, function() {
    return rimraf('.tmp', function () {
      return rimraf('dist', cb);
    });
  });
});

gulp.task('connect', function () {
  var connect = require('connect');
  var app = connect()
    .use(require('connect-livereload')({port: 35729}))
    .use(connect.static('app'))
    .use(connect.static('.tmp'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', connect.static('bower_components'))
    .use(connect.directory('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'styles'], function () {
  require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({directory: 'bower_components'}))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'bower_components'
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['html', 'images', 'fonts', 'templates', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

// Push a subtree from our `dist` folder
gulp.task('deploy', function() {

  gulp.src('/')
    .pipe(prompt.prompt({
        type: 'confirm',
        name: 'task',
        message: 'This will deploy to GitHub Pages. Have you already built your application and pushed your updated master branch?'
    }, function(res){
      if (res.task){
        console.log('Attempting: "git subtree push --prefix dist origin gh-pages"');
        exec('git subtree push --prefix dist origin gh-pages', function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
      } else { console.log('Please do this first and then run `gulp deploy` again.'); }
    }));

});

// Test your app in the browser
// Needs to be better, but needed something quick
gulp.task('test-server', function() {

  // Open Test Page
  var connect = require('connect');
  var app = connect()
    .use(require('connect-livereload')({port: 35729}))
    .use(connect.static('test'))
    .use('/app', connect.static('app'))
    .use('/bower_components', connect.static('bower_components'))
    .use(connect.directory('test'));

  require('http').createServer(app)
    .listen(8000)
    .on('listening', function () {
      console.log('Started connect testing server on http://localhost:8000');
    });

  require('opn')('http://localhost:8000');

  // Watch for changes in either the test/spec folder or app/scripts folder
  $.livereload.listen();

  gulp.watch([
    'app/scripts/**/*.js',
    'test/spec/**/*.js'
  ]).on('change', $.livereload.changed);

});

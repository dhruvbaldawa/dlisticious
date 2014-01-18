(function() {
  var dApp;

  dApp = angular.module('dApp', ['angularLocalStorage']);

  dApp.config([
    '$compileProvider', function($compileProvider) {
      return $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
  ]);

  dApp.constant('$', $);

  dApp.factory('CourseraService', [
    '$', '$q', 'storage', function($, $q, storage) {
      var COURSE_URL, prefix;
      COURSE_URL = 'https://www.coursera.org/maestro/api/topic/information?topic-id=';
      prefix = 'course_';
      return {
        fetchCourse: function(course, refresh) {
          var def, key;
          def = $q.defer();
          key = prefix + course;
          if ((storage.get(key) == null) || refresh) {
            $.getJSON(COURSE_URL + course).done(function(data) {
              storage.set(key, data);
              return def.resolve(data);
            }).fail(function(jqXHR, textStatus, error) {
              return def.reject(error);
            });
          } else {
            def.resolve(storage.get(key));
          }
          return def.promise;
        }
      };
    }
  ]);

  dApp.controller('MainCtrl', function($scope) {
    return $scope.foo = 'foos';
  });

  dApp.controller('CourseCtrl', [
    '$scope', '$q', 'CourseraService', function($scope, $q, CourseraService) {
      $scope.course_list = ['networksonline', 'randomness', 'android', 'moralities', 'conrob', 'changetheworld', 'android', 'posa', 'mobilecloud'];
      $scope.courses = [];
      $scope.fetchCourses = function(refresh) {
        var course, defs;
        defs = (function() {
          var _i, _len, _ref, _results;
          _ref = $scope.course_list;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            course = _ref[_i];
            _results.push(CourseraService.fetchCourse(course));
          }
          return _results;
        })();
        return $q.all(defs).then(function(data) {
          return $scope.courses = data;
        });
      };
      return $scope.refresh = function() {
        $scope.courses = [];
        return $scope.fetchCourses(true);
      };
    }
  ]);

}).call(this);

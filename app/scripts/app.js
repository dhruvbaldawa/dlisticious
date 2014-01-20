(function() {
  var dApp,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  dApp = angular.module('dApp', ['angularLocalStorage']);

  dApp.config([
    '$compileProvider', function($compileProvider) {
      return $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
  ]);

  dApp.constant('$', $);

  dApp.factory('CourseService', [
    '$http', '$q', 'storage', function($http, $q, storage) {
      var COURSERA_URL, COURSE_PREFIX, Course, REGISTRY_KEY;
      COURSERA_URL = 'https://www.coursera.org/maestro/api/topic/information?topic-id=';
      COURSE_PREFIX = 'course_';
      REGISTRY_KEY = 'course_registry';
      Course = (function() {
        function Course(name, title, url, thumbnail, active, start_date, provider, remote_fetch) {
          this.name = name;
          this.title = title;
          this.url = url;
          this.thumbnail = thumbnail;
          this.active = active;
          this.start_date = start_date;
          this.provider = provider;
          this.remote_fetch = remote_fetch;
        }

        return Course;

      })();
      return {
        registerCourse: function(course_name) {
          var course_registry;
          course_registry = storage.get(REGISTRY_KEY) || [];
          if (__indexOf.call(course_registry, course_name) < 0) {
            course_registry.push(course_name);
          }
          return storage.set(REGISTRY_KEY, course_registry);
        },
        fetchCourse: function(course_name, refresh) {
          var def, key, self;
          self = this;
          def = $q.defer();
          key = "" + COURSE_PREFIX + course_name;
          if ((storage.get(key) == null) || refresh) {
            $http.get("" + COURSE_URL + course_name).success(function(data) {
              self.registerCourse(course_name);
              storage.set(key, data);
              return def.resolve(data);
            }).error(function(data, status, headers, config) {
              return def.reject(data);
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
    '$scope', '$q', 'CourseService', function($scope, $q, CourseService) {
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
            _results.push(CourseService.fetchCourse(course, refresh));
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

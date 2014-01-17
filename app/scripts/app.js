dApp = angular.module('dApp', ['angularLocalStorage']);

// Whitelist the chrome-extension URL schemes
dApp.config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
}]);

// jQuery
dApp.constant('$', $);

// Service to get courses from Coursera
dApp.factory('CourseraService', ['$', '$q', 'storage', function($, $q, storage) {
    var COURSE_URL = 'https://www.coursera.org/maestro/api/topic/information?topic-id=';
    var prefix = 'course_';

    return {
        fetchCourse: function(course, refresh) {
            var def = $q.defer();
            var key = prefix + course;

            // Only fetch if not already cached, or when asked for refresh
            if (storage.get(key) === null || refresh) {
                $.getJSON(COURSE_URL + course)
                .done(function(data) {
                    storage.set(key, JSON.stringify(data));
                    def.resolve(data);
                })
                .fail(function(jqXHR, textStatus, error) {
                    def.reject(error);
                });
            } else {
                def.resolve(JSON.parse(storage.get(key)));
            }

            return def.promise;
        }
    };
}]);

// Main Controller
dApp.controller('MainCtrl', function($scope) {
    $scope.foo = 'foos';
});

// Course Controller
dApp.controller('CourseCtrl', ['$scope', '$q', 'CourseraService', function($scope, $q, CourseraService) {
    $scope.course_list = ['networksonline', 'randomness', 'android', 'moralities', 'conrob', 'changetheworld', 'android', 'posa', 'mobilecloud'];
    $scope.courses = [];

    $scope.fetchCourses = function(refresh) {
        var defs = [];
        for(var i=0; i < $scope.course_list.length; i++) {
            defs.push(CourseraService.fetchCourse($scope.course_list[i], refresh));
        }

        $q.all(defs).then(function(data) {
            $scope.courses = data;
        });
    };

    $scope.refresh = function() {
        $scope.courses = [];
        $scope.fetchCourses(true);
    }

}]);

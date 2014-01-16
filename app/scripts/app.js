dApp = angular.module('dApp', []);

// Whitelist the chrome-extension URL schemes
dApp.config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
}]);

// jQuery
dApp.constant('$', $)

// Service to get courses from Coursera
dApp.factory('CourseraService', ['$', '$q', function($, $q) {
    var COURSE_URL = 'https://www.coursera.org/maestro/api/topic/information?topic-id=';

    return {
        fetchCourse: function(course) {
            var def = $q.defer();

            $.getJSON(COURSE_URL + course)
            .done(function(data) {
                def.resolve(data);
            })
            .fail(function(jqXHR, textStatus, error) {
                def.reject(error);
            });

            return def.promise;
        }
    }
}]);

// Main Controller
dApp.controller('MainCtrl', function($scope) {
    $scope.foo = 'foos';
});

// Course Controller
dApp.controller('CourseCtrl', ['$scope', '$q', 'CourseraService', function($scope, $q, CourseraService) {
    $scope.course_list = ['networksonline', 'randomness', 'android', 'moralities', 'conrob', 'changetheworld', 'android', 'posa', 'mobilecloud'];
    $scope.courses = [];

    $scope.fetchCourses = function() {
        var defs = [];
        console.log('ff');
        for(var i=0; i < $scope.course_list.length; i++) {
            defs.push(CourseraService.fetchCourse($scope.course_list[i]));
        }

        $q.all(defs).then(function(data) {
            console.log(data);
            $scope.courses = data;
        });
    };
}]);

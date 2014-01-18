dApp = angular.module 'dApp', ['angularLocalStorage'];

# Whitelist the chrome-extension URL schemes
dApp.config ['$compileProvider', ($compileProvider) ->
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/)
]

# jQuery
dApp.constant '$', $

# Service to get courses from Coursera
dApp.factory 'CourseraService', ['$', '$q', 'storage', ($, $q, storage) ->
    COURSE_URL = 'https://www.coursera.org/maestro/api/topic/information?topic-id='
    prefix = 'course_'

    fetchCourse: (course, refresh) ->
        def = $q.defer()
        key = prefix + course

        # Only fetch if not already cached, or when asked for refresh
        if !storage.get(key)? or refresh
            $.getJSON(COURSE_URL + course)
            .done (data) ->
                storage.set key, data
                def.resolve(data)
            .fail (jqXHR, textStatus, error) ->
                def.reject(error)
        else
            def.resolve storage.get(key)

        return def.promise;
]

# Main Controller
dApp.controller 'MainCtrl', ($scope) ->
    $scope.foo = 'foos';

# Course Controller
dApp.controller 'CourseCtrl', ['$scope', '$q', 'CourseraService', ($scope, $q, CourseraService) ->
    $scope.course_list = ['networksonline', 'randomness', 'android', 'moralities', 'conrob', 'changetheworld', 'android', 'posa', 'mobilecloud']
    $scope.courses = []

    $scope.fetchCourses = (refresh) ->
        defs = (CourseraService.fetchCourse(course) for course in $scope.course_list)

        $q.all(defs).then (data) ->
            $scope.courses = data;

    $scope.refresh = () ->
        $scope.courses = [];
        $scope.fetchCourses(true);
]

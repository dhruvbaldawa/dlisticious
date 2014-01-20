dApp = angular.module 'dApp', ['angularLocalStorage'];

# Whitelist the chrome-extension URL schemes
dApp.config ['$compileProvider', ($compileProvider) ->
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/)
]

# jQuery
dApp.constant '$', $

# Service to get courses from Coursera
dApp.factory 'CourseService', ['$http', '$q', 'storage', ($http, $q, storage) ->
    COURSERA_URL = 'https://www.coursera.org/maestro/api/topic/information?topic-id='
    COURSE_PREFIX = 'course_'
    REGISTRY_KEY = 'course_registry'

    class Course
        constructor: (@name, @title, @url, @thumbnail, @active, @start_date, @provider, @remote_fetch) ->

    registerCourse: (course_name) ->
        course_registry = storage.get(REGISTRY_KEY) or []
        if course_name not in course_registry
            course_registry.push course_name
        storage.set REGISTRY_KEY, course_registry

    fetchCourse: (course_name, refresh) ->
        self = @
        def = $q.defer()
        key = "#{COURSE_PREFIX}#{course_name}"

        # Only fetch if not already cached, or when asked for refresh
        if !storage.get(key)? or refresh
            $http.get("#{COURSE_URL}#{course_name}")
            .success (data) ->
                self.registerCourse(course_name)
                storage.set key, data
                def.resolve(data)

            .error (data, status, headers, config) ->
                def.reject(data)
        else
            def.resolve storage.get(key)

        return def.promise;
]

# Main Controller
dApp.controller 'MainCtrl', ($scope) ->
    $scope.foo = 'foos';

# Course Controller
dApp.controller 'CourseCtrl', ['$scope', '$q', 'CourseService', ($scope, $q, CourseService) ->
    $scope.course_list = ['networksonline', 'randomness', 'android', 'moralities', 'conrob', 'changetheworld', 'android', 'posa', 'mobilecloud']
    $scope.courses = []

    $scope.fetchCourses = (refresh) ->
        defs = (CourseService.fetchCourse(course, refresh) for course in $scope.course_list)

        $q.all(defs).then (data) ->
            $scope.courses = data;

    $scope.refresh = () ->
        $scope.courses = [];
        $scope.fetchCourses(true);
]

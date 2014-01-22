dApp = angular.module 'dApp', ['angularLocalStorage'];

# Whitelist the chrome-extension URL schemes
dApp.config ['$compileProvider', ($compileProvider) ->
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/)
]

# jQuery
dApp.constant '$', $

# Service to get courses from Coursera
dApp.factory 'StorageService', ['$http', '$q', 'storage', ($http, $q, storage) ->
    LIST_REGISTRY_KEY = 'lists'
    list_registry = storage.get(LIST_REGISTRY_KEY) ? {}

    updateLocalStorage = () ->
        storage.set(LIST_REGISTRY_KEY, list_registry)


    addList: (list, items) ->
        # check if already not in registry
        if name of list_registry
            return false
        else
            list_registry[list] =
                fields: ['title', 'description']
                title: title ? 'Untitled List'
                items: items ? []
        storage.set(list_registry)
        updateLocalStorage()

    removeList: (list) ->
        delete list_registry[list]
        updateLocalStorage()

    addItem: (list, item) ->
        list_registry[list].items.push(item)
        updateLocalStorage()

    removeItem: (list, index) ->
        delete list_registry[list].items[index]
        updateLocalStorage()
]

# Main Controller
dApp.controller 'MainCtrl', ($scope) ->
    $scope.foo = 'foos';

# Course Controller
dApp.controller 'ListCtrl', ['$scope', '$q', 'StorageService', ($scope, $q, StorageService) ->
    # sorry for the small name, but this saves me from watch expressions.
    $scope.lr = StorageService.list_registry

    $scope.addList = () ->
]

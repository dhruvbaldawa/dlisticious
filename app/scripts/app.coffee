dApp = angular.module 'dApp', ['angularLocalStorage', 'ui.sortable'];

# Whitelist the chrome-extension URL schemes
dApp.config ['$compileProvider', ($compileProvider) ->
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/)
]

# jQuery
dApp.constant '$', $

# Service to get courses from Coursera
dApp.factory 'StorageService', ['$http', '$q', 'storage', ($http, $q, storage) ->
    LIST_REGISTRY_KEY = 'lists'
    _list_registry = storage.get(LIST_REGISTRY_KEY) ? {}

    updateLocalStorage = () ->
        storage.set(LIST_REGISTRY_KEY, _list_registry)


    addList: (title, items) ->
        # check if already not in registry
        if !title
            console.error "Empty name provided."
            return false

        # clear out the spaces from the name
        id = title.split(' ').join('_').toLowerCase()

        if id of _list_registry
            console.error "List #{list} already exists."
            return false
        else
            _list_registry[id] =
                fields: ['title', 'description']
                title: title
                items: items ? []
            updateLocalStorage()
            return true

    removeList: (id) ->
        delete _list_registry[id]
        updateLocalStorage()
        return true

    addItem: (id, item) ->
        if item?
            _list_registry[id].items.push(item)
            updateLocalStorage()
            return true
        else
            return false

    removeItem: (id, index) ->
        if index < _list_registry[id].items.length
            _list_registry[id].items.splice(index, 1)
            updateLocalStorage()
            return true
        else
            return false

    # @TODO: make this truly "private", only read.. no writes
    list_registry: _list_registry
]

# Main Controller
dApp.controller 'MainCtrl', ($scope) ->
    $scope.foo = 'foos';

# Course Controller
dApp.controller 'ListCtrl', ['$scope', '$q', 'StorageService', ($scope, $q, StorageService) ->
    # sorry for the small name, but this saves me from watch expressions.
    $scope.lr = StorageService.list_registry
    $scope.addListFormError = ''  # move this to an alert later.
    $scope.items = [['1', '2', '3'],['a', 'b', 'c'],['i', 'ii', 'iii']]
    $scope.sortableOptions =
        placeholder: "widget",
        connectWith: ".column",
        handle: ".widget-head"

    $scope.addList = ($event) ->
        title = $event.target.title.value

        if not StorageService.addList(title)
            $scope.addListFormError = 'Error creating list, try different name.'
        else
            $scope.addListFormError = 'List created successfully.'

    $scope.addListItem = ($event) ->
        item =
            title: $event.target.title.value
            description: $event.target.description.value
        list_id = $event.target.list_id.value

        if not StorageService.addItem(list_id, item)
            alert 'Error adding list item'

    $scope.removeList = (list_id) ->
        if StorageService.removeList(list_id)
            alert 'list removed'

    $scope.removeListItem = (list_id, index) ->
        if StorageService.removeItem(list_id, index)
            alert 'item removed'

]

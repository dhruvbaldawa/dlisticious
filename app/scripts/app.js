(function() {
  var dApp;

  dApp = angular.module('dApp', ['angularLocalStorage']);

  dApp.config([
    '$compileProvider', function($compileProvider) {
      return $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
  ]);

  dApp.constant('$', $);

  dApp.factory('StorageService', [
    '$http', '$q', 'storage', function($http, $q, storage) {
      var LIST_REGISTRY_KEY, updateLocalStorage, _list_registry, _ref;
      LIST_REGISTRY_KEY = 'lists';
      _list_registry = (_ref = storage.get(LIST_REGISTRY_KEY)) != null ? _ref : {};
      updateLocalStorage = function() {
        return storage.set(LIST_REGISTRY_KEY, _list_registry);
      };
      return {
        addList: function(title, items) {
          var id;
          if (!title) {
            console.error("Empty name provided.");
            return false;
          }
          id = title.split(' ').join('_').toLowerCase();
          if (id in _list_registry) {
            console.error("List " + list + " already exists.");
            return false;
          } else {
            _list_registry[id] = {
              fields: ['title', 'description'],
              title: title,
              items: items != null ? items : []
            };
            updateLocalStorage();
            return true;
          }
        },
        removeList: function(id) {
          delete _list_registry[id];
          return updateLocalStorage();
        },
        addItem: function(id, item) {
          _list_registry[id].items.push(item);
          return updateLocalStorage();
        },
        removeItem: function(id, index) {
          delete _list_registry[list].items[index];
          return updateLocalStorage();
        },
        list_registry: _list_registry
      };
    }
  ]);

  dApp.controller('MainCtrl', function($scope) {
    return $scope.foo = 'foos';
  });

  dApp.controller('ListCtrl', [
    '$scope', '$q', 'StorageService', function($scope, $q, StorageService) {
      $scope.lr = StorageService.list_registry;
      $scope.addListFormError = '';
      $scope.addList = function($event) {
        var title;
        title = $event.target.title.value;
        if (!StorageService.addList(title)) {
          return $scope.addListFormError = 'Error creating list, try different name.';
        } else {
          return $scope.addListFormError = 'List created successfully.';
        }
      };
      return $scope.addListItem = function($event) {
        var item, list_id;
        item = {
          title: $event.target.title.value,
          description: $event.target.description.value
        };
        list_id = $event.target.list_id.value;
        if (!StorageService.addItem(list_id, item)) {
          return alert('Error adding list item');
        }
      };
    }
  ]);

  $(document).ready(function() {
    return $(".gridster ul").gridster({
      widget_margins: [10, 10],
      widget_base_dimensions: [250, 250]
    });
  });

}).call(this);

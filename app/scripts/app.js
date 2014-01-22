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
      var LIST_REGISTRY_KEY, list_registry, updateLocalStorage, _ref;
      LIST_REGISTRY_KEY = 'lists';
      list_registry = (_ref = storage.get(LIST_REGISTRY_KEY)) != null ? _ref : {};
      updateLocalStorage = function() {
        return storage.set(LIST_REGISTRY_KEY, list_registry);
      };
      return {
        addList: function(list, items) {
          if (name in list_registry) {
            return false;
          } else {
            list_registry[list] = {
              fields: ['title', 'description'],
              title: typeof title !== "undefined" && title !== null ? title : 'Untitled List',
              items: items != null ? items : []
            };
          }
          storage.set(list_registry);
          return updateLocalStorage();
        },
        removeList: function(list) {
          delete list_registry[list];
          return updateLocalStorage();
        },
        addItem: function(list, item) {
          list_registry[list].items.push(item);
          return updateLocalStorage();
        },
        removeItem: function(list, index) {
          delete list_registry[list].items[index];
          return updateLocalStorage();
        }
      };
    }
  ]);

  dApp.controller('MainCtrl', function($scope) {
    return $scope.foo = 'foos';
  });

  dApp.controller('ListCtrl', [
    '$scope', '$q', 'StorageService', function($scope, $q, StorageService) {
      $scope.lr = StorageService.list_registry;
      return $scope.addList = function() {};
    }
  ]);

}).call(this);

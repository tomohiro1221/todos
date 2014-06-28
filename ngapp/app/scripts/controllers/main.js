'use strict';

angular.module('ngappApp')
  .factory('todos', function($http) {
    var formatParams = function (data) {
      return { todo: data };
    };
    return {
      get: function() {
        return $http.get('/api/todos.json');
      },
      create: function(todoData) {
        return $http.post('/api/todos.json', formatParams(todoData));
      },
      delete: function(id) {
        return $http.delete('/api/todos/' + id + '.json');
      }
    };
  })

  .controller('MainCtrl', function ($scope, $http, todos) {
    todos.get()
      .success(function(data) {
        $scope.todos = data;
      });

    $scope.createTodo = function () {
      if ($scope.formData.hasOwnProperty('text')) {
        todos.create($scope.formData)
          .success(function (data) {
            $scope.formData = {};
            $scope.todos.push(data);
          });
      }
    };

    $scope.deleteTodo = function (item) {
      todos.delete(item.id)
        .success(function () {
          $scope.todos.splice($scope.todos.indexOf(item)); 
        })
    };
  });

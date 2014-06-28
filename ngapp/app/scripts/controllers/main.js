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
        });
    };
  })

  .factory('AuthService', function ($http) {
    var currentUser;
    var formatParams = function (creds) {
      return { user: creds };
    };
    return {
      login: function (creds) {
        console.log('login was called');
        return $http
          .post('/api/users/sign_in.json', formatParams(creds))
          .then(function (response) {
            currentUser = response.data;
            return currentUser;
          }.bind(this));
      },
      logout: function () {
        console.log('logout was called!');
        return $http
          .delete('/api/users/sign_out.json')
          .then(function () {
            console.log('posted to sign out!');
            currentUser = null;
            return currentUser;
          }.bind(this));
      },
      register: function (creds) {
        return $http
          .post('/api/users.json', formatParams(creds))
          .then(function (response) {
            currentUser = response.data;
            return currentUser;
          }.bind(this));
      },
      isAuthenticated: function () {
        return !!currentUser;
      },
      currentUser: currentUser
    };
  })

  .controller('HeaderCtrl', function ($scope, AuthService) {
    $scope.isAuthenticated = AuthService.isAuthenticated();
    $scope.logout = function () {
      AuthService.logout()
        .then(function () {
          $scope.isAuthenticated = AuthService.isAuthenticated();
          console.log('successfully logged out!');
        });
    };
  })

  .controller('LoginCtrl', function ($scope, $location, AuthService) {
    $scope.loginForm = $scope.loginForm || {};

    $scope.login = function () {
      console.log('login');
      if ($scope.loginForm.hasOwnProperty('email') &&
          $scope.loginForm.hasOwnProperty('password')) {
        AuthService.login($scope.loginForm)
          .then(function () {
            $location.path('/');
          });
      }
    };
  })

  .controller('RegisterCtrl', function ($scope, $location, AuthService) {
    $scope.registerForm = $scope.registerForm || {};

    $scope.validatePassword = function () {
      return $scope.registerForm.hasOwnProperty('password') && $scope.registerForm.password.length > 5 && $scope.registerForm.password === $scope.registerForm.confirmPassword;
    };

    $scope.register = function () {
      console.log('register');
      AuthService.register($scope.registerForm)
        .then(function () {
          $location.path('/');
        });
    };
  });

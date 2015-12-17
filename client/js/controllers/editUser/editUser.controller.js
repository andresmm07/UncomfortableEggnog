(function () {
  'use strict';
  angular.module('app')
    .controller('EditUserCtrl', EditUserCtrl);

  EditUserCtrl.$inject = ['ApiFactory', '$state', '$scope', 'SignUpFactory'];

  function EditUserCtrl (ApiFactory, $state, $scope, SignUpFactory) {
    var self = this;

    self.fields = {
      "currentUsername": {
        required: true,
        value: localStorage.username
      },
      "email": {
        required: true,
        value: ''
      },
      "website": {
        required: false,
        value: ''
      },
      "first name": {
        required: true,
        value: ''
      },
      "last name": {
        required: true,
        value: ''
      },
      "username": {
        required: true,
        value: localStorage.username
      },
      "password": {
        required: false,
        value: '',
        strength: 0
      },
      "password repeat": {
        required: false,
        value: ''
      },
      "current password": {
        required: true,
        value: ''
      }
    };

    self.errorMessages = {
      website: 'Please enter a valid URL (Did you prefix your website with http://?).',
      email: 'Invalid email address.',
      minlength: 'Username is too short (4 to 12 characters allowed)',
      maxlength: 'Username is too long (4 to 12 characters allowed)',
      pattern: 'Please only use letters, numbers, and/or underscores in your username (no whitespaces allowed).',
      password: 'Your password did not match.'
    };


    ApiFactory.get('/user/' + self.fields.username.value + '/verify')
      .then(function (user) {
        self.fields["first name"].value = user["first name"];
        self.fields["last name"].value = user["last name"];
        self.fields.email.value = user.email;
        self.fields.website.value = user.website;
      });

    self.post = function () {
      var user = {};
      for (var key in self.fields) {
        var field = self.fields[key];
        if (key !== 'password repeat' && field.value !== '') {
          user[key] = field.value;
        }
      }
      ApiFactory.post('/user/' + self.fields.username.value + '/edit', user)
      .then(function (result) {
        if (result.error) {
          self.errorList = [result.error];
          self.fields.password.value = '';
          self.fields['password repeat'].value = '';
          console.log('error: ', result.error);
        } else if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('username', result.username);
          // Redirect to userPackages page
          $state.go('user', {userName: result.username});
        } else {
          $state.go('login');
          // if for some reason no token, redirect to login
        }
      });
    };

    self.validateAndPost = function () {
      var validated = true;
      self.errorList = [];
        for (var key in self.fields) {
          var field = self.fields[key];
          if (field.required) {
            if (!field.value) {
              self.errorList.push('Please enter your ' + key + '.');
              console.log(self.errorList);
              validated = false;
            }
          }
        }
      //check password validation
      if (self.fields.password.value !== self.fields['password repeat'].value) {
        self.fields.password.value = '';
        self.fields['password repeat'].value = '';
        self.errorList.push(self.errorMessages.password);
        $scope.signupForm['password'].$dirty = true;
        $scope.signupForm['password'].$pristine = false;
        $scope.signupForm['password repeat'].$dirty = true;
        $scope.signupForm['password repeat'].$pristine = false;

        validated = false;
      }

      if (validated) {
        self.post();
      }
    };

    self.isInputInvalid = function (input) {
      return input.$dirty && input.$invalid;
    };

    self.isInputValid = function (input) {
      return input.$dirty && input.$valid && !(input.$error.minlength);
    };

    self.setPristine = function (field) {
      if (field.$$lastCommittedViewValue === '') {
        field.$setPristine();
      }
    };

  }
})();

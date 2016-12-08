var TripPin = angular.module('TripPin', ['ngRoute']);

TripPin.controller('mainController', function($scope) {
  $scope.message = 'Everyone come and see how good I look!';

});

TripPin.controller('signinController', function($scope, $http) {

  $scope.username = '';
  $scope.password = '';

  $scope.clickSubmit = function() {
    alert($scope.username, $scope.password);

    $http({
      method: 'POST',
      url: '/user',
      data: {
        name: $scope.username,
        password: $scope.password
      }
    }).then(function successCallback(response) {
        console.log('Logged in')
        $location.path('/map');
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        console.log('Try again');
        $location.path('/signin');
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  };

});


TripPin.controller("mapController", function($scope, gservice) {

  // use gservice created in gservice.js
  gservice.refresh(19,  173);
});


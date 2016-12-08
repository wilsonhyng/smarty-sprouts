var TripPin = angular.module('TripPin', ['ngRoute']);

TripPin.controller('mainController', function($scope) {
  $scope.message = 'Everyone come and see how good I look!';

});

TripPin.controller('signinController', function($scope) {

  $scope.username = '';
  $scope.password = '';
  $scope.clickSubmit = function() {
    alert($scope.username, $scope.password);
  };

});


TripPin.controller("mapController", function($scope, gservice) {

  // use gservice created in gservice.js
  gservice.refresh(19,  173);
});


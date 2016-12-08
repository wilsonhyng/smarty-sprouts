var TripPin = angular.module('TripPin', ['ngRoute', 'uiGmapgoogle-maps']);

// create the controller and inject Angular's $scope
TripPin.controller('mainController', function($scope) {
  // create a message to display in our view
  $scope.message = 'Everyone come and see how good I look!';
});

TripPin.controller('signinController', function($scope) {
  $scope.username = '';
  $scope.password = '';
  $scope.clickSubmit = function() {
    alert($scope.username, $scope.password);
  };
});

TripPin.config(function($GoogleMapApiProviders) {
  GoogleMapApiProviders.configure({
    china: true
  });
});
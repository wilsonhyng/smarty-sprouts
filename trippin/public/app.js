var TripPin = angular.module('TripPin', ['ngRoute', 'uiGmapgoogle-maps']);

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


TripPin.controller("mapController", function($scope, uiGmapGoogleMapApi) {
  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 5 };

  uiGmapGoogleMapApi.then(function(maps) {

  });
});
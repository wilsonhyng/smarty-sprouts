var TripPin = angular.module('TripPin', ['ngRoute', 'ngSanitize']);

TripPin.controller("mapController", function($scope, gservice, $http) {

  // use gservice created in gservice.js
  gservice.refresh(19, 173);
});
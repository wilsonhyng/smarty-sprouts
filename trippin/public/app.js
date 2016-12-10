var TripPin = angular.module('TripPin', ['ngRoute']);

TripPin.controller('mainController', function($scope) {
  $scope.message = 'Everyone come and see how good I look!';

});

TripPin.controller('signinController', function($scope, $http, $location) {

  $scope.username = '';
  $scope.password = '';

  $scope.clickSubmit = function() {

    $http({
      method: 'POST',
      url: '/user',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        name: $scope.username,
        password: $scope.password
      }
    }).then(function successCallback(response) {
        console.log('Logged in')
        $location.path('/map');
      }, function errorCallback(response) {
        console.log('Try again');
        $location.path('/signin');
    });
  };
});


TripPin.controller("mapController", function($scope, gservice, $http) {

  // use gservice created in gservice.js
  gservice.refresh(19, 173);

  // make http request to the server with fakedata for testing
  // $scope.clickAddPin = function(){
  //   $http({
  //     method: 'POST',
  //     url: '/pin',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     data: {
  //       title: 'test title', 
  //       description: 'test description', 
  //       location: [29.8, -133.6]
  //     }
  //   }).then(function successCallback(response) {
  //       console.log('Pin added')
  //       // this callback will be called asynchronously
  //       // when the response is available
  //     }, function errorCallback(response) {
  //       console.log('Try again');
  //       // called asynchronously if an error occurs
  //       // or server returns response with an error status.
  //   });
  // }
});


TripPin.config(function ($routeProvider) { //TODO: add locationProvider later?
  $routeProvider
  .when('/signin', {
    templateUrl : './templates/signin.html',
    controller  : 'signinController'
  })
  .when('/map', {
    templateUrl : './templates/map.html',
    controller  : 'mapController'
  })
  .otherwise({
    redirectTo  : '/map'
  });
});


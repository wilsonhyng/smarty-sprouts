// googleMapService fecthes the user's pin data (title, description)
// and refreshes the map by calling initialize
window.googleMapService.refresh = function(latitude, longitude) {

  // Clears the holding array of locations
  locations = [];
  myMarkerArray = [];

  // Set the selected lat and long equal to the ones provided on the refresh() call
  selectedLat = latitude;
  selectedLong = longitude;

  // Make a get request to the server to fetch pin locations
  $http({
    method: 'GET',
    url: '/pin',
  }).then(function successCallback(response) {
    // convert response.data into map point obj by calling convertToMapPoints function
    locations = convertToMapPoints( response.data );

    // initialize the map by calling initialize funciton
    initialize(latitude, longitude);

  },
    function errorCallback(response) {
      console.log('Try again');
    });
};

// ===============================================================================
var fakeData = [
  {title: 'title1', description: 'description1', location: [39.50, 0] },
  {title: 'title2', description: 'description2', location: [39.50, 50] },
];

// ===============================================================================
// Example: https://scotch.io/tutorials/making-mean-apps-with-google-maps-part-i
/*
  Use factory to create gservice (Google Map API interface)
  gservice returns an object (googleMapService) with methods to refresh map with pins
*/

TripPin.factory('gservice', function(){

  var googleMapService = {};
  var locations = [];   // Array of locations obtained from API calls

  // Initial Selected Location (default to center of the world)
  var selectedLat = 19;
  var selectedLong = 173;

  // googleMapService fecthes the user's pin data (title, description)
  // and refrenshes the map by calling initialize ----------------------------------------
  googleMapService.refresh = function(latitude, longitude){

    // Clears the holding array of locations
    locations = [];

    // Set the selected lat and long equal to the ones provided on the refresh() call
    selectedLat = latitude;
    selectedLong = longitude;

      // **** instead of http request, use fakeData for now (http request later) ******
      response = fakeData;
      locations = convertToMapPoints(response);

      // Then initialize the map.
      initialize(latitude, longitude);
      console.log('end of refresh')
      // **** instead of http request, use fakeData for now (http request later) ******

  };
  // ------------------------------------------------------------------------------------

  // Private Inner Functions --------------------------------------------------------------
  // Convert a JSON of pins into map points
  var convertToMapPoints = function(response){

    // Clear the locations holder
    var locations = [];

    // Loop through all of the JSON entries provided in the response
    for(var i= 0; i < response.length; i++) {
      var pin = response[i];

      // Create popup windows for each record
      var  contentString =
          '<p><b>title</b>: ' + pin.title +
          '<br><b>description</b>: ' + pin.description +
          '</p>';

      // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
      locations.push({
          latlon: new google.maps.LatLng(pin.location[1], pin.location[0]),
          message: new google.maps.InfoWindow({
              content: contentString,
              maxWidth: 320
          }),
          title: pin.title,
          age: pin.description
      });
    }
    // location is now an array populated with records in Google Maps format
    console.log('end of convertToMapPoints')
    return locations;
  };
  // ------------------------------------------------------------------------------------

  // Initializes the map ---------------------------------------------------------------
  var initialize = function(latitude, longitude) {
    // Uses the selected lat, long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // If map has not been created already...
    if (!map){
      // Create a new map and place in the index.html page
      var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: myLatLng
      });
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(locationObj, index){
      console.log('----placing marker ---------')
      var marker = new google.maps.Marker({
          position: locationObj.latlon,
          map: map,
          title: "Big Map",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });

      // For each marker created, add a listener that checks for clicks
      google.maps.event.addListener(marker, 'click', function(e){

        // When clicked, open the selected marker's message
        currentSelectedMarker = locationObj;
        locationObj.message.open(map, marker);
      });
    });

    // Set initial location as a bouncing red marker
    var initialLocation = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    // (Yoshi's comment: not sure what this is for)
    lastMarker = marker;

    console.log('end of initialize')
  };
  // ------------------------------------------------------------------------------------

  return googleMapService;
});

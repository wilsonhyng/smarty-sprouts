// fakeData =====================================================================
var fakeData = [
  {title: 'title1', description: 'description1', location: [39.50, 0] },
  {title: 'title2', description: 'description2', location: [39.50, 50] },
];
var fakeImgUrl = 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQEbjc5HDFjYLinlxzmmP3vjkMA2hCA-9RZumKhLQKOejjqNJeeiw';

// ===============================================================================
// Example: https://scotch.io/tutorials/making-mean-apps-with-google-maps-part-i
/*
  Use factory to create gservice (Google Map API interface)
  gservice returns an object (googleMapService) with methods to refresh map with pins
*/

// make newMarker and infowindow variables available in the global scope so that info window works
var newMarker;
var infowindow;

// limiter and marker for storing and deleting old markers placed by the user
var limiter = 0;
var prevMarker = null;


TripPin.factory('gservice', function($http) {

  var googleMapService = {};
  var locations = [];   // Array of locations obtained from API calls

  // Initial Selected Location (default to center of the world)
  var selectedLat = 19;
  var selectedLong = 173;

  // googleMapService fecthes the user's pin data (title, description)
  // and refreshes the map by calling initialize ----------------------------------------
  googleMapService.refresh = function(latitude, longitude) {

    // Clears the holding array of locations
    locations = [];

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
  // ------------------------------------------------------------------------------------

  // Private Inner Functions --------------------------------------------------------------
  // Convert a JSON of pins into map points
  var convertToMapPoints = function(response) {

    // Clear the locations holder
    var locations = [];

    // Loop through all of the JSON entries provided in the response
    for(var i= 0; i < response.length; i++) {
      var pin = response[i];

      // Create popup windows for each record
      var  contentString =
          '<p><b>title</b>: ' + pin.title +
          '<br><b>description</b>: ' + pin.description +
          '</p>' +
          '<img src='+fakeImgUrl+' height="42" width="42">';

      // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
      locations.push({
          latlon: new google.maps.LatLng(pin.lat, pin.lon),
          message: new google.maps.InfoWindow({
              content: contentString,
              maxWidth: 320
          }),
          title: pin.title,
          description: pin.description
      });
    }
    // location is now an array populated with records in Google Maps format
    return locations;
  };
  // ------------------------------------------------------------------------------------

  // Make http request to the server when user adds a marker and fills in a form ----------
  // make saveData function avaialble in the global scope so that info window works
  window.saveData = function() {
    var title = escape(document.getElementById("titleInput").value);
    var description = escape(document.getElementById("descriptionInput").value);
    var latlng = newMarker.getPosition();

    var pin = {
      title: title, 
      description: description, 
      location: [latlng.lat(), latlng.lng()]
    }

    $http({
      method: 'POST',
      url: '/pin',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(pin)
    }).then(function successCallback(response) {

      // Create a popup window for the new location
      var  contentString =
        '<p><b>title</b>: ' + pin.title +
        '<br><b>description</b>: ' + pin.description +
        '</p>' +
        '<img src='+fakeImgUrl+' height="42" width="42">';

      // define the new location
      var newLoc = {
        latlon: new google.maps.LatLng(pin.location[0], pin.location[1]),
        message: new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 320
        }),
        title: pin.title,
        description: pin.description
      };

      // set the pin on the map
      var setPin = function(locationObj) {
        var marker = new google.maps.Marker({
          position: locationObj.latlon,
          map: map,
          title: "Big Map",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        // add a listener that checks for clicks on the pin
        google.maps.event.addListener(marker, 'click', function(e) {
          // When clicked, open the pin's message
          locationObj.message.open(map, marker);
        });
      }

      // add new location to locations array and set on the map
      locations.push(newLoc);
      if (prevMarker) prevMarker.setMap(null);
      limiter = 0;
      // setPin(newLoc);

      console.log('Pin added to the database');
    }, function errorCallback(response) {
      console.log('Try again');
    });
  }
  // ------------------------------------------------------------------------------------

  // Initializes the map ---------------------------------------------------------------
  function initialize(latitude, longitude) {
    // Uses the selected lat, long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // If map has not been created already...
    if (!map){
      // Create a new map and place in the index.html page
      var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: myLatLng
      });

      infowindow = new google.maps.InfoWindow({
        content: ''
      });

      var handleClick = function(e) {
        if (limiter === 0) {
          limiter = 1;
          var lat = e.latLng.lat();
          var lng = e.latLng.lng();
          var text=123;

          var html = "<table>" +
                     "<tr><td>Title:</td> <td><input type='text' id='titleInput'/> </td> </tr>" +
                     "<tr><td>Description:</td> <td><input type='text' id='descriptionInput'/></td> </tr>" +
                     "<tr><td></td><td><input type='button' value='Save & Close' onclick='saveData()'/></td></tr>";

          prevMarker = newMarker = new google.maps.Marker({
            position: e.latLng,
            map: map
          });
          infowindow.setContent(html);
          infowindow.open(map, newMarker);
        } else {
          prevMarker.setMap(null);
          limiter = 0;
          handleClick(e);
        }
      }

      google.maps.event.addListener(map, 'click', handleClick);
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(locationObj, index) {

      var marker = new google.maps.Marker({
          position: locationObj.latlon,
          map: map,
          title: "Big Map",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });

      // For each marker created, add a listener that checks for clicks
      google.maps.event.addListener(marker, 'click', function(e) {
        // When clicked, open the selected marker's message
        locationObj.message.open(map, marker);
      });
    });

  };
  // ------------------------------------------------------------------------------------

  return googleMapService;
});




















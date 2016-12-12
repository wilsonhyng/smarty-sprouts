// fakeData =====================================================================
var fakeData = [
  {title: 'title1', description: 'description1', location: [39.50, 0] },
  {title: 'title2', description: 'description2', location: [39.50, 50] },
];
var fakeImgUrl = 'http://travelchannel.sndimg.com/content/dam/images/travel/fullset/2015/03/2/japanese-cherry-blossom-viewing-kyoto-japan.jpg.rend.tccom.966.544.jpeg';

// ===============================================================================
// Example: https://scotch.io/tutorials/making-mean-apps-with-google-maps-part-i
/*
  Use factory to create gservice (Google Map API interface)
  gservice returns an object (googleMapService) with methods to refresh map with pins
*/

// make newMarker and infowindow variables available in the global scope so that info window works
var newMarker;
var infowindow;
var savedInfoWindow = new google.maps.InfoWindow({
  maxWidth: 320
});

// limiter and marker for storing and deleting old markers placed by the user
var limiter = 0;
var prevMarker = null;

// variable to store the reference to the map
var map = null;

TripPin.factory('gservice', function($http, $sanitize) {

  var googleMapService = {};
  var locations = [];   // Array of locations obtained from API calls
  var myMarkerArray = []; // Array of markers placed on the map

  // Initial Selected Location (default to center of the world)
  var selectedLat = 19;
  var selectedLong = 173;

  // googleMapService fecthes the user's pin data (title, description)
  // and refreshes the map by calling initialize ----------------------------------------
  googleMapService.refresh = function(latitude, longitude) {

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
  // ------------------------------------------------------------------------------------

  // Private Inner Functions --------------------------------------------------------------
  // Convert a JSON of pins into map points
  var convertToMapPoints = function(response) {

    // Clear the locations holder
    var locations = [];

    // Loop through all of the JSON entries provided in the response
    for (var i = 0; i < response.length; i++) {
      var pin = response[i];

      // Create popup windows for each record
      var contentString =
          '<p><b>title</b>: ' + pin.title +
          '<br><b>description</b>: ' + pin.description +
          '</p>' +
          '<img src=' + fakeImgUrl + ' height="180" width="320">';

      // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
      locations.push({
        latlon: new google.maps.LatLng(pin.lat, pin.lon),
        message: contentString,
        // new google.maps.InfoWindow({
          // content: contentString,
          // maxWidth: 320
        // }),
        title: pin.title,
        description: pin.description
      });
    }
    // location is now an array populated with records in Google Maps format
    return locations;
  };
  // ------------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------------

  // Make http request to the server when user adds a marker and fills in a form ----------
  // saveData function defined in the global scope so that infoWindow has access to the funciton
  window.saveData = function() {
    var title = $sanitize(document.getElementById('titleInput').value);
    var description = $sanitize(document.getElementById('descriptionInput').value);
    var latlng = newMarker.getPosition();

    console.log(title, description);

    var pin = {
      title: title,
      description: description,
      location: [latlng.lat(), latlng.lng()]
    };

    $http({
      method: 'POST',
      url: '/pin',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(pin)
    }).then(function successCallback(response) {

      // Create a popup window for the new location
      var contentString =
          '<p><span class="pin-title">' + pin.title +
          '</span><br>' + pin.description + '</p>' +
          '<img src=' + fakeImgUrl + ' height="180" width="320">';

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
          title: 'Big Map',
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        });

        myMarkerArray.push(marker); // push marker to Array to retain access
        var markerIndex = myMarkerArray.length-1;
        // add a listener that checks for clicks on the pin
        google.maps.event.addListener(marker, 'click', function(e) {
          savedInfoWindow.setContent(contentString +
          '<button onclick="hidePin('+markerIndex+')"> Hide</button>'); // add a hide button

          savedInfoWindow.open(map, marker);
          // When clicked, open the pin's message
          // locationObj.message.open(map, marker);
        });
      };

      // add new location to locations array and set on the map
      locations.push(newLoc);
      if (prevMarker) prevMarker.setMap(null);
      limiter = 0;
      setPin(newLoc);

      console.log('Pin added to the database');
    }, function errorCallback(response) {
      console.log('Try again');
    });
  };
  // ------------------------------------------------------------------------------------

  // Initializes the map ---------------------------------------------------------------
  function initialize(latitude, longitude) {
    // Uses the selected lat, long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // If map has not been created already...
    if (!map) {
      // Create a new map and place in the index.html page
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: myLatLng
      });

      // set limit on Map zoom
      var opt = { minZoom: 2, maxZoom: 6 };
      map.setOptions(opt);

      // create an empty infoWindow
      infowindow = new google.maps.InfoWindow({
        content: ''
      });

      var handleClick = function(e) {
        if (limiter === 0) {
          limiter = 1;
          var lat = e.latLng.lat();
          var lng = e.latLng.lng();
          var text = 123;

          var html = "<form><table>" +
                     "<tr><td>Title:</td> <td><input type='text' id='titleInput'/> </td> </tr>" +
                     "<tr><td>Description:</td> <td><input type='text' id='descriptionInput'/></td> </tr>" +
                     "<tr><td></td><td><input type='button' value='Save & Close' onclick='saveData()'/></td></tr>" +
                     "</table></form>";

          prevMarker = newMarker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            draggable: true // make pin draggable
          });
          infowindow.setContent(html);
          infowindow.open(map, newMarker);
        }
        // else {
        //   prevMarker.setMap(null);
        //   limiter = 0;
        //   handleClick(e);
        // }
      };

      // add event listener to map to add a pin with infoWindow
      google.maps.event.addListener(map, 'click', handleClick);

      // add event listener to infoWindow to remove 'unsaved' pin
      google.maps.event.addListener(infowindow,'closeclick',function(){
        prevMarker.setMap(null);
        limiter = 0;
      });
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(locationObj, index) {

      var marker = new google.maps.Marker({
        position: locationObj.latlon,
        map: map,
        title: 'Big Map',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      });

      myMarkerArray.push(marker); // push marker to Array to retain access

      // For each marker created, add a listener that checks for clicks
      google.maps.event.addListener(marker, 'click', function(e) {

        savedInfoWindow.setContent(locationObj.message +
          '<button onclick="hidePin('+index+')"> Hide</button>');
        savedInfoWindow.open(map, marker);
        // When clicked, open the selected marker's message
        // locationObj.message.open(map, marker);
      });
    });

  }
  // ------------------------------------------------------------------------------------

  // Hide saved Pins from the map --------------------------------------------------
  // hidePin function defined in the global scope so that infoWindow has access to the funciton
  window.hidePin = function(markerIndex) {
    myMarkerArray[markerIndex].setMap(null);
  }

  return googleMapService;
});
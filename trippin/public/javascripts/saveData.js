// Make http request to the server when user adds a marker and fills in a form
// saveData function defined in the global scope so that infoWindow has access to the funciton
window.saveData = function($sanitize, $http) {
  return function() {
    var title = $sanitize(document.getElementById('titleInput').value);
    var description = $sanitize(document.getElementById('descriptionInput').value);
    var latlng = newMarker.getPosition();
    var image = document.getElementById('imgInput').value;

    console.log(title, description, image);

    var pin = {
      title: title,
      description: description,
      location: [latlng.lat(), latlng.lng()],
      image: image
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
        '</span><br>' + pin.description + '</p><div id="' + pin._id + '" />';
    
    
      var display    = document.createElement('img');
      display.src    = pin.image;
      display.style  = 'visibility:hidden;';

      var img = new Image();
      img.onload = (function(id, display) {
        return function(e) {
          google.maps.event.addListener(savedInfoWindow, 'domready', function() {
            var element = document.getElementById(id);
            if (last === id) {
              display.style = 'visibility:hidden;';
            }
            if (element) {
              display.height = ((e.path[0].height / e.path[0].width) * 140);
              display.width  = ((e.path[0].width / e.path[0].height) * 140);
              element.appendChild(display);
              setTimeout(function() {
                last = id;
                display.style = '';
              }, 100);
            }
          });
        };
      })(pin._id, display);
      img.src = pin.image;

      // define the new location
      var newLoc = {
        latlon: new google.maps.LatLng(pin.location[0], pin.location[1]),
        message: new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 320
        }),
        title: pin.title,
        description: pin.description,
        image: pin.image
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
        var markerIndex = myMarkerArray.length - 1;
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
};

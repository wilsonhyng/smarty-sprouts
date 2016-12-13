// Make http request to the server when user adds a marker and fills in a form
// saveData function defined in the global scope so that infoWindow has access to the funciton
window.saveData = function($sanitize, $http) {
  return function() {
    var title = $sanitize(document.getElementById('titleInput').value);
    var description = $sanitize(document.getElementById('descriptionInput').value);
    var latlng = newMarker.getPosition();
    var image = document.getElementById('imgInput').value;
 
    if (title !== '' || description !== '' || image !== '') {
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
        //set a fake _id property on the pin so it can be retrieved later
        pin._id = id_iterator;
        id_iterator++;
        
        // Create a popup window for the new location
        var contentString = contentStringGen(pin);

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
    }
  };
};

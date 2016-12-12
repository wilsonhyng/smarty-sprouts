
// Initializes the map
window.initialize = function(latitude, longitude) {
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
                   "<tr><td>Image:</td> <td><input type='text' id='imgInput'/></td> </tr>" +
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
    };

    // add event listener to map to add a pin with infoWindow
    google.maps.event.addListener(map, 'click', handleClick);

    // add event listener to infoWindow to remove 'unsaved' pin
    google.maps.event.addListener(infowindow, 'closeclick', function() {
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

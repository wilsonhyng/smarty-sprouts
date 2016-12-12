// Private Inner Functions
// Convert a JSON of pins into map points
window.convertToMapPoints = function(response) {

  // Clear the locations holder
  var locations = [];

  // Loop through all of the JSON entries provided in the response
  for (var i = 0; i < response.length; i++) {
    var pin = response[i];

    // Create popup windows for each record
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
    
    // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
    locations.push({
      latlon: new google.maps.LatLng(pin.lat, pin.lon),
      message: contentString,
      title: pin.title,
      description: pin.description
    });
  }
  
  // location is now an array populated with records in Google Maps format
  return locations;
};
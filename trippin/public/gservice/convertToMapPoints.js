// Private Inner Functions
// Convert a JSON of pins into map points
window.convertToMapPoints = function(response) {

  // Clear the locations holder
  var locations = [];

  // Loop through all of the JSON entries provided in the response
  for (var i = 0; i < response.length; i++) {
    var pin = response[i];

    // Create popup windows for each record
    var contentString = contentStringGen(pin);
    
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
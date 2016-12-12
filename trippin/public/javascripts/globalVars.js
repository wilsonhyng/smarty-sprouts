// make newMarker and infowindow variables available in the global scope so that info window works
window.newMarker;
window.infowindow;
window.savedInfoWindow = new google.maps.InfoWindow({
  maxWidth: 320
});

// limiter and marker for storing and deleting old markers placed by the user
window.limiter = 0;
window.prevMarker = null;

// variable to store the reference to the map
window.map = null;


window.googleMapService = {};
window.locations = [];   // Array of locations obtained from API calls
window.myMarkerArray = []; // Array of markers placed on the map

// Initial Selected Location (default to center of the world)
window.selectedLat = 19;
window.selectedLong = 173;
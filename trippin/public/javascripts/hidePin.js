// Hide saved Pins from the map
// hidePin function defined in the global scope so that infoWindow has access to the funciton
window.hidePin = function(markerIndex) {
  myMarkerArray[markerIndex].setMap(null);
};
window.contentStringGen = function(pin) {
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
  
  return contentString;
}
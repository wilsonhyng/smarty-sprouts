// Add a logout button to the page using Google's styling
window.Logout = function($http) {
  return function(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '2px';
    controlUI.style.boxShadow = '0 .5px 2px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginTop = '10px';
    controlUI.style.marginLeft = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to Log Out';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '11px';
    controlText.style.lineHeight = '25.5px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Log Out';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
      $http({
        method: 'POST',
        url: '/logout',
      });
      window.location = '/logout';
    });

    controlUI.addEventListener('mouseover', function() {
      controlDiv.childNodes[0].style.backgroundColor = '#eee';
      controlDiv.childNodes[0].style.border = '2px solid #eee';
    });

    controlUI.addEventListener('mouseout', function() {
      controlDiv.childNodes[0].style.backgroundColor = '#fff';
      controlDiv.childNodes[0].style.border = '2px solid #fff';
    });
  }
}

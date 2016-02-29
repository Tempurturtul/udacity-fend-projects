var map;

/**
 * Initializes the Google Map. (Invoked by the callback on the Google Maps API url.)
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}

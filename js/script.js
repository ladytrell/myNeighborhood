
var map;
//initialize the map
//function initMap() {
function initMap() {
    // Constructor creates a new map - Centered at Durham, NC.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 35.9940329, lng: -78.898619},
      zoom: 13,
      //styles: styles,
      mapTypeControl: false
    });
}  
    
var ViewModel = function(){
    var self = this;  //the instance or pointer of the ViewModel
    
    
}

//ko.applyBindings(new ViewModel());
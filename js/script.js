var initialLocations = [
    {
        position: {lat: 35.9625102, lng: -78.90066589999999},
        title: 'Southside Church of Christ',
        address: '800 Elmira Ave, Durham, NC 27707, USA',
        place_id: 'ChIJF6ZUnrTlrIkRWQCZsktyJJE'
    },
    {
        title: 'Hillandale Golf course',
        position: {lat: 36.0240281, lng: -78.9353211},
        address: '1600 Hillandale Rd, Durham, NC 27705, USA',
        place_id: 'ChIJGZJ8zlvhrIkRoyKabDyTBlQ'
    },
    {        
        title: 'Shuckin\' Shack Oyster Bar',
        position: {lat: 36.0076623, lng: -78.9267354},
        address: 'Erwin Square, 2200 West Main Street A-140, Durham, NC 27705, United States',
        place_id: 'ChIJe4ufXQDkrIkRZuAeC8k1rds'
    },
    {
        title: 'University BP Service Center',
        position:  {lat: 35.9862294, lng: -78.90885609999999},
        address:  '1101 University Dr, Durham, NC 27707, USA',
        place_id: 'ChIJgUJ61T_krIkRYZW4_3f6MLY'
    },
    {
        title: 'Hayti Heritage Center', 
        position: {lat: 35.9856855, lng: -78.89794499999999},
        address:  '804 Old Fayetteville St, Durham, NC 27701, USA',
        place_id: 'ChIJC9-j02nkrIkR33TORYex9q0'
    }
]

var ViewModel = function(){
    
    var self = this;  //the instance or pointer of the ViewModel
    
    this.locationList = ko.observableArray([]);
    
    initialLocations.forEach(function(locationItem){
        self.locationList.push( locationItem );
    });
    
    this.markers = [];    

}

ko.applyBindings(new ViewModel());


var map;
// Initialize the map
function initMap() {
    var self = this;  //the instance or pointer of map
    
    locationList = [];
    
    initialLocations.forEach(function(locationItem){
        locationList.push( locationItem );
    });
    
    markers = []; 
    // Constructor creates a new map - Centered at Durham, NC.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 35.9940329, lng: -78.898619},
      zoom: 13,
      //styles: styles,
      mapTypeControl: false
    });
    
    // Projectcode3windowshoppingpart1

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locationList.length; i++) {
      // Get the position from the location array.
      var position = locationList[i].position;
      var title = locationList[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
    }
    
}  
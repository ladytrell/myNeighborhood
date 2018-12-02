
var initialLocations = [
    {
        position: {lat: 35.9625102, lng: -78.90066589999999},
        title: 'Southside Church of Christ',
        address: '800 Elmira Ave, Durham, NC 27707, USA',
        place_id: 'ChIJF6ZUnrTlrIkRWQCZsktyJJE',
        markerId: null
    },
    {
        title: 'Hillandale Golf course',
        position: {lat: 36.0240281, lng: -78.9353211},
        address: '1600 Hillandale Rd, Durham, NC 27705, USA',
        place_id: 'ChIJGZJ8zlvhrIkRoyKabDyTBlQ',
        markerId: null
    },
    {        
        title: 'Shuckin\' Shack Oyster Bar',
        position: {lat: 36.0076623, lng: -78.9267354},
        address: 'Erwin Square, 2200 West Main Street A-140, Durham, NC 27705, United States',
        place_id: 'ChIJe4ufXQDkrIkRZuAeC8k1rds',
        markerId: null
    },
    {
        title: 'University BP Service Center',
        position:  {lat: 35.9862294, lng: -78.90885609999999},
        address:  '1101 University Dr, Durham, NC 27707, USA',
        place_id: 'ChIJgUJ61T_krIkRYZW4_3f6MLY',
        markerId: null
    },
    {
        title: 'Hayti Heritage Center', 
        position: {lat: 35.9856855, lng: -78.89794499999999},
        address:  '804 Old Fayetteville St, Durham, NC 27701, USA',
        place_id: 'ChIJC9-j02nkrIkR33TORYex9q0',
        markerId: null
    }
]

/*
var map;
var markers = [];
var largeInfowindow;
var markerId = 0; */
    
function ViewModel(){
    
    var self = this;  //the instance or pointer of the ViewModel
    
    self.locationList = ko.observableArray();
    
    initialLocations.forEach(function(locationItem){
        self.locationList.push( locationItem );
    });
    
    self.setLocationMarkerID = function( locationItem,locationId){
        this.locationList()[locationItem].markerId = locationId;
    };
    
    // Function to link locationList to the markers.  Try matching the positions
    //this inside the function is the locationList{} due to the with binding in the html
    this.showInfoWindow = function(){
        console.log(this.title);
        console.log(this.position);
        console.log(this.markerId);
        for (var i = 0; i < mapView.markers.length; i++) {
        console.log(mapView.markers[i].title);
        console.log(mapView.markers[i].position);
        console.log(mapView.markers[i].id);
            if(this.markerId == mapView.markers[i].id){
            //if(this.position.lat == markers[i].position.lat && this.position.lng == markers[i].position.lng){
                mapView.populateInfoWindow(mapView.markers[i], mapView.largeInfowindow);
                break;
            }
        }
    };
    /*
    // Udacity Project_Code_10_DisplayRoutesDirectionsService.html
    document.getElementById('search-within-time').addEventListener('click', function() {
        searchWithinTime();
    });
    */
}
var viewModel = new ViewModel();
ko.applyBindings(new ViewModel());

function MapView(){
    
    var self = this;  //the instance or pointer of the MapView
    this.map;
    this.markers = [];
    this.largeInfowindow;
    this.markerId = 0;

    // Initialize the map
    this.initMap = function() {
     
        // Constructor creates a new map - Centered at Durham, NC.
        self.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 35.9940329, lng: -78.898619},
          zoom: 13,
          //styles: styles,
          mapTypeControl: false
        });
        
        this.createMarkers();
    };

    this.createMarkers = function() {    
        // Udacity Projectcode3windowshoppingpart1
        // The following group uses the locationList array to create an array of markers on initialize.
        
        //var largeInfowindow = new google.maps.InfoWindow();
        this.largeInfowindow = new google.maps.InfoWindow();
            
        for (var i = 0; i < viewModel.locationList().length; i++) {
            // Get the position from the location array.
            var position = viewModel.locationList()[i].position;
            var title = viewModel.locationList()[i].title;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                map: self.map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: self.markerId
            });
            viewModel.setLocationMarkerID(i,self.markerId);
            self.markerId++;
            // Push the marker to our array of markers.
            this.markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfowindow);
            });
        }
    };

    // Udacity Projectcode3windowshoppingpart1
    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    this.populateInfoWindow = function (marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick',function(){
                infowindow.setMarker = null;
            });
        }
    };

    /*
    // Need function for processing infor from the dropdown menu
          // This function allows the user to input a desired travel time, in
          // minutes, and a travel mode, and a location - and only show the listings
          // that are within that travel time (via that travel mode) of the location
          function searchWithinTime() {
            // Initialize the distance matrix service.
            var distanceMatrixService = new google.maps.DistanceMatrixService;
            var address = document.getElementById('search-within-time-text').value;
            // Check to make sure the place entered isn't blank.
            if (address == '') {
              window.alert('You must enter an address.');
            } else {
              hideListings();
              // Use the distance matrix service to calculate the duration of the
              // routes between all our markers, and the destination address entered
              // by the user. Then put all the origins into an origin matrix.
              var origins = [];
              for (var i = 0; i < markers.length; i++) {
                origins[i] = markers[i].position;
              }
              var destination = address;
              var mode = document.getElementById('mode').value;
              // Now that both the origins and destination are defined, get all the
              // info for the distances between them.
              distanceMatrixService.getDistanceMatrix({
                origins: origins,
                destinations: [destination],
                travelMode: google.maps.TravelMode[mode],
                unitSystem: google.maps.UnitSystem.IMPERIAL,
              }, function(response, status) {
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                  window.alert('Error was: ' + status);
                } else {
                  displayMarkersWithinTime(response);
                }
              });
            }
          }
    */
}

var mapView = new MapView();
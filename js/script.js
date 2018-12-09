
var maxLocations = 19;
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

var Location = function(data){
    this.title = ko.observable(data.title);
    this.position = data.position;
    this.address = ko.observable(data.address);
    this.place_id = ko.observable(data.place_id);
    this.markerId = ko.observable(data.markerId);
};

function ViewModel(){
    
    var self = this;  //the instance or pointer of the ViewModel
    
    self.filterList = ['Default','Park', 'Museum', 'School', 'Hospital'];
    
    self.selectedCategory = ko.observable('Default');
    
    self.locationList = ko.observableArray();
    
    /*
    initialLocations.forEach(function(locationItem){
        self.locationList.push( locationItem );
    });*/
 
    this.setLocationList = function(locations){
        var i = 0
        locations.forEach(function(locationItem){
        //console.log('setLocationList title: ' + locationItem.title);
            self.locationList.push(new Location(locationItem));
        });
    }; 
    
    this.setLocationList(initialLocations);
    
    self.setLocationMarkerID = function( locationItem,locationId){
        this.locationList()[locationItem].markerId = locationId;
    };
    
    // Function to link locationList to the markers.  Try matching the positions
    //this inside the function is the locationList{} due to the with binding in the html
    this.showInfoWindow = function(){
        //console.log(this.title());
        //console.log(this.position);
        //console.log(this.markerId);
        for (var i = 0; i < mapView.markers.length; i++) {
        //console.log(mapView.markers[i].title);
        console.log('showInfoWindow: ' + mapView.markers[i].position);
        console.log('showInfoWindow: ' + mapView.markers[i].id);
            if(this.markerId == mapView.markers[i].id){
            //if(this.position.lat == markers[i].position.lat && this.position.lng == markers[i].position.lng){
                mapView.populateInfoWindow(mapView.markers[i], mapView.largeInfowindow);
                break;
            }
        }
    };
    
    this.empytList = function(){
        self.locationList().forEach(function(item){
            self.locationList.removeAll();
        });
    };
    
    this.clickCategory = function(){
        //self.empytList();
        self.locationList.removeAll();
        mapView.hideMarkers();
        //console.log('clickCategory list length: ' + self.locationList.length);
        console.log('clickCategory self.selectedCategory(): ' + self.selectedCategory());
        if(self.selectedCategory() == 'Default'){
            self.setLocationList(initialLocations);
            mapView.createMarkers();
        }
        else{
           //self.setLocationList(mapView.getLocations(self.selectedCategory()));
           mapView.getLocations(self.selectedCategory());
        }
    };
    
}
var viewModel = new ViewModel();
ko.applyBindings(new ViewModel());

function MapView(){
    
    var self = this;  //the instance or pointer of the MapView
    this.map;
    this.markers = [];
    this.largeInfowindow;
    this.markerId = 0;
    this.mapLocation = {lat: 35.9940329, lng: -78.898619};

    // Initialize the map
    this.initMap = function() {
     
        // Constructor creates a new map - Centered at Durham, NC.
        self.map = new google.maps.Map(document.getElementById('map'), {
          center: self.mapLocation,
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
        self.largeInfowindow = new google.maps.InfoWindow();
            
        console.log("createMarkers viewModel.locationList: " + viewModel.locationList().length);
            
        for (var i = 0; i < viewModel.locationList().length; i++) {
            // Get the position from the location array.
            var position = viewModel.locationList()[i].position;
            var title = viewModel.locationList()[i].title();
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
            marker.setMap(self.map);
            // Push the marker to our array of markers.
            self.markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                self.populateInfoWindow(this, self.largeInfowindow);
            });
        }
    };

    // This function will loop through the listings and hide them all. Clear markers array
    // Udacity Project_Code_13_DevilInTheDetailsPlacesDetails.html
    this.hideMarkers = function () {
        for (var i = 0; i < self.markers.length; i++) {
          self.markers[i].setMap(null);
        }
        self.markers.splice(0,self.markers.length);
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

    this.getLocations = function(category){
        console.log("getLocation: " + category);
        
        var request = {
            location: self.mapLocation,
            type: [category.toLowerCase()],
            radius:  11000,
            fields: ['name', 'formatted_address', 'place_id', 'geometry'],
        };
        service = new google.maps.places.PlacesService(self.map);
        service.nearbySearch(request, self.createLocationList);
    };

    this.createLocationList = function(results, status){ 
        console.log("createLocationList: " + status);         
        var newLocations = [];
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length && i < maxLocations; i++) {
                var place = {
                    title: '',
                    address: '',
                    place_id: '',
                    position: '',
                    markerId: null
                }                 
                if(results[i].name){ place.title = results[i].name;}
                if(results[i].formatted_address){ place.address = results[i].formatted_address;}
                else if(results[i].vicinity) { place.address = results[i].vicinity;}
                else{;}
                if(results[i].place_id){ place.place_id = results[i].place_id;}
                if(results[i].geometry.location){ place.position = results[i].geometry.location;}
                
                //console.log("place title: " + place.title);  
                //console.log("place adress: " + place.address);
                newLocations.push(place);
            }
        }
        viewModel.setLocationList(newLocations);
        self.createMarkers();
    };
}

var mapView = new MapView();
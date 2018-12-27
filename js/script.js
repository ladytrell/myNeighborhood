
var maxLocations = 19;
var initialLocations = [
    {
        position: {lat: 35.9625102, lng: -78.90066589999999},
        title: 'Southside Church of Christ',
        address: '800 Elmira Ave, Durham, NC 27707, USA',
        place_id: 'ChIJF6ZUnrTlrIkRWQCZsktyJJE',
		foursquare_id: null,
		photo_info: null,
        markerId: null
    },
    {
        title: 'Hillandale Golf course',
        position: {lat: 36.0240281, lng: -78.9353211},
        address: '1600 Hillandale Rd, Durham, NC 27705, USA',
        place_id: 'ChIJGZJ8zlvhrIkRoyKabDyTBlQ',
		foursquare_id: null,
		photo_info: null,
        markerId: null
    },
    {        
        title: 'Shuckin\' Shack Oyster Bar',
        position: {lat: 36.0076623, lng: -78.9267354},
        address: 'Erwin Square, 2200 West Main Street A-140, Durham, NC 27705, United States',
        place_id: 'ChIJe4ufXQDkrIkRZuAeC8k1rds',
		foursquare_id: null,
		photo_info: null,
        markerId: null
    },
    {
        title: 'University BP Service Center',
        position:  {lat: 35.9862294, lng: -78.90885609999999},
        address:  '1101 University Dr, Durham, NC 27707, USA',
        place_id: 'ChIJgUJ61T_krIkRYZW4_3f6MLY',
		foursquare_id: '50d4ed75e4b01e0c5d1cc7a6',
		photo_info: null,
        markerId: null
    },
    {
        title: 'Hayti Heritage Center', 
        position: {lat: 35.9856855, lng: -78.89794499999999},
        address:  '804 Old Fayetteville St, Durham, NC 27701, USA',
        place_id: 'ChIJC9-j02nkrIkR33TORYex9q0',
		foursquare_id: '4c61ebbce1349521fbe9aaf0',
		photo_info: null,
        markerId: null
    }
];

var Location = function(data){
    this.title = ko.observable(data.title);
    this.position = data.position;
    this.address = ko.observable(data.address);
    this.place_id = ko.observable(data.place_id);
    this.markerId = ko.observable(data.markerId);
	this.foursquare_id = ko.observable(data.foursquare_id);
	this.photo_info = ko.observable(data.photo_info);
};

function ViewModel(){
    
    var self = this;  //the instance or pointer of the ViewModel
    
    self.filterList = {
		Default: 'Default',
		Golf:  '4bf58dd8d48988d1e6941735',
		Parks: '4bf58dd8d48988d163941735', 
		Museum: '4bf58dd8d48988d181941735', 
		Schools: '4d4b7105d754a06372d81259', 
		Hospital: '4bf58dd8d48988d196941735'
	};
    
	self.filterListKey = Object.keys(self.filterList);
	
    self.selectedCategory = ko.observable('Default');
    
    self.locationList = ko.observableArray();
    
    /*
    initialLocations.forEach(function(locationItem){
        self.locationList.push( locationItem );
    });*/
 
    this.setLocationList = function(locations){
        var i = 0
        locations.forEach(function(locationItem){
			//console.log('setLocationList photo_info: ' + locationItem.photo_info);
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
			console.log('clickCategory initialLocations.type: ' + initialLocations.type);
			self.setLocationList(initialLocations);
            mapView.createMarkers();
        }
        else{
            //self.setLocationList(mapView.getLocations(self.selectedCategory()));
			//mapView.getLocations(self.selectedCategory());
			self.foursquareList(self.filterList[self.selectedCategory()]);
        }
    };
	

	this.getPhoto = function(id){
		
		var size = '100x100';
		// https://api.foursquare.com/v2/venues/4c61ebbce1349521fbe9aaf0/photos?client_id=ERFXHUGKVY1MQDYO4DOZZQPWPYVOVCD5B3UHAI20WFZ0OYTM&client_secret=WG1ZBINAIDSRRJOQ5GF11UD3V1R2SML2IAPKLC0DFFLU4OG2&v=20181219
		// response’s prefix + size + suffix. Ex://https://igx.4sqi.net/img/general/300x500/5163668_xXFcZo7sU8aa1ZMhiQ2kIP7NllD48m7qsSwr1mJnFj4.jpg
		
		if (id == null){ return null; }
		
		var foursquareUrl = 'https://api.foursquare.com/v2/venues/' + id + '/photos?client_id=ERFXHUGKVY1MQDYO4DOZZQPWPYVOVCD5B3UHAI20WFZ0OYTM&client_secret=WG1ZBINAIDSRRJOQ5GF11UD3V1R2SML2IAPKLC0DFFLU4OG2&v=20181219';
		
		$.getJSON(foursquareUrl, function(data){			
			
			if (data.response.photos.count > 0){			
				return data.response.photos.items.prefix + size + data.response.photos.items.suffix;
			}
			else{
				return null;
			}			
		});
		
		return null;
	};
     	
	this.foursquareList = function(category){
		var coords = mapView.mapLocation;        
        var newLocations = [];
		var radius = 15000;
		console.log('foursquareList');
		
		//console.log('foursquareList category' + category);
		// Foursquare AJAX request
		// https://api.foursquare.com/v2/venues/search?client_id=ERFXHUGKVY1MQDYO4DOZZQPWPYVOVCD5B3UHAI20WFZ0OYTM&client_secret=WG1ZBINAIDSRRJOQ5GF11UD3V1R2SML2IAPKLC0DFFLU4OG2&v=20181219&ll=35.9940329,-78.898619&categoryId=4bf58dd8d48988d196941735&limit=19
		
		
		var foursquareUrl = 'https://api.foursquare.com/v2/venues/search?client_id=ERFXHUGKVY1MQDYO4DOZZQPWPYVOVCD5B3UHAI20WFZ0OYTM&client_secret=WG1ZBINAIDSRRJOQ5GF11UD3V1R2SML2IAPKLC0DFFLU4OG2&v=20181219&ll=' + coords.lat + ',' + coords.lng + '&categoryId=' + category +'&radius=' + radius + '&limit=19';
				
		console.log('foursquareList url: ' + foursquareUrl);
		
		$.getJSON(foursquareUrl, function(data){
			
			fsList = data.response.venues;
			for (var i = 0; i < fsList.length && i < maxLocations; i++) {
				var venue = fsList[i];
            
                var place = {
                    title: '',
                    address: '',
                    place_id: '',
                    position: '',
					foursquare_id: null,
					photo_info: null,
                    markerId: null
                }                 
                if(fsList[i].name){ place.title = fsList[i].name;}
                if(fsList[i].formatted_address){ place.address = fsList[i].formattedAddress;}
                //else if(fsList[i].vicinity) { place.address = fsList[i].vicinity;}
                else{;}                
                if(fsList[i].location){ place.position = fsList[i].location;}
                console.log("place position: " + place.position);  
				place.foursquare_id = fsList[i].id;
				console.log('fsList:  ' +  place.title);
                
                newLocations.push(place);
            }
			
			//console.log("createLocationList: " + status); 
        
			self.setLocationList(newLocations);
			mapView.createMarkers();
		});
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
            var foursquareId = viewModel.locationList()[i].foursquare_id();
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                map: self.map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
				foursquareId: foursquareId,
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

}

var mapView = new MapView();
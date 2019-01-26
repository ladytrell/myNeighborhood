var city = {
    lat: 35.9940329,
    lng: -78.898619
};

var maxLocations = 19;

var Location = function(data) {
    this.title = data.title;
    this.position = data.position;
    this.address = data.address;
    this.place_id = data.place_id;
    this.markerId = data.markerId;
    this.foursquare_id = data.foursquare_id;
};

function ViewModel() {

    var self = this; //the instance or pointer of the ViewModel

    self.filterList = {
        Golf: '4bf58dd8d48988d1e6941735',
        Parks: '4bf58dd8d48988d163941735',
        Museum: '4bf58dd8d48988d181941735',
        Schools: '4f4533804b9074f6e4fb0105',
        Hospital: '4bf58dd8d48988d196941735'
    };
    self.filterListKey = Object.keys(self.filterList);
	self.selectedCategory = ko.observable('Schools');
    self.locationList = ko.observableArray();


    this.setLocationList = function(locations) {
        locations.forEach(function(locationItem) {
            self.locationList.push(new Location(locationItem));
        });
    };

    self.setLocationMarkerID = function(locationItem, locationId) {
        this.locationList()[locationItem].markerId = locationId;
    };

    // Function to link locationList to the markers.  Try matching the positions
    //this inside the function is the locationList{} due to the with binding in the html
    this.showInfoWindow = function() {
        //console.log(this.title());
        //console.log(this.position);
        //console.log(this.markerId);
        for (var i = 0; i < mapView.markers.length; i++) {
            //console.log(mapView.markers[i].title);
            console.log('showInfoWindow: ' + mapView.markers[i].position);
            console.log('showInfoWindow: ' + mapView.markers[i].id);
            if (this.markerId == mapView.markers[i].id) {
                mapView.populateInfoWindow(mapView.markers[i], mapView.largeInfowindow);
                break;
            }
        }
    };
	

    this.empytList = function() {
        self.locationList().forEach(function(item) {
            self.locationList.removeAll();
        });
    };

    this.clickCategory = function() {
        self.locationList.removeAll();
        mapView.hideMarkers();
		
        console.log('clickCategory self.selectedCategory(): ' + self.selectedCategory());        
            
        self.foursquareList(self.filterList[self.selectedCategory()]);        
    };


    this.foursquareList = function(category) {
        var coords = city;
        var newLocations = [];
        var radius = 8500;
        var limit = 19;
        console.log('foursquareList');

        //console.log('foursquareList category' + category);
        // Foursquare AJAX request
        // https://api.foursquare.com/v2/venues/search?client_id=ERFXHUGKVY1MQDYO4DOZZQPWPYVOVCD5B3UHAI20WFZ0OYTM&client_secret=WG1ZBINAIDSRRJOQ5GF11UD3V1R2SML2IAPKLC0DFFLU4OG2&v=20181219&ll=35.9940329,-78.898619&categoryId=4bf58dd8d48988d196941735&radius=8500&limit=19

        var foursquareUrl = 'https://api.foursquare.com/v2/venues/search?client_id=ERFXHUGKVY1MQDYO4DOZZQPWPYVOVCD5B3UHAI20WFZ0OYTM&client_secret=WG1ZBINAIDSRRJOQ5GF11UD3V1R2SML2IAPKLC0DFFLU4OG2&v=20181219&ll=' + coords.lat + ',' + coords.lng + '&categoryId=' + category + '&radius=' + radius + '&limit=' + limit;

        console.log('foursquareList url: ' + foursquareUrl);

        $.getJSON(foursquareUrl, function(data) {

            fsList = data.response.venues;
            for (var i = 0; i < fsList.length && i < maxLocations; i++) {
                var venue = fsList[i];

                var place = {
                    title: '',
                    address: '',
                    place_id: '',
                    position: '',
                    foursquare_id: null,
                    markerId: null
                }
                if (fsList[i].name) {
                    place.title = fsList[i].name;
                }
                if (fsList[i].location.address) {
                    place.address = fsList[i].location.address;
                }
                if (fsList[i].location) {
                    place.position = fsList[i].location;
                }
                console.log("place position: " + place.position);
                place.foursquare_id = fsList[i].id;
                console.log('fsList:  ' + place.title);

                newLocations.push(place);
            }

            self.setLocationList(newLocations);
            mapView.createMarkers();
        }).fail(function() {
            alert("Cannot load locatiion List");
        });
    };

	this.foursquareList(self.filterList[self.selectedCategory()]);
}
var viewModel = new ViewModel();
ko.applyBindings(viewModel);

function MapView() {

    var self = this; //the instance or pointer of the MapView
    this.map;
    this.markers = [];
    this.largeInfowindow;
    this.markerId = 0;
    this.mapLocation = city;

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

    this.googleError = function() {
        //Figure out how to write to the map div
        var mapDev = document.getElementById('map');
        var text = document.createTextNode("Google maps failed to load");

        mapDev.appendChild(text);
        console.log("<p>Google maps failed to load</p>");
        alert("oogle maps failed to load");
    }


    this.createMarkers = function() {
        // Udacity Projectcode3windowshoppingpart1
        // The following group uses the locationList array to create an array of markers on initialize.

        self.largeInfowindow = new google.maps.InfoWindow();

        console.log("createMarkers viewModel.locationList: " + viewModel.locationList().length);

        for (var i = 0; i < viewModel.locationList().length; i++) {
            // Get the position from the location array.
            var position = viewModel.locationList()[i].position;
            var title = viewModel.locationList()[i].title
            var address = viewModel.locationList()[i].address
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                map: self.map,
                position: position,
                title: title,
                address: address,
                animation: google.maps.Animation.DROP,
                id: self.markerId
            });
            viewModel.setLocationMarkerID(i, self.markerId);
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
    this.hideMarkers = function() {
        for (var i = 0; i < self.markers.length; i++) {
            self.markers[i].setMap(null);
        }
        self.markers.splice(0, self.markers.length);
    };

    // Udacity Projectcode3windowshoppingpart1
    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    this.populateInfoWindow = function(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div><div>' + marker.address + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.setMarker = null;
                self.toggleBounce(marker);
            });
            self.toggleBounce(marker);
        }
    };

    // https://developers.google.com/maps/documentation/javascript/markers
    this.toggleBounce = function(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    };

    this.getLocations = function(category) {
        console.log("getLocation: " + category);

        var request = {
            location: self.mapLocation,
            type: [category.toLowerCase()],
            radius: 11000,
            fields: ['name', 'formatted_address', 'place_id', 'geometry'],
        };
        service = new google.maps.places.PlacesService(self.map);
        service.nearbySearch(request, self.createLocationList);
    };
}

var mapView = new MapView();
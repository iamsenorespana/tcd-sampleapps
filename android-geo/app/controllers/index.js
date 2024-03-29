 
/**
 * Helper Methods
 */

/*
	Define our Android GPS provider types
*/
var providerPassive = Ti.Geolocation.Android.createLocationProvider({
	/* 
	 * Returns cached location values generated by other applications that are running or recently ran
	 * Fastest to return location value, but most likely to be outdated or inaccurate
	 * Requires android.permission.ACCESS_FINE_LOCATION permission, though might return only coarse location values
	 */
    name: Ti.Geolocation.PROVIDER_PASSIVE,
    minUpdateDistance: 0.0,
    minUpdateTime: 0
});

var providerNetwork = Ti.Geolocation.Android.createLocationProvider({
	/* 
	 * Returns location data determined by data network connection or by Assisted GPS (AGPS) in which a cell-network location
	 * 		value is returned for a quick initial location and later a fine GPS fix is returned
	 * Fast to return data, accurate to roughly 200ft/60m
	 * Requires either android.permission.ACCESS_COARSE_LOCATION or android.permission.ACCESS_FINE_LOCATION permissions
	 */
    name: Ti.Geolocation.PROVIDER_NETWORK,
    minUpdateDistance: 0.0,
    minUpdateTime: 5
});

var providerGps = Ti.Geolocation.Android.createLocationProvider({
	/*
	 * Returns location resolved by GPS circuitry or by Assisted GPS (AGPS) in which a cell-network location
	 * 		value is returned for a quick initial location and later a fine GPS fix is returned
	 * Slowest to return location but likely to be the most accurate (~10ft / 3m or less)
	 * Requires android.permission.ACCESS_FINE_LOCATION permission
	 */
    name: Ti.Geolocation.PROVIDER_GPS,
    minUpdateDistance: 0.0,
    minUpdateTime: 0
});

/*
 * Location Rules filter the results returned by location providers. You use location rules to reduce the number of location 
 * update events, and ensure that the events you do receive are as accurate and recent as your application requires.
*/
var gpsRule = Ti.Geolocation.Android.createLocationRule({
    provider: Ti.Geolocation.PROVIDER_GPS,
    minAge: 10000
});

// to support legacy mode, deprecated
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

function translateErrorCode(code) {
	// return meaningful error strings
    if (code == null) {
        return null;
    }
    switch (code) {
        case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
            return "Location unknown";
		break;
        case Ti.Geolocation.ERROR_DENIED:
            return "Access denied";
		break;
        case Ti.Geolocation.ERROR_NETWORK:
            return "Network error";
		break;
        case Ti.Geolocation.ERROR_HEADING_FAILURE:
            return "Failure to detect heading";
		break;
        case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
            return "Region monitoring access denied";
		break;
        case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
            return "Region monitoring access failure";
		break;
        case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
            return "Region monitoring setup delayed";
		break;
        default:
        	return code;
		break;
    }
}

var locationAdded = false; // used for lifecycle management, see below
var locationCallback = function(e) {
	/*
	 * This is the function called each time a location is determined
	*/
    if (!e.success || e.error) {
    	// if there's an error ...
        $.updatedLocation.text = 'error:' + JSON.stringify(e.error);
        $.updatedLatitude.text = '';
        $.updatedLocationAccuracy.text = '';
        $.updatedLocationTime.text = '';
        Ti.API.info("Code translation: "+translateErrorCode(e.code));

        return;
    }

    var longitude = e.coords.longitude;
    var latitude = e.coords.latitude;
    var altitude = e.coords.altitude;
    var heading = e.coords.heading;
    var accuracy = e.coords.accuracy;
    var speed = e.coords.speed;
    var timestamp = e.coords.timestamp;
    var altitudeAccuracy = e.coords.altitudeAccuracy;

     $.updatedLocation.text = 'long:' + longitude;
     $.updatedLatitude.text = 'lat: '+ latitude;
     $.updatedLocationAccuracy.text = 'accuracy:' + accuracy;
     $.updatedLocationTime.text = 'timestamp:' +new Date(timestamp);

     $.updatedLatitude.color = 'red';
     $.updatedLocation.color = 'red';
     $.updatedLocationAccuracy.color = 'red';
     $.updatedLocationTime.color = 'red';
    setTimeout(function() {
         $.updatedLatitude.color = '#444';
         $.updatedLocation.color = '#444';
         $.updatedLocationAccuracy.color = '#444';
        $.updatedLocationTime.color = '#444';
    },100);

	Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt) {
		if (evt.success) {
			var places = evt.places;
			console.log(places)
			if (places && places.length) {
				 $.reverseGeo.text = places[0].address;
			} else {
				 $.reverseGeo.text = "No address found";
			}
			Ti.API.debug("reverse geolocation result = "+JSON.stringify(evt));
		}
		else {
			Ti.API.info("Reverse geocoding error: "+translateErrorCode(e.code));
		}
	});

	locationAdded = true;
    Titanium.API.info('geo - location updated: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
};


/**
 * Button Event Listeners
 */
$.button1.addEventListener('click', function(e) {
    Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_NETWORK;
    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
    Ti.Geolocation.Android.manualMode = false;
});

$.button2.addEventListener('click', function(e) {
    Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
    Ti.Geolocation.Android.manualMode = false;
});

$.button3.addEventListener('click', function(e) {
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_LOW;
    Ti.Geolocation.Android.manualMode = false;
});

$.button4.addEventListener('click', function(e) {
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
    Ti.Geolocation.Android.manualMode = false;
});

$.button5.addEventListener('click', function(e) {
    Ti.Geolocation.Android.removeLocationProvider(providerPassive);
    Ti.Geolocation.Android.removeLocationProvider(providerGps);
    Ti.Geolocation.Android.addLocationProvider(providerNetwork);
    Ti.Geolocation.Android.manualMode = true;
});

$.button6.addEventListener('click', function(e) {
    Ti.Geolocation.Android.removeLocationProvider(providerPassive);
    Ti.Geolocation.Android.addLocationProvider(providerNetwork);
    Ti.Geolocation.Android.addLocationProvider(providerGps);
    Ti.Geolocation.Android.manualMode = true;
});

$.button7.addEventListener('click', function(e) {
    Ti.Geolocation.Android.removeLocationProvider(providerPassive);
    Ti.Geolocation.Android.removeLocationProvider(providerNetwork);
    Ti.Geolocation.Android.addLocationProvider(providerGps);
    Ti.Geolocation.Android.manualMode = true;
});

$.button8.addEventListener('click', function(e) {
    Ti.Geolocation.Android.addLocationRule(gpsRule);
});

$.button9.addEventListener('click', function(e) {
    Ti.Geolocation.Android.removeLocationRule(gpsRule);
});

/**
 * Global Event Listeners
 */

/*
 * Ddd the geolocation event listener so that the app is ready to
 * receive location events
*/
Titanium.Geolocation.addEventListener('location', locationCallback);


if(OS_ANDROID){
/*
 * Finally, add lifecycle event listeners to remove geolocation listeners as appropriate 
 */
 
	//  as the destroy handler will remove the listener, only set the pause handler to remove if you need battery savings
	Ti.Android.currentActivity.addEventListener('pause', function(e) {
		Ti.API.info("pause event received");
		if (locationAdded) {
			Ti.API.info("removing location callback on pause");
			Titanium.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
	});
	Ti.Android.currentActivity.addEventListener('destroy', function(e) {
		Ti.API.info("destroy event received");
		if (locationAdded) {
			Ti.API.info("removing location callback on destroy");
			Titanium.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
	});
	Ti.Android.currentActivity.addEventListener('resume', function(e) {
		Ti.API.info("resume event received");
		if (!locationAdded && locationCallback) {
			Ti.API.info("adding location callback on resume");
			Titanium.Geolocation.addEventListener('location', locationCallback);
			locationAdded = true;
		}
	});
 	
}

$.index.open();

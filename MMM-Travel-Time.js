/* Magic Mirror Module: MMM-Travel-Time
 * Version: 1.0.0
 *
 * By Michael Byers https://github.com/MichaelByers/
 * MIT Licensed.
 */

Module.register('MMM-Travel-Time', {

	defaults: {
            apikey:    '',
			olat:		0,
			olong: 		-1,
			dlat: 		0,
			dlong: 		-1,
			glat:		0,
			glong:		-1,
            interval:   300000 // Every 5 mins
        },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    start:  function() {
        Log.log('Starting module: ' + this.name);
        var self = this;

        // Set up the local values, here we construct the request url to use
        this.loaded = false;
        this.route = [];

        // Trigger the first request
        this.getRouteData(this);
        setInterval(function() {
            self.getRouteData(self);
          }, self.config.interval);
    },

    getStyles: function() {
        return ['MMM-Travel-Time.css', 'font-awesome.css'];
    },


    getRouteData: function(_this) {
		var day = moment().format('dddd');
 
		// if weekday show drive time to work
		if ((day != 'Saturday') && (day != 'Sunday')) {
			this.url = 'https://api.tomtom.com/routing/1/calculateRoute/' + this.config.olat + ','+ this.config.olong + ':' + this.config.dlat + ',' + this.config.dlong + '/json?computeTravelTimeFor=all&sectionType=traffic&traffic=true&travelMode=car&key=' + this.config.apikey;
		} else {
			this.url = 'https://api.tomtom.com/routing/1/calculateRoute/' + this.config.olat + ','+ this.config.olong + ':' + this.config.glat + ',' + this.config.glong + '/json?computeTravelTimeFor=all&sectionType=traffic&traffic=true&travelMode=car&key=' + this.config.apikey;
		}
			// Make the initial request to the helper then set up the timer to perform the updates
        _this.sendSocketNotification('GET-TRAVEL-TIME', _this.url);
    },


    getDom: function() {
        // Set up the local wrapper
        var wrapper = null;


        // If we have some data to display then build the results
        if (this.loaded) {
            wrapper = document.createElement('div');
	 	    wrapper.className = 'route';
			
			var day = moment().format('dddd');
			var title = 'Travel Time to ';
			var travelTime = '';
			var text = '';

			// if weekday show drive time to work
			if ((day != 'Saturday') && (day != 'Sunday')) {
				title = title + 'Work: ';
			} else {
				title = title + 'Golf: ';
			}

			travelTime = Math.round(this.route.summary.travelTimeInSeconds/60);

			text = title + travelTime + ' min';

    		wrapper.innerHTML = text;
        } else {
            // Otherwise lets just use a simple div
            wrapper = document.createElement('div');
            wrapper.innerHTML = 'LOADING...';
        }

        return wrapper;
    },


    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-TRAVEL-TIME' && payload.url === this.url) {
                // we got some data so set the flag, stash the data to display then request the dom update
                this.loaded = true;
                this.route = payload.route;
                this.updateDom(1000);
            }
        }
    });

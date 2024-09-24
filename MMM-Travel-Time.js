/* Magic Mirror Module: MMM-Travel-Time
 * Version: 1.0.0
 *
 * By Michael Byers https://github.com/MichaelByers/
 * MIT Licensed.
 */

Module.register('MMM-Travel-Time', {

	defaults: {
		apikey:    '',
		start: {
			lat:		0,
			long: 		-1,
		},
		waypoint: [
			{
				title: '',
				lat:	0,
				long: 	-1,
				icon: 	''
			}
		],
		interval:   300000 // Every 5 mins
	},

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    start:  function() {
        Log.log('Starting module: ' + this.name);
        let self = this;

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
		// Make the initial request to the helper then set up the timer to perform the updates
		let hour = moment().hour();

		if( (hour >= 6) && (hour <=22) ) {
            _this.sendSocketNotification('GET-TRAVEL-TIME', _this.config);
        }
    },


    getDom: function() {
        // Set up the local wrapper
        let wrapper = null;

        // If we have some data to display then build the results
        if (this.loaded) {
            wrapper = document.createElement('div');
	 	    wrapper.className = 'route';

			for(let i=0; i<this.route.length; i++) {
				let row = document.createElement('div');
				row.className = 'row';

				let title = 'Travel Time to ';
				let travelTime = '';
				let text = '';
				let path = './modules/MMM-Travel-Time/images/';

				title = title + this.config.waypoint[i].title + ' ';
				travelTime = Math.round(this.route[i].summary.travelTimeInSeconds / 60);
				text = title + travelTime + ' min';

				let icon = document.createElement('img');
				icon.className = 'icon';
				icon.setAttribute('height', '50');
				icon.setAttribute('width', '50');
				icon.src = path+this.config.waypoint[i].icon;

				row.appendChild(icon);
				let tempText = document.createElement('span');
				tempText.className = 'tempText';
				tempText.innerHTML = text;
				row.appendChild(tempText);
				wrapper.appendChild(row);
			}
        } else {
            // Otherwise lets just use a simple div
            wrapper = document.createElement('div');
            wrapper.innerHTML = 'LOADING...';
        }

        return wrapper;
    },


    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-TRAVEL-TIME') {
                // we got some data so set the flag, stash the data to display then request the dom update
                this.loaded = true;
                this.route = payload.route;
                this.updateDom(1000);
            }
        }
    });

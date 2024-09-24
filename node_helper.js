/* Magic Mirror Module: MMM-Travel-Time helper
 * Version: 1.0.0
 *
*/

var NodeHelper = require('node_helper');
var axios = require('axios').default;
var moment = require('moment');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-Travel-Time helper, started...');
    },

    socketNotificationReceived: function(notification, payload) {
		const getRouteData = async (payload) => {
			let _this = this;
			let route = [];
			for (let i=0; i<payload.waypoint.length; i++) {
				let url = 'https://api.tomtom.com/routing/1/calculateRoute/' + payload.start.lat + ',' + payload.start.long + ':' + payload.waypoint[i].lat + ',' + payload.waypoint[i].long + '/json?computeTravelTimeFor=all&sectionType=traffic&traffic=true&travelMode=car&key=' + payload.apikey;
				await axios.get(url)
					.then(function (response) {
						// Check to see if we are error free and got an OK response
						if (response.status == 200) {
							route.push(response.data.routes[0]);
						} else {
							// In all other cases it's some other error
							console.log('[MMM-Travel-Time] ** ERROR ** : ' + response.status);
						}
					})
					.catch(function (error) {
						// handle error
						console.log("[MMM-Travel-Time] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** " + error);
					});
			}
			// We have the response figured out so lets fire off the notifiction
			_this.sendSocketNotification('GOT-TRAVEL-TIME', {'route': route});
		}
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-TRAVEL-TIME') {
            getRouteData(payload);
        }
    }

});

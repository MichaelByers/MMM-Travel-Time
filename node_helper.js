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


    getRouteData: function(payload) {

        var _this = this;
        this.url = payload;

		axios.get(this.url)
			.then(function (response) {
            var route = null; // Clear the array
            // Check to see if we are error free and got an OK response
            if (response.status == 200) {
                route = response.data.routes[0];
            } else {
                // In all other cases it's some other error
                console.log('[MMM-Travel-Time] ** ERROR ** : ' + response.status);
            }

            // We have the response figured out so lets fire off the notifiction
            _this.sendSocketNotification('GOT-TRAVEL-TIME', {'url': _this.url, 'route': route});
        })
		.catch(function (error) {
			// handle error
			console.log( "[MMM-Travel-Time] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** " + error );
		});

	},

    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-TRAVEL-TIME') {
            this.getRouteData(payload);
        }
    }

});

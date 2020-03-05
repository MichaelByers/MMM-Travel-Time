/* Magic Mirror Module: MMM-Travel-Time helper
 * Version: 1.0.0
 *
*/

var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

    start: function () {
        console.log('MMM-Travel-Time helper, started...');
    },


    getRouteData: function(payload) {

        var _this = this;
        this.url = payload;

        request({url: this.url, method: 'GET'}, function(error, response, body) {
            // Lets convert the body into JSON
            var result = JSON.parse(body);
            var route = null; // Clear the array

            // Check to see if we are error free and got an OK response
            if (!error && response.statusCode == 200) { 
                route = result.routes[0];
            } else {
                // In all other cases it's some other error
            }

            // We have the response figured out so lets fire off the notifiction
            _this.sendSocketNotification('GOT-TRAVEL-TIME', {'url': _this.url, 'route': route});
        });
    },

    socketNotificationReceived: function(notification, payload) {
        // Check this is for us and if it is let's get the weather data
        if (notification === 'GET-TRAVEL-TIME') {
            this.getRouteData(payload);
        }
    }

});

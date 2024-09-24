# MMM-Travel-Time
Show travel time to various waypoints module for Magic Mirror

##Installing the Module
Navigate into your MagicMirror's modules folder and execute <br>
`git clone https://github.com/MichaelByers/MMM-Travel-Time.git`
## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
{
	module: "MMM-Travel-Time",
	position: "top_left",
	header: "Travel Time",
	config: {
		apikey: "api_key",
		start: {
			lat:	gps_lat,
			long: 	gps_long,
		},
	waypoint: [
		{
			title:	'Office',
			lat:	gps_lat,
			long: 	gps_long,
			icon: 	'office.png'
		},
		{
			title:	'Golf',
			lat:	gps_lat,
			long: 	gps_lat,
			icon: 	'golf.png'
		}
	],
	interval:   300000
}
````


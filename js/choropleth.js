// Global variables
let map;
let lat = 34.0900;
let lon = -118.3617;
let zl = 10;
let path = 'data/choropleth_chart.json';
let geojsonPath = 'data/la_county.geojson';
let count_data;
let years_data;
let geojson_data;
let geojson_layer;
let fieldtomap = 'Median Household Income (In 2019 Inflation Adjusted Dollars)';

let brew = new classyBrew();
let legend = L.control({position: 'topleft'});
let info_panel = L.control({position:'topleft'});

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
    getJSON();
	getGeoJSON();
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to get the choropleth data
function getJSON(){

	$.getJSON(path,function(data){
		console.log(data)

		// put the data in a global variable
		count_data = data;

	})
}

// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

        //add count to geojson data
        let counties = []; 
        count_data.forEach(function(item){counties.push(item["County"])});
        for(let i = 0; i < geojson_data.features.length; i++) {
            let key = counties.indexOf(geojson_data.features[i]["properties"]["name"]);
            //console.log(geojson_data.features[i]["properties"]["name"]);
            //console.log(key);
            if (key == -1){
                geojson_data.features[i]["properties"]["count"] = 0;
            } else{
                geojson_data.features[i]["properties"]["count"] = count_data[key]["count"];
            }
        }

		// call the map function
		mapGeoJSON('count') // add a field to be used
	})
}

// function to map a geojson file
function mapGeoJSON(field){

	// clear layers in case it has been mapped already
	if (geojson_layer){
		geojson_layer.clearLayers()
	}
	
	// globalize the field to map
	fieldtomap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function(item,index){
		values.push(item.properties[field])
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(8);
	brew.setColorCode('YlGnBu');
	brew.classify('quantiles');

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data, {
		style: getStyle, //call a function to style each feature
		onEachFeature: onEachFeature // actions on each feature
	}).addTo(map);

    createLegend();
	createInfoPanel();
}

function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
		fillOpacity: 0.9
	}
}

function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
					'<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 2,
		color: '#666',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	info_panel.update(layer.feature.properties);
    createDashboard(layer.feature.properties);
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);
	info_panel.update() // resets infopanel
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function createInfoPanel(){

	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a neighborhood to get the count!';
		}
	};

	info_panel.addTo(map);
}

function createDashboard(properties){

	// clear dashboard
	$('.dashboard').empty();

	console.log(properties)

	// chart title
	let title = 'Year x Amount of Art Pieces';

	// data values
	let data = [27,17,17,20];

	// data fields
	let fields = ['New York Yankees','LA Lakers','Boston Celtics','Manchester United'];

	// set chart options
	let options = {
		chart: {
			type: 'bar',
			height: 300,
			animations: {
				enabled: true,
			}
		},
		title: {
			text: title,
		},
		plotOptions: {
			bar: {
				horizontal: true
			}
		},
		series: [
			{
				data: data
			}
		],
		xaxis: {
			categories: fields
		}
	}
	
	// create the chart
	let chart = new ApexCharts(document.querySelector('.dashboard'), options)
	chart.render()
}




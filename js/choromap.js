// Global variables
let choromap;
let chorolat = 34.0900;
let chorolon = -118.3617;
let chorozl = 10;

let choroPath = 'data/choropleth_years.json'; //where the geojson file is located
let chorogeojsonPath = 'data/la_county.geojson';

let count_data;
let years_data;

let chorogeojson_data; //placeholder for data
let chorogeojson_layer; //placeholder for layer of geojson

let brew = new classyBrew();
let chorofieldtomap;

let legend = L.control({position: 'topleft'});
let info_panel = L.control({position:'topleft'});

// initialize
$( document ).ready(function() {
    createChoroMap(chorolat,chorolon,chorozl);
    getJSON();
	getChoroGeoJSON();
});

// create the map
function createChoroMap(lat,lon,zl){
	choromap = L.map('choromap').setView([chorolat,chorolon], chorozl);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(choromap);
}

// function to get the choropleth data
function getJSON(){

	$.getJSON(choroPath,function(data){
		console.log(data)

		// put the data in a global variable
		count_data = data;

	})
}

// function to get the geojson data
function getChoroGeoJSON(){

	$.getJSON(chorogeojsonPath,function(data){
		console.log(data);

		// put the data in a global variable
		chorogeojson_data = data;

        //add count to geojson data
        let counties = []; 
        count_data.forEach(function(item){counties.push(item["County"])});
        for(let i = 0; i < chorogeojson_data.features.length; i++) {
            let key = counties.indexOf(chorogeojson_data.features[i]["properties"]["name"]);
            //console.log(geojson_data.features[i]["properties"]["name"]);
            //console.log(key);
            if (key == -1){
                chorogeojson_data.features[i]["properties"]["count"] = 0;
            } else{
                chorogeojson_data.features[i]["properties"]["count"] = count_data[key]["count"];
				chorogeojson_data.features[i]["properties"]["years"] = count_data[key]["years"];
				chorogeojson_data.features[i]["properties"]["artCountperYear"] = count_data[key]["artCountperYear"];
            }
        }

		// call the map function
		mapChoroGeoJSON('count') // add a field to be used
	})
}

// function to map a geojson file
function mapChoroGeoJSON(field /*, num_class, etc....*/){

	// clear layers in case it has been mapped already
	if (chorogeojson_layer){
		chorogeojson_layer.clearLayers()
	}
	
	// globalize the field to map
	chorofieldtomap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	chorogeojson_data.features.forEach(function(item,index){
		values.push(item.properties[field])
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(8);
	brew.setColorCode('YlGnBu');
	brew.classify('quantiles');

    // create the geojson layer
    chorogeojson_layer = L.geoJson(chorogeojson_data,{
        style: getChoroStyle,
        onEachFeature: onEachChoroFeature // actions on each feature
    }).addTo(choromap);

    // create the legend. function is created towards bottom of code
	createLegend();

    // create the infopanel
	createInfoPanel(); //(not create legend as in the lab)
}

function getChoroStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties[chorofieldtomap]),
		fillOpacity: 0.9
	}
}

function createLegend(){
	legend.onAdd = function (choromap) {
        //creates the html div that holds the info for legend
		var div = L.DomUtil.create('div', 'info legend'),
        //brew info that gets put into legend
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
                    //the numbers that are actually put into the legend
					'<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			div.innerHTML = labels.join('<br>');
			return div;
		};
		legend.addTo(choromap);
}

// Function that defines what will happen on user interactions with each feature
function onEachChoroFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var chorolayer = e.target;

	// style to use on mouse over
	chorolayer.setStyle({
        weight: 3,
		color: '#3b3b3b',
		fillOpacity: 0.6
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		chorolayer.bringToFront();
	}
    //updates the infopanel
    info_panel.update(chorolayer.feature.properties)
    createDashboard(chorolayer.feature.properties);
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	chorogeojson_layer.resetStyle(e.target);
    info_panel.update(); // resets infopanel when not highlighted, to default
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	choromap.fitBounds(e.target.getBounds());
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
			this._div.innerHTML = `<b>${properties.name}</b><br>${chorofieldtomap}: ${properties[chorofieldtomap]}`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a neighborhood to get the count!';
		}
	};


	info_panel.addTo(choromap);
}

function createDashboard(properties){

	// clear dashboard
	$('.dashboard').empty();

	console.log(properties)

	// chart title
	let title = `${properties.name}'s Art Pieces by Decade`;

	// data values
	let data = properties['artCountperYear'];

	// data fields
	let fields = properties['years'];

	// set chart options
	let options = {
		chart: {
			type: 'bar',
			height: 300,
			animations: {
				enabled: true,
			},
			fontFamily: "'Nunito', sans-serif",
			foreColor: '#3b3b3b'
		},
		title: {
			text: title,
			style: {
				fontSize:  '20px',
				fontWeight:  'bold',
				fontFamily: "'Nunito', sans-serif",
				color:  '#3b3b3b',
				lineHeight: '36px',
			},
		},
		dataLabels: {
			enabled: true,
			enabledOnSeries: undefined,
			formatter: function (val, opts) {
				return val
			},
			textAnchor: 'middle',
			distributed: false,
			offsetX: 0,
			offsetY: 0,
			style: {
				fontSize: '14px',
				fontFamily: "'Nunito', sans-serif",
				fontWeight: 'bold',
				colors: ['#fff'],
				foreColor: '#000',
			},
			background: {
			  enabled: true,
			  foreColor: '#000',
			  color: '#fff',
			//   padding: 4,
			  borderRadius: 2,
			  borderWidth: 1,
			  borderColor: '#3b3b3b',
			  opacity: 0.5,
			  dropShadow: {
				enabled: false,
				top: 1,
				left: 1,
				blur: 1,
				color: '#000',
				opacity: 0.45
			  }
			},
			dropShadow: {
				enabled: false,
				top: 1,
				left: 1,
				blur: 1,
				color: '#000',
				opacity: 0.45
			}
		},
		plotOptions: {
			bar: {
				horizontal: false
			}
		},
		fill: {
			colors: ['#BFB41B'],
		},
		series: [
			{
				data: data
			}
		],
		xaxis: {
			categories: fields
		},
		
	}
	
	// create the chart
	let chart = new ApexCharts(document.querySelector('.dashboard'), options)
	chart.render()
}
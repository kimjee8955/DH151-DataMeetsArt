// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;

const path = "data/LAController.csv"
const path2 = 'A:/Schoolwork/DH151/Datart/data/Urban_Art.csv';

let markers = L.markerClusterGroup(); 
let befores = L.layerGroup();
let afters = L.layerGroup();

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
    readCSV(path);
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// Welcome message and instructions
	$('#sideContent').append(`
		<h2>Welcome</h2>
		<p>To get started, click on any pin and information about it will appear here!</p>
	`);
}

// function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);

			// map the data
			mapCSV(data);

		}
	});
}

function mapCSV(data){

    // circle options
	let circBefore = {
		radius: 5,
		weight: 1,
		color: 'white',
		fillColor: '#0460D9',
		fillOpacity: 1
	}
	let circAfter = {
		radius: 5,
		weight: 1,
		color: 'white',
		fillColor: '#F23847',
		fillOpacity: 1
	}

    data.data.forEach(function(item, index){	

		// Before 2000's layer 
		if(item.year < 2000){
			let marker = L.circleMarker([item.latitude, item.longitude],circBefore)
			.on('mouseover',function(){
				this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}" width=150px>`).openPopup()
			})
			.on('click',function(){
				let sideContent = document.getElementById('sideContent');
				sideContent.innerHTML = (
					`<h3> ${item.title} </h3>
					<img src="${item.thumbnail_url}" width=600px>
					<p><b>Artist(s):</b> ${item.artist_name}</p>
					<p><b>Year Created:</b> ${item.year}</p>
					<p><b>Address:</b> ${item.address}</p>`
				)
				//$('.sidebar').append(`${item.title}<br><img src="${item.thumbnail_url}" width=400px><br>`)
			})
			befores.addLayer(marker)
			markers.addLayer(marker)
		}
		else{ // after 2000's layer 
			let marker = L.circleMarker([item.latitude, item.longitude],circAfter)
			.on('mouseover',function(){
				this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}" width=150px>`).openPopup()
			})
			.on('click',function(){
				let sideContent = document.getElementById('sideContent');
				sideContent.innerHTML = (
					`<h3> ${item.title} </h3>
					<img src="${item.thumbnail_url}" width=600px>
					<p><b>Artist(s):</b> ${item.artist_name}</p>
					<p><b>Year Created:</b> ${item.year}</p>
					<p><b>Address:</b> ${item.address}</p>`
				)
			})
			afters.addLayer(marker)
			markers.addLayer(marker)
		}

    })

	//add layers to map
	befores.addTo(map);
	afters.addTo(map);

    map.fitBounds(markers.getBounds());

	//add button on map for default view
	L.easyButton('fa-globe', function(btn,map){
		map.fitBounds(markers.getBounds());
}, 		'default view').addTo(map);	

	let addedlayers = {
        "Before 2000": befores,
		"2000 ~": afters,
		"Clustered": markers
	}

	// add layer control box. 
	L.control.layers(null,addedlayers).addTo(map);

	// StreetView
    L.streetView({ position: 'topleft'}).addTo(map);
    // Add a marker to the centre of the map
    var marker = L.marker(map.getCenter(),{draggable:true,autoPan:true}).addTo(map);

	//Randomize
	L.easyButton('<i class="fas fa-dice"></i>', function(btn,map){
		map.fitBounds(markers.getBounds());
}, 		'Surprise Me').addTo(map);	
}

/*function panToImage(index,year,marker){
	// zoom to level 17 first
	map.setZoom(17);
	// pan to the marker
	if(year < 2000){
		map.panTo(befores.getLayers()[index]._latlng);
		marker.openPopup();
	}
	else{
		map.panTo(afters.getLayers()[index]._latlng);
		marker.openPopup();
	}
}*/

const fs = require('fs');
const csv = require('fast-csv');

function csvToJSON(path, path2, arr, callback) { // <---- callback is a pointer to the function being passed in
	// this creates a stream of bytes (dont worry too much about it, but essentially, every single file is basically bytes, just formatted differently and parsed differently)
	const stream = fs.createReadStream(path);
	// parse stream is from the bytes read from the file (given the path)
	// since there are many many many bytes in a file, that's why it's called stream, think of movie streaming, you cant just watch it all at once
	csv.parseStream(stream, { headers: true })
		.on('data', line => arr.push(line))

	// i stream the bytes twice
	const stream2 = fs.createReadStream(path2);

	// csv.parseStream basically helps you parse the CSV based on the columns given on the first line, such as lat,long,dataset, etc...
	csv.parseStream(stream2, { headers: true })
		// on data is something called function chaining, dont worry too much about this either
		// but as data gets parsed and arrives, it's basically being parsed in the format of lat,long,dataset, etc...
		// and then it's being stored as an object as you can see on the terminal, and that's basically 1 line, 1 object
		// this probably more intuitive for you?yeah
		.on('data', line => arr.push(line))
		// once we are done, there's an event called end
		// that's why we call the callback
		// when you pass in printTheResults function, it's being passed in as reference
		// since callback (aka the function being passed in) is a pointer, we activate the function using () oki got this ok yeah it should work now and you can uncomment evertyhing and do what you gotta do
		// just pass in the callback of the next function you want to do, okay thanks gary okay ima hop off your remtoeoki
		.on('end', () => callback())
}

const urbanArtCSV = [];

function printTheResults() {
	// console.log(urbanArtCSV)
	console.log('youre in callback')
}

// so this function uses 4 arguments
// just pass in the paths you want to parse ok got this part
// the last argument is a callback function -> the function you want to run after everything is parsed
// you want to pass in the array you want to store the results in , aka urbanArtCSV
csvToJSON(path, path2, urbanArtCSV, printTheResults);

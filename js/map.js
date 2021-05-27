// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/Urban_Art.csv";
let markLat;let markLong;
// let path2 = "data/LAController.csv";
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

// parsing csv to json
let urbanArtCSV;

Papa.parse(path, {
	header: true,
	download: true,
	dynamicTyping: true,
	complete: function(results) {
		console.log(results);
		urbanArtCSV = results.data;
	}
});


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
				markLat = item.latitude; markLong = item.longitude;
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
				markLat = item.latitude; markLong = item.longitude;
			})
			afters.addLayer(marker)
			markers.addLayer(marker)
		}
	
    })
	//add google street view button
	$('.sidebar').append(`<div class = "sidebar-item" onclick = "GSV(${markLat},${markLong})">Street View</div>`);
	
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

	//Randomize
	L.easyButton('<i class="fas fa-dice"></i>', function(){

		//randomize csv data into 1 variable 
		let randData1 = urbanArtCSV[Math.floor(Math.random() * urbanArtCSV.length)];

		//display on sidebar
		let sideContent = document.getElementById('sideContent');
		sideContent.innerHTML = (
			`<h3> ${randData1.title} </h3>
			<img src="${randData1.thumbnail_url}" alt="${randData1.title}" width=600px>
			<p><b>Artist(s):</b> ${randData1.artist_name}</p>
			<p><b>Year Created:</b> ${randData1.year}</p>
			<p><b>Address:</b> ${randData1.address}</p>`
		);

		let rando_pop = L.popup().setContent(`${randData1.title}<br><img src="${randData1.thumbnail_url}" width=150px>`);
		rando_pop.setLatLng([randData1.latitude, randData1.longitude]).openOn(map);

}, 		'Surprise Me').addTo(map);	


	// StreetView
    //L.streetView({ position: 'topleft'}).addTo(map);
    // Add a marker to the centre of the map
    //var marker = L.marker(map.getCenter(),{draggable:true,autoPan:true}).addTo(map);

}

//Open Google Street View 
function GSV(latitude,longitude){
	let url = 'https://www.google.com/maps?layer=c&cbll='+markLat+','+markLong;
	console.log(url);
	window.open(url);
}

// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/Urban_Art.csv";
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
		color: '#FBF9EF',
		fillColor: '#0460D9',
		fillOpacity: 1
	}
	let circAfter = {
		radius: 5,
		weight: 1,
		color: '#FBF9EF',
		fillColor: '#F23847',
		fillOpacity: 1
	}
	let circHover = {
		radius: 8,
		weight: 2,
		color: '#7ECFB3',
		fillColor: '#FFF687',
		fillOpacity: 1
	}

    data.data.forEach(function(item, index){	

		// Before 2000's layer 
		if(item.year < 2000){
			let marker = L.circleMarker([item.latitude, item.longitude],circBefore)
			.on('mouseover',function(){
				let sideContent = document.getElementById('sideContent');
				sideContent.innerHTML = (
					`<h3> ${item.title} </h3>
					<img src="${item.thumbnail_url}" width=400px height=170px>
					<p><b>Artist(s):</b> ${item.artist_name}</p>
					<p><b>Year Created:</b> ${item.year}</p>
					<p><b>Address:</b> ${item.address}</p>
					<div class = "sidebar-item" onclick = "GSV(${item.latitude},${item.longitude})">Current Street View</div>`
				);
				marker.setStyle(circHover);
			})
			.on('mouseout',function(){
				marker.setStyle(circBefore)
			})
			.on('click',function(){
				let sideContent = document.getElementById('sideContent');
				sideContent.innerHTML = (
					`<h3> ${item.title} </h3>
					<img src="${item.thumbnail_url}" width=400px height=170px>
					<p><b>Artist(s):</b> ${item.artist_name}</p>
					<p><b>Year Created:</b> ${item.year}</p>
					<p><b>Address:</b> ${item.address}</p>
					<div class = "sidebar-item" onclick = "GSV(${item.latitude},${item.longitude})">Current Street View</div>`
				)
			})
			befores.addLayer(marker)
			markers.addLayer(marker)
		}
		else{ // after 2000's layer 
			let marker = L.circleMarker([item.latitude, item.longitude],circAfter)
			.on('mouseover',function(){
				let sideContent = document.getElementById('sideContent');
				sideContent.innerHTML = (
					`<h3> ${item.title} </h3>
					<img src="${item.thumbnail_url}" width=400px height=170px>
					<p><b>Artist(s):</b> ${item.artist_name}</p>
					<p><b>Year Created:</b> ${item.year}</p>
					<p><b>Address:</b> ${item.address}</p>
					<div class = "sidebar-item" onclick = "GSV(${item.latitude},${item.longitude})">Current Street View</div>`
				);
				marker.setStyle(circHover);
			}) 
			.on('mouseout',function(){
				marker.setStyle(circAfter)
			})
			.on('click',function(){
				let sideContent = document.getElementById('sideContent');
				sideContent.innerHTML = (
					`<h3> ${item.title} </h3>
					<img src="${item.thumbnail_url}" width=400px height=170px>
					<p><b>Artist(s):</b> ${item.artist_name}</p>
					<p><b>Year Created:</b> ${item.year}</p>
					<p><b>Address:</b> ${item.address}</p>
					<div class = "sidebar-item" onclick = "GSV(${item.latitude},${item.longitude})">Current Street View</div>`
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

	// add layer control box. (open by default)
	L.control.layers(null,addedlayers,{collapsed:false}).addTo(map);

	//Randomize
	L.easyButton('<i class="fas fa-dice"></i>', function(){

		//randomize csv data into 1 variable 
		let randData1 = urbanArtCSV[Math.floor(Math.random() * urbanArtCSV.length)];

		//display on sidebar
		let sideContent = document.getElementById('sideContent');
		sideContent.innerHTML = (
			`<h3> ${randData1.title} </h3>
			<img src="${randData1.thumbnail_url}" alt="${randData1.title}" width=400px height=170px>
			<p><b>Artist(s):</b> ${randData1.artist_name}</p>
			<p><b>Year Created:</b> ${randData1.year}</p>
			<p><b>Address:</b> ${randData1.address}</p>
			<div class = "sidebar-item" onclick = "GSV(${randData1.latitude},${randData1.longitude})">Current Street View</div>`
		);

		// add a marker to the map
		let randomarker = L.circleMarker([randData1.latitude,randData1.longitude],circHover);
		setTimeout(function(){
			randomarker.remove(map);
		}, 1000);
		
		randomarker.addTo(map);
		map.setView([randData1.latitude,randData1.longitude], 12);
		
		

		
		
}, 		'Surprise Me').addTo(map);	
}

//Open Google Street View 
function GSV(latitude,longitude){
	let url = 'https://www.google.com/maps?layer=c&cbll='+latitude+','+longitude;
	console.log(url);
	window.open(url);
}

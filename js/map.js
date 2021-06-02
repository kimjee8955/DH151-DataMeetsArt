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
// parsing csv to json
let urbanArtCSV;

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
			urbanArtCSV = data.data;
			// map the data
			mapCSV(urbanArtCSV);

		}
	});
};


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

    urbanArtCSV.forEach(function(item, index){	

		// Before 2000's layer 
		if(item.year < 2000){
			let marker = L.circleMarker([item.latitude, item.longitude],circBefore)
			.on('mouseover',function(){
				populatePanel(item);
				marker.setStyle(circHover);
			})
			.on('mouseout',function(){
				marker.setStyle(circBefore)
			})
			.on('click',function(){
				populatePanel(item);
			})
			befores.addLayer(marker)
			markers.addLayer(marker)
		}
		else{ // after 2000's layer 
			let marker = L.circleMarker([item.latitude, item.longitude],circAfter)
			.on('mouseover',function(){
				populatePanel(item);
				marker.setStyle(circHover);
			}) 
			.on('mouseout',function(){
				marker.setStyle(circAfter)
			})
			.on('click',function(){
				populatePanel(item);
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
		populatePanel(randData1);

		// add a marker to the map
		let randomarker = L.circleMarker([randData1.latitude,randData1.longitude],circHover);
		setTimeout(function(){
			randomarker.remove(map);
		}, 1000);
		
		randomarker.addTo(map);
		map.setView([randData1.latitude,randData1.longitude], 15);
		
		

		
		
}, 		'Surprise Me').addTo(map);	
}

//Open Google Street View 
function GSV(latitude,longitude){
	let url = 'https://www.google.com/maps?layer=c&cbll='+latitude+','+longitude;
	console.log(url);
	window.open(url);
}

//Zoom to art by ID
function zoomToArt(id){
    // find the art by id
    filtered = urbanArtCSV.filter(item => item.artID === String(id))[0];
	console.log(filtered);
    // zoom
	map.setView([filtered.latitude,filtered.longitude], 15);
	//populate panel
	populatePanel(filtered);
}

//populate the side panel
function populatePanel(inputData){
	let sideContent = document.getElementById('sideContent');
	sideContent.innerHTML = (
		`<h3> ${inputData.title} </h3>
		<img src="${inputData.thumbnail_url}" alt="${inputData.title}" width=600px>
		<p><b>Artist(s):</b> ${inputData.artist_name}</p>
		<p><b>Year Created:</b> ${inputData.year}</p>
		<p><b>Address:</b> ${inputData.address}</p>
		<div class = "sidebar-item" onclick = "GSV(${inputData.latitude},${inputData.longitude})">Current Street View</div>`
	);	
}

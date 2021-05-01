// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/art_loc.csv";
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

		if(item.year < 2000){
			let marker = L.circleMarker([item.latitude, item.longitude],circBefore)
			.on('mouseover',function(){
				this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}">`).openPopup()
			})
			.on('click',function(){
				$('.sidebar').append(`${item.title}<br><img src="${item.thumbnail_url}" width=400px><br>`)
			})
			befores.addLayer(marker)
			markers.addLayer(marker)
		}
		else{
			let marker = L.circleMarker([item.latitude, item.longitude],circAfter)
			.on('mouseover',function(){
				this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}">`).openPopup()
			})
			.on('click',function(){
				$('.sidebar').append(`${item.title}<br><img src="${item.thumbnail_url}" width=400px><br>`)
			})
			afters.addLayer(marker)
			markers.addLayer(marker)
		}
	
    })
	
	//add layers to map
	befores.addTo(map);
	afters.addTo(map);

    map.fitBounds(markers.getBounds());


	let addedlayers = {
        "Before 2000": befores,
		"2000 ~": afters,
		"Clustered": markers
	}

	// add layer control box. 
	L.control.layers(null,addedlayers).addTo(map);

}

function panToImage(index,year,marker){
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
}


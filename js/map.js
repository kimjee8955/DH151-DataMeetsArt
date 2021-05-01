// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/art_loc.csv";
let befores = L.featureGroup();
let afters = L.featureGroup();

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
			let before2000 = L.circleMarker([item.latitude, 
				item.longitude], circBefore)
			.on('mouseover',function(){
				this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}">`).openPopup()
			})
			.on('click',function(){
				$('.sidebar').append(`${item.title}<br><img src="${item.thumbnail_url}" width=400px><br>`)
			})
		
			befores.addLayer(before2000)
			//$('.sidebar').append(`${item.title}<br><img src="${item.thumbnail_url}" width=400px onmouseover="panToImage(${index},${item.year},${before2000})"><br><br>`)
		}
		else{
			let after2000 = L.circleMarker([item.latitude, 
				item.longitude], circAfter)
			.on('mouseover',function(){
				this.bindPopup(`${item.title}<br><img src="${item.thumbnail_url}">`).openPopup()
			})
			.on('click',function(){
				$('.sidebar').append(`${item.title}<br><img src="${item.thumbnail_url}" width=400px><br>`)
			})
		
			afters.addLayer(after2000)
			//$('.sidebar').append(`${item.title}<br><img src="${item.thumbnail_url}" width=400px onmouseover="panToImage(${index},${item.year},${after2000})"><br><br>`)
		}
    })

    befores.addTo(map);
	afters.addTo(map);

    map.fitBounds(afters.getBounds());

	let addedlayers = {
        "Before 2000": befores,
        "2000 ~": afters
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


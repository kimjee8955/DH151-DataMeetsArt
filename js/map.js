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
	let circleOptions = {
		radius: 5,
		weight: 1,
		color: 'white',
		fillColor: 'dodgerblue',
		fillOpacity: 1
	}

    data.data.forEach(function(item, index){
        if(item.year < 2000){
			let before2000 = L.circleMarker([item.latitude, 
				item.longitude], circleOptions)
			.on('mouseover',function(){
				this.bindPopup(`${item.title}<br><img 
				src="${item.thumbnail_url}">`).openPopup()
			})
		
			befores.addLayer(before2000)
		}
		else{
			let after2000 = L.circleMarker([item.latitude, 
				item.longitude], circleOptions)
			.on('mouseover',function(){
				this.bindPopup(`${item.title}<br><img 
				src="${item.thumbnail_url}">`).openPopup()
			})
		
			afters.addLayer(after2000)
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


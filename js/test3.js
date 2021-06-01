// Global variables
let choromap;
let lat2 = 0;
let lon2 = 0;
let zl2 = 3;
let path2 = '';
let markers2 = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap2(lat2,lon2,zl2);
	readCSV(path2);
});

// create the map
function createMap2(lat,lon,zl){
	choromap = L.map('choromap').setView([lat2,lon2], zl2);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(choromap);
}

// function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(csvdata) {
			console.log(csvdata);
			
		}
	});
}

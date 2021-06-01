// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/Urban_Art.csv";
let markers = L.featureGroup();

// initialize
$( document ).ready(function() {
	readCSV(path);
});

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

// function to display image and metadata
function mapCSV(data){
    
	// loop through each entry
	data.data.forEach(function(item,index){
		// add entry to sidebar
        $('.sidebar').append(` 
            <div style="display: inline-block" class="img__wrap">
                <img class="img__img" src="${item.thumbnail_url}" width=300px height=330px/>
                <div class="img__description_layer">
                    <p class="img__description"><b>Title:</b> ${item.title}<br><b>Artist(s):</b> ${item.artist_name}<br><b>County:</b> ${item.County}<br><b>Year:</b> ${item.year}<br></p>
                </div>
        </div>`)
	})
    

}


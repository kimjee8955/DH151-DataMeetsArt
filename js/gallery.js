// Global variables
let path = "data/Urban_Art.csv";
let neighbor = [];
let json_data;
let query; 
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
			json_data = data;
			
			// display the data
			displayCSV(data);
		}
	});
}

// function to display image and metadata
function displayCSV(){
    
	// loop through each entry
	json_data.data.forEach(function(item,index){
		// add entry to sidebar
        $('.sidebar').append(` 
            <div style="display: inline-block" class="img__wrap">
                <img class="img__img" src="${item.thumbnail_url}" width=300px height=330px/>
                <div class="img__description_layer">
                    <p class="img__description"><b>Title:</b> ${item.title}<br><b>Artist(s):</b> ${item.artist_name}<br><b>Neighborhood:</b> ${item.County}<br><b>Year:</b> ${item.year}<br></p>
                </div>
        </div>`)
		// make an array of neighborhood and thumnail_url
		neighbor.push(item.County);
	})
    

}

function filterArt(){
	const textBox = document.getElementById('searchBar');
	query = textBox.value;
	console.log(query);
    //Check if null or whitespace or empty search query
    if(!query || query.length === 0 || /^\s*$/.test(query)) {
		$('.sidebar').replaceWith(`<p style="text-align:center">Please enter a valid neighborhood.</p>`);
		return;
    }else if(neighbor.includes(query)){
		console.log("filtering...");
		$('.sidebar').empty();
		//filter data
		filtered_data = json_data.data.filter(item => item.County === query);
		filtered_data.forEach(function(item,index){
			// add entry to sidebar
			$('.sidebar').append(` 
				<div style="display: inline-block" class="img__wrap">
					<img class="img__img" src="${item.thumbnail_url}" width=300px height=330px/>
					<div class="img__description_layer">
						<p class="img__description"><b>Title:</b> ${item.title}<br><b>Artist(s):</b> ${item.artist_name}<br><b>Neighborhood:</b> ${item.County}<br><b>Year:</b> ${item.year}<br></p>
					</div>
			</div>`);
		});
	}
	
	
}


// Global variables
let path = "data/Urban_Art.csv";
let neighbor = [];
let json_data;
let query; let lowerQuery;
const searchBar = document.getElementById('searchBar');
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
            <div style="display: inline-block" class="img__wrap" onclick="redirect('${item.thumbnail_url}')">
                <img class="img__img" src="${item.thumbnail_url}" width=300px height=330px/>
                <div class="img__description_layer">
                    <p class="img__description"><b>Title:</b> ${item.title}<br><b>Artist(s):</b> ${item.artist_name}<br><b>Neighborhood:</b> ${item.County}<br><b>Year:</b> ${item.year}<br></p>
                </div>
        </div>`)
		// make an array of neighborhood 
		neighbor.push(item.County.toLowerCase());
	})
    

}

//filter art by neighborhood
function filterArt(){
	query = searchBar.value;
	lowerQuery = query.toLowerCase();
    //Check if null or whitespace or empty search query
    if(!query || query.length === 0 || /^\s*$/.test(query)) {
		$('.sidebar').replaceWith(`<p style="text-align:center">Please enter a valid neighborhood.</p>`);
    }else if(neighbor.includes(lowerQuery)){
		console.log("filtering...");
		$('.sidebar').empty();
		//filter data
		filtered_data = json_data.data.filter(item => item.County.toLowerCase() === lowerQuery);
		filtered_data.forEach(function(item,index){
			// add entry to sidebar
			$('.sidebar').append(` 
				<div style="display: inline-block" class="img__wrap" onclick="redirect('${item.thumbnail_url}')">
					<img class="img__img" src="${item.thumbnail_url}" width=300px height=330px/>
					<div class="img__description_layer">
						<p class="img__description"><b>Title:</b> ${item.title}<br><b>Artist(s):</b> ${item.artist_name}<br><b>Neighborhood:</b> ${item.County}<br><b>Year:</b> ${item.year}<br></p>
					</div>
			</div>`);
		});
	}	
};

//filter art when user presses enter also
searchBar.addEventListener("keyup", e => {
	if(e.which==13){
		filterArt();
	}
});

//redirect to mapping page when photo clicked
function redirect(url){
	console.log(url);
	//location.href = "/index.html"
	//window.open("/index.html");

	//let pop_up = L.popup.setContent("here!");
	//pop_up.setLatLng([]).openOn(map);

}


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
            <div style="display: inline-block" class="img__wrap" onclick="redirect('${item.artID}')">
                <img class="img__img" src="${item.thumbnail_url}" width=300px height=330px/>
                <div class="img__description_layer">
                    <p class="img__description"><b>Title:</b> ${item.title}<br><b>Artist(s):</b> ${item.artist_name}<br><b>Neighborhood:</b> ${item.County}<br><b>Year:</b> ${item.year}<br></p>
                </div>
        </div>`);
	});
    

}

//filter art by neighborhood
function filterArt(){
	query = searchBar.value;
	lowerQuery = query.toLowerCase();
    //Check if null or whitespace or empty search query
    if(!query || query.length === 0 || /^\s*$/.test(query)) {
		$('.sidebar').empty();
		$('.sidebar').append(`<p style="text-align:center">Please enter a valid neighborhood.</p>`);
		return; //end function if empty search

	};
	//filter data
	filtered_data = json_data.data.filter(item => item.County.toLowerCase().includes(lowerQuery));
	if(filtered_data.length!=0){
		$('.sidebar').empty();
		filtered_data.forEach(function(item,index){
			// add entry to sidebar
			$('.sidebar').append(` 
				<div style="display: inline-block" class="img__wrap" onclick="redirect('${item.artID}')">
					<img class="img__img" src="${item.thumbnail_url}" width=300px height=330px/>
					<div class="img__description_layer">
						<p class="img__description"><b>Title:</b> ${item.title}<br><b>Artist(s):</b> ${item.artist_name}<br><b>Neighborhood:</b> ${item.County}<br><b>Year:</b> ${item.year}<br></p>
					</div>
			</div>`);
		});
	}else if(filtered_data.length==0){
		$('.sidebar').empty();
		$('.sidebar').append(`<p style="text-align:center">Our data does not have art from ${query}.</p>`)	
	}
};

//filter art when user presses enter also
searchBar.addEventListener("keyup", e => {
	if(e.which==13){
		filterArt();
	}
});

//redirect to mapping page when photo clicked
function redirect(ID){
	let link = "/Datart/index.html#mainmapSection";
	//window.location.href = "/Datart/index.html#mainmapSection"
	window.open(link);
	//console.log(link);
	// Set the variable
	localStorage.setItem( 'artID',ID);
}

// scroll back to top arrow
$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});
$(document).ready(function() {
    $("#back2Top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

});
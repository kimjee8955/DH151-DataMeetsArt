# Datart
## Introduction:
We are Datart. We will be mapping the public art around the Los Angeles County. Although Los Angeles is known to be a culturally rich city, not many people know about the art that surrounds them. We hope to create a website that bring awareness to users about the diverse arts and culture that encompasses Los Angeles.
## Team members:
<table>
  <tr>
    <th>Annmarie Cong</th>
    <th>Eustina Kim</th> 
    <th>Michelle Lee</th>
  </tr>
  <tr>
    <td><img src="https://media.discordapp.net/attachments/694477786131202048/829939480735645737/image0.jpg" alt = "avatar_Annmarie" width="250"/></td>
    <td><img src="https://github.com/kimjee8955/DH151-Datart/blob/main/images/profile_Eustina.JPG" alt = "pic_Eustina" width="250"/></td>
    <td><img src="https://user-images.githubusercontent.com/56007288/114282980-28c8f900-99fc-11eb-887e-d67a16ef429e.png" alt = "avatar_Michelle" width="250"/></td>
  </tr>
  <tr>
    <td><b>UX Designer</b></td>
    <td><b>Map Specialist</b></td>
    <td><b>Data Specialist</b></td>
  </tr>
  <tr>
    <td>Annmarie is a fourth year Cognitive Science major specializing in Computing and minoring in Digital Humanities. She has experience in UX, and will be reponsible 
    to make the site as user-friendly as possible.</td>
    <td>Eustina is a fourth year Statistics major and Digital Humanities minor. For this project, she will be helping with coding interactive maps and doing data analysis.</td>
    <td>Michelle is a third year Statistics major and Digital Humanities minor. She has experience with data analysis and visualization. For this project, she will help with data preprocessing and providing insights/ideas to build the project.</td>
</table> 

## Overview:
Public art installations are important to promote a community's identity and culture, as well as help to acknowledge the work of local artists. Our website Datart aims to visualize public art installations through mapping. Compiling three datasets of spatial data and metadata of different public art installations, we were able to illustrate the location, title, artist name, year, and image for each art piece. Specifically, we chose to focus on the Los Angeles County because as students at UCLA, we are interested in exploring more of the art/culture that surrounds the area.  Our website will serve as a guide that helps users discover the richness of LA's culture that surrounds them, through mapping.

## Methodology:
Mapping is a great visualization method of location-based data. Given that we want to showcase public art around Los Angeles, we think web mapping will be a fun, interactive way for users to enjoy our content. Mapping has advantages over traditional charts and graphs in that it is extremely versatile in incorporating multi-dimensional data, including spatial and temporal variables. We hope this will allow users to get a deeper understanding of the significance of public art installations in relation to where they exist around LA.

Our workflow, data plan, and UX design sections below describes how we ideated and developed our website in more detail.

## Workflow:
<table>
  <tr>
    <th>Week</th>
    <th>Step/Phase</th> 
  </tr>
  <tr>
    <td>Week 2</td>
    <td>Complete Project Proposal</td>
  </tr>
  <tr>
    <td>Week 3</td>
    <td>Do background research/ Find Data</td>
  </tr>
  <tr>
    <td>Week 4</td>
    <td>Storyboard</td>
  </tr>
  <tr>
    <td>Week 5</td>
    <td>Prepare for Midterm Presentation (Clean Data/ 1st Draft of Mapping Website, develop presentation slides)</td>
  </tr> 
  <tr>
    <td>Week 6</td>
    <td>Update website based on feedback from the midterm presentation; Work on "Randomize" art button feature</td>
  </tr>
  <tr>
    <td>Week 7</td>
    <td>Add choropleth layer to the map</td>
  </tr>
  <tr>
    <td>Week 8</td>
    <td>Implement #Gallery wall to share art live via Twitter</td>
  </tr>
  <tr>
    <td>Week 9</td>
    <td>Add interactive time slider to enhance user experience on the map</td>
  </tr>
  <tr>
    <td>Week 10</td>
    <td>Incorporate interactive dashboard of metrics for the map; Prepare for final project submission</td>
  </tr>
</table> 

## Technical scope:
Git: sharing code between each other  
Leaflet: needed for generating the maproom 
HTML: publishing the map online  
Javascript: need to code in Javascript to work with Leaflet, increase interactivity  
CSS: stylize the page  
Figma: wireframing and planning UI/UX website and feature components

## Geographic scope: 
We will be focusing on the Los Angeles County because as students at UCLA, it is a relevant location of interest among us, and we are interested in exploring more of the art/culture that surrounds the area.

## Data Plan:
Dataset 1: [Nancy Tovar East LA Mural Collection](https://docs.google.com/spreadsheets/d/1evnaHh-HV6cwoFSC8Jy_wAuR9916uogwbV_4nGCjb-A/edit#gid=450383580)  
Dataset 2: [Urban Art Locations - City of West Hollywood](https://data.weho.org/Art/Urban-Art-Locations/twt6-v6gc)  
Dataset 3: [Robin Dunitz Slides of Los Angeles Murals, 1925-2002](https://raw.githubusercontent.com/yohman/21S-DH151/main/Weeks/Week04/Lab/data/dunitz.csv)

Our datasets will be downloaded as csv files from the links above. Each dataset has columns of latitude and longitude information for mapping location. Images of each art piece will be displayed on the pop up menu and sidebar, as well as the title, artist(s), and year, which were columns in our datasets. We used layers on the map to filter by year (blue = Before 2000, red = after 2000). Also, we incorpoated a "Clustered" feature as a map layer, which displayed visual groupings and count of art installations that were in close proximity. We hoped that by adding clusters, it would allow users to see "hot spots" of art and make for a more exciting experience using the site.

For next steps, we hope to add additional interactivty to our mapping website with a randomize art button, #Gallery art wall, chloropleth map layer, and time slider. 

## UX Design
### Our Initial Sketches
We first sketched out more coherently, after our mindmap and crazy8 discussion, of how the site would look like. After these 
sketches, we discussed about the main features we would need and the features we would like to have. 

<img src="https://media.discordapp.net/attachments/694477786131202048/835776462669348874/image_from_ios.png?width=881&height=661" alt="Ann's Sketch" width="750"/>

<img src="https://media.discordapp.net/attachments/694477786131202048/835776512547749928/image_from_ios.png?width=881&height=285" alt="Eustina's Sketch" width="750"/>

<img src="https://cdn.discordapp.com/attachments/694477786131202048/835778201619005440/unknown.png" alt="Michelle's Sketch" width="750"/>

### Wireframe Flow
This is the "site map" of our incoming site. It shows where each action of the user brings them. 

<img src="https://media.discordapp.net/attachments/694477786131202048/835774519406100480/Flow.png?width=1446&height=513" alt="Flow" width="1050"/>

### Wireframes + Annotations
<img src="https://media.discordapp.net/attachments/694477786131202048/835774613975728158/Home.png?width=951&height=676" alt="screen 1" width="750"/>
<ul>
  <li>Header of our site name</li>
  <li>Menu items include: About page, team page and gallery page</li>
  <li>Sidebar to display clicked items</li>
  <li>Map content</li>
  <li>Zoom functions</li>
  <li>Randomization function</li>
  <li>Layer filter of sites with images vs no images. </li>
</ul>
<hr>
<img src="https://media.discordapp.net/attachments/694477786131202048/835774581721530388/Home-Pin_clicked.png?width=951&height=676" alt="screen 2" width="750"/>
<ul>
  <li>This wireframe shows that when a marker is clicked on, the sidebar will display the information of the piece in this manner.</li>
</ul>
<hr>
<img src="https://media.discordapp.net/attachments/694477786131202048/836077068419858452/Team.png?width=951&height=676" alt="screen 2" width="750"/>
<ul>
  <li>Team page including our names, roles, and short description about ourselves.</li>
</ul>
<hr>
<img src="https://media.discordapp.net/attachments/694477786131202048/835774606333050931/About.png?width=951&height=676" alt="screen 2" width="750"/>
<ul>
  <li>About page which will include our process, overview of our project, and our data sources.</li>
</ul>
<hr>
<img src="https://media.discordapp.net/attachments/694477786131202048/835774608295591986/Gallery.png?width=951&height=676" alt="screen 3" width="750"/>
<ul>
  <li>Gallery page (we might include) will include all the relevant images paired with hashtags.</li>
</ul>

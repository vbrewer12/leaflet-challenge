// Create the map object with center and zoom options.
let map = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 5
});

// Create the 'basemap' tile layer that will be the background of our map.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map
let satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Tiles © Esri'
  }
);

street.addTo(map); 

// Then add the 'basemap' tile layer to the map.
let baseMaps = {
  "Street View": street,
  "Satellite View": satellite
};
// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.
L.control.layers(baseMaps).addTo(map);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    const depth = feature.geometry.coordinates[2];
    const magnitude = feature.properties.mag;
    return {
      opacity: 0.8,
      fillOpacity: 0.7,
      fillColor: getColor(depth),
      color: "black",
      radius: getRadius(magnitude),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth > 90) return "#ea2c2c";       
    else if (depth > 70) return "#ea822c";  
    else if (depth > 50) return "#ee9c00"; 
    else if (depth > 30) return "#eecc00";  
    else if (depth > 10) return "#d4ee00"; 
    else return "#98ee00";                  
  }
  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude > 7) return 45;
    else if (magnitude > 6) return 30;  
    else if (magnitude > 5) return 25; 
    else if (magnitude > 4) return 20;
    else if (magnitude > 2) return 15; 
    else return 10;  

  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng)
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        `<strong>Magnitude:</strong> ${feature.properties.mag}<br>
         <strong>Location:</strong> ${feature.properties.place}`
      );

    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
  
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
  
    div.innerHTML = `
      <div style="background: white; padding: 8px; display: flex;">
        <div style="
          width: 20px;
          height: 150px;
          background: linear-gradient(to top, ${colors.slice().reverse().join(',')});
          border: 1px solid #999;
          margin-right: 8px;">
        </div>
        <div id="legend-labels" style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 150px;
          font-size: 12px;">
        </div>
      </div>
    `;
  
    let labelDiv = div.querySelector("#legend-labels");
    for (let i = 0; i < depths.length; i++) {
      let span = document.createElement("span");
      span.textContent = `${depths[i]}–${depths[i + 1] ? depths[i + 1] : "+"}`;
      labelDiv.appendChild(span);
    }
  
    return div;
  };
  // Finally, add the legend to the map.
  
  legend.addTo(map); 

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.

  });
});
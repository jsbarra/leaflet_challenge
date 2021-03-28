
// Create map, set paramaters

var my_map = L.map("map", {
    center: [39.0723, -99.5142],
    zoom: 5
  });
  

  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(my_map);



var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(data) {
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: circle_color(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: circle_radius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Color based on magnitude

    function circle_colors(magnitude) {
        switch (true) {
            case magnitude > 5:
              return "#ed0909";
            case magnitude > 4:
              return "#ed6c09";
            case magnitude > 3:
              return "#eda909";
            case magnitude > 2:
              return "#fff41c";
            case magnitude > 1:
              return "#b7ff1c";
            default:
              return "#2cea94";
          }
        }


// Magnitude function

    function circle_radius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }
   
// GeoJSON layer

    L.geoJson(data, {
        pointToLayer: function(feature, lating) {
            return L.circleMaker(lating);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(my_map);

    //Create the legend

    var legend = L.control({
        position: "bottomright"
      });
    
      legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [0, 1, 2, 3, 4, 5]
        var labels = ['<strong> MAGNITUDE </strong>']
        var colors = [
            "#2cea94", 
            "#b7ff1c", 
            "#fff41c", 
            "#eda909",
            "#ed6c09", 
            "#ed0909"
        ];

    // Loop through colors and add to legend label
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += labels.push(
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+"));
      }
        return div;
    };

    legend.addTo(my_map);

});






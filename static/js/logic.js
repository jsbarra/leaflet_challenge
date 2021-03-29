
// Create map - define maps

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var my_map = L.map("map", {
    center: [39.0723, -99.5142],
    zoom: 5
  });
  
  lightmap.addTo(my_map);

// URL for query


var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Create functions : style of map, color of circle, radii of circles

d3.json(url, function(data) {
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: circle_color(feature.properties.mag),
            color: "#000000",
            radius: circle_radius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }


    function circle_color(magnitude) {
        switch (true) {
            case magnitude > 5:
              return "#ea2c2c";
            case magnitude > 4:
              return "#eaa92c";
            case magnitude > 3:
              return "#d5ea2c";
            case magnitude > 2:
              return "#92ea2cc";
            case magnitude > 1:
              return "#2ceabf";
            default:
              return "#2c99ea";
          }
        }



    function circle_radius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 4;
    }
   
// GeoJSON layer

    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMaker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr>" + "Magnitude: " + feature.properties.mag);
        }

    }).addTo(my_map);

    //Create the legend

    var legend = L.control({
        position: "bottomright"
      });
    
      legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [0, 1, 2, 3, 4, 5];
        var labels = ['<strong> MAGNITUDE </strong>']
        var colors = [
            "#2c99ea", 
            "#2ceabf", 
            "#92ea2c", 
            "#d5ea2c",
            "#eaa92c", 
            "#ea2c2c"
        ];

    // Loop through colors and add to label
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + grades[i] + 
        (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
        return div;

      };
        
    legend.addTo(my_map);

});






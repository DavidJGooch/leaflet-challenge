let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(url).then(data=>{
  createFeatures(data.features);
});

function createMap(earthquakesmap) {
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topomap
  };

  let overlayMaps = {
    earthquakesmap: earthquakesmap
  };

  let EarthMap = L.map("map", {
    center: [
      36.05, -120.71
    ],
    zoom: 4,
    layers: [streetmap, earthquakesmap]
  });
  
  let legend = L.control({
    position: 'bottomright'
  });
  
  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');
    let entry = ['90+', '70-90', '50-70', '30-50', '10-30', '-10-10']
    let colors = ['#FF0000', '#FF6400', '#f7bc00', '#f9f900', '#C1FF00', '#78FF00']
    let labels = [];
    let legendInfo = "<h3>Legend</h3>";
    div.innerHTML = legendInfo;
    entry.forEach(function(entry, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\">" + entry + "</li>");
    });
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  legend.addTo(EarthMap);
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(EarthMap);
}

function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p>
            <p>Magnitude: ${feature.properties.mag} </p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
  }

  function createMarkers(feature, layer) {
    markers = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
      color: depthColors(feature.geometry.coordinates[2]),
      fillColor: depthColors(feature.geometry.coordinates[2]),
      fillOpacity: 0.75,
      radius: feature.properties.mag * 30000
    });
    return markers;
  }

  let earthquakesmap = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createMarkers
  });

  createMap(earthquakesmap);
}

function depthColors(depth) {
  if (depth > 90) {
    return '#FF0000'
  } else if (depth > 70) {
    return '#FF6400'
  } else if (depth > 50) {
    return '#f7bc00'
  } else if (depth > 30) {
    return '#f9f900'
  } else if (depth > 10) {
    return '#C1FF00'
  } else {
    return '#78FF00'
  }
}
let url = '"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"'

d3.json(url).then(function (data) {
    createFeatures(data.features);
  });

  function createFeatures(earthquakeInfo) {
  let earthquakes = L.geoJSON(earthquakeInfo, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.magnitude * 2,
        fillColor: getColor(feature.geometry.cords[2]),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
    layer.bindPopup(`<h3>Magnitude: ${feature.properties.magnitude}<br>Depth: ${feature.geometry.cords[2]}</br></h4><hr><p>Time: ${Date(feature.properties.time)}</p><hr><p>Location: ${feature.properties.place}</p>`);
    }
  })
  createMap(earthquakes);
};

function getColor(d){
    return depth > 90 ? '#CD2400' :
             depth> 70  ? '#CD9500' :
             depth> 50  ? '#FFFB00' :
             depth> 30  ? '#B9FF00' :
             depth> 10   ? '#00FFC5' :
             depth> -10   ? '#00FFE4' :
                         '#008FFF';
  };
function createMap(bikeStations) {

    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let baseMaps = {
      "USA Map": Usamap
    };
   
    let overlayMaps = {
      "Earthquakes": Earthquakes
    };
  
    let map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,     
      layers: [Usamap, Earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }

  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (myMap) {
  
      const div = L.DomUtil.create('div', 'info legend');
      labels = ['<strong>Depth Ranges of Quake</strong>'],
      categories = [-10, 10, 30, 50, 70, 90];
      
      for (var i = 0; i < categories.length; i++) {
    
            div.innerHTML += 
            labels.push(
                        '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' + categories[i] +
            (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>' : '+'));
        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
  
        legend.addTo(myMap);
  
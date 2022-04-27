
    var locations = [];
    var busStops = [];
    
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-71.104081, 42.365554],
      zoom: 12.5
    });
    
    busStops[0] = new mapboxgl.Marker({
      color: "#D9BBF9"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    busStops[1] = new mapboxgl.Marker({
      color: "#CCA7A2"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    busStops[2] = new mapboxgl.Marker({
      color: "#AA9FB1"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    busStops[3] = new mapboxgl.Marker({
      color: "#7871AA"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    busStops[4] = new mapboxgl.Marker({
      color: "#4E5283"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    busStops[5] = new mapboxgl.Marker({
      color: "#B1E5F2"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    busStops[6] = new mapboxgl.Marker({
      color: "#CECECE"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    busStops[7] = new mapboxgl.Marker({
      color: "#E8E9F3"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    busStops[8] = new mapboxgl.Marker({
      color: "#45B69C"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    busStops[9] = new mapboxgl.Marker({
      color: "#D8DDEF"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    busStops[10] = new mapboxgl.Marker({
      color: "#FF6392"
    })
      .setLngLat([0, 0])
      .addTo(map);
    
    // get bus data + place it to empty markers (busStops)
    async function run() {
    
      const locations = await getBusLocations();
      console.log(new Date());
      locations.forEach((bus, i) => {
        let coordinates = [locations[i].attributes.longitude, locations[i].attributes.latitude];
        busStops[i].setLngLat(coordinates);
      });
      setTimeout(run, 15000);
    }
    
    async function getBusLocations() {
      const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
      const response = await fetch(url);
      const json = await response.json();
      return json.data;
    }

// This array contains the coordinates for all bus stops between MIT and Harvard
const busStops = [
    [-71.093729, 42.359244],
    [-71.094915, 42.360175],
    [-71.0958, 42.360698],
    [-71.099558, 42.362953],
    [-71.103476, 42.365248],
    [-71.106067, 42.366806],
    [-71.108717, 42.368355],
    [-71.110799, 42.369192],
    [-71.113095, 42.370218],
    [-71.115476, 42.372085],
    [-71.117585, 42.373016],
    [-71.118625, 42.374863],
  ];

window.onload = () => {
    addRoutes();
  };
  
  const drop = document.getElementById("target");
  const loadBtn = document.getElementById("loadBtn");
  const stopBtn = document.getElementById("stopBtn");
  const busNumInfo = document.getElementById("busesNumber");
  let markersArr = [];
  let timerId = null;
  
  //Mapbox Map load
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYW50aGdyaW0iLCJhIjoiY2wxZjhsbjZ5MDEyMzNjbXB6ZmE4azhjdiJ9.RcmW0_4ba6kv9lKlFgL5Rg";
  
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v10",
    center: [-71.104081, 42.365554],
    zoom: 11,
  });
  
  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          message: "Foo",
          iconSize: [60, 60],
        },
        geometry: {
          type: "Point",
          coordinates: [-66.324462, -16.024695],
        },
      },
      {
        type: "Feature",
        properties: {
          message: "Bar",
          iconSize: [50, 50],
        },
        geometry: {
          type: "Point",
          coordinates: [-61.21582, -15.971891],
        },
      },
      {
        type: "Feature",
        properties: {
          message: "Baz",
          iconSize: [40, 40],
        },
        geometry: {
          type: "Point",
          coordinates: [-63.292236, -18.281518],
        },
      },
    ],
  };
  
  //API Data Request
  const getData = async () => {
    const res = await fetch("https://api-v3.mbta.com/vehicles/");
    const busData = await res.json();
    return busData.data;
  };
  
  //Add all routes to the options. This function will be called on load
  const addRoutes = async () => {
    const data = await getData();
    const masterArr = [];
  
    for (let i = 0; i < data.length; i++) {
      masterArr.push(data[i].relationships.route.data.id);
    }
  
    const uniArr = [...new Set(masterArr)];
  
    for (route of uniArr) {
      const newOpt = document.createElement("option");
      newOpt.value = route;
      newOpt.innerText = route;
      drop.appendChild(newOpt);
    }
  };
  
  //Get the buses from the selected route only
  const filterData = async () => {
    const route = document.getElementById("target").value;
    const data = await getData();
  
    const filterData = data.filter(
      (dat) => dat.relationships.route.data.id === route
    );
  
    return filterData;
  };
  
  //Reset Map/Remove all markers and reset Markers Array
  const resetMap = () => {
    for (let i = 0; i < markersArr.length; i++) {
      markersArr[i].remove();
    }
    markersArr = [];
  };
  
  //Show markers in the bus position
  const getBuses = async () => {
    const targetArr = await filterData();
  
    for (let i = 0; i < targetArr.length; i++) {
      const el = document.createElement("div");
  
      for (const marker of geojson.features) {
        // Create a DOM element for each marker.
        const width = marker.properties.iconSize[0];
        const height = marker.properties.iconSize[1];
        el.className = "marker";
        el.style.backgroundImage = `url(images/bus.png)`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = "100%";
      }
  
      let marker = new mapboxgl.Marker(el);
  
      marker.setLngLat([
        targetArr[i].attributes.longitude,
        targetArr[i].attributes.latitude,
      ]);
  
      marker.addTo(map);
      markersArr.push(marker);
    }
  
    busNumInfo.innerText = `Number of available buses: ${markersArr.length}`;
  };
  
  //Move function will reset the current map. and will set a time out every 15 mins
  const move = () => {
    resetMap();
  
    timerId = setTimeout(() => {
      getBuses();
      move();
    }, 15000);
  };
  
  //Load Button will call the getBuses function and will trigger the move function if a route is selected
  loadBtn.addEventListener("click", () => {
    if (document.getElementById("target").value === "") {
      alert("Please select a route");
      return;
    }
    getBuses();
    move();
  });
  
  //Stop Button will stop the move time out function
  stopBtn.addEventListener("click", () => {
    clearTimeout(timerId);
  });

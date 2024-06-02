// define settings for mobile and desktop views
const settings = {
    mobile: {
        center: [-74.6, 39.9], // center coords for mobile view
        zoom: 8, // zoom level for mobile view
        mapStyle: 'mapbox://styles/mapbox/light-v11', // map style for mobile view
        layers: ['layer1', 'layer2'] // layers for mobile view
    },
    desktop: {
        center: [-74.6, 39.9], // center coords for desktop view
        zoom: 9, // zoom level for desktop view
        mapStyle: 'mapbox://styles/mapbox/light-v11', // map style for desktop view
        layers: ['layer1', 'layer2', 'layer3'] // layers for desktop view
    }
};

// check if we're on a desktop or mobile device
const isDesktop = window.innerWidth > 768;
const mapSettings = isDesktop ? settings.desktop : settings.mobile; // choose the right settings

mapboxgl.accessToken = v.map; // set your mapbox access token

// initialize the mapbox map with the selected settings
const map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v11', // use the right map style
    container: 'map', // html container id for the map
    center: mapSettings.center, // use the right center coords
    zoom: mapSettings.zoom // use the right zoom level
});

// url for the custom marker image
const customImage = 'https://daks2k3a4ib2z.cloudfront.net/660a58a6b576d554dffa2146/661ba828c790aef163e5e1f1_harper.png';

// define some locations with their coordinates
const locations = {
  'address1' : [39.9, -74.6],
  'address2' : [39.6, -74.4],
  'address3' : [39.4, -75.2],
  'address4' : [40.5, -74.7]
};

// when the map loads, run this code
map.on('load', () => {
    // try to load the custom marker image
    map.loadImage(customImage, (error, image) => {
        if (error) {
            // log an error message if the image doesn't load
            console.error('error loading image:', error);
        } else {
            // add the custom image to the map as a marker
            map.addImage('custom-marker', image);
        }

        // create a geojson object with the locations
        const geojson = {
            type: 'FeatureCollection',
            features: Object.keys(locations).map(address => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [locations[address][1], locations[address][0]] // coords in [longitude, latitude] format
                },
                properties: {
                    address: address // store the address as a property
                }
            }))
        };

        // add a geojson source to the map with the locations
        map.addSource('locations', {
            type: 'geojson',
            data: geojson
        });

        // add a layer to the map to use the image for the points
        map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'locations',
            layout: {
                'icon-image': error ? 'default-marker' : 'custom-marker', // use a default marker if the image didn't load
                'icon-size': 0.5, // set the size of the icon
                'icon-allow-overlap': true // allow icons to overlap
            }
        });
    });
});

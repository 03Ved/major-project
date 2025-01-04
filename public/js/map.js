mapboxgl.accessToken = mapToken;

// create a HTML element for each feature
const el = document.createElement('div');
el.className = 'marker';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker = new mapboxgl
.Marker(el)
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl
    .Popup({offset: 25})
    .setHTML(`<h4 style="color: #fe4e4d">${listing.location}, ${listing.country}</h4><p style="margin=0px">Exact location provided after booking</p>`))
.addTo(map);
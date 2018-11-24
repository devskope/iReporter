const recordForm = document.getElementById('add-edit--form');
const locationInput = document.getElementById('add-edit-location');
const coordDisplay = document.getElementById('add-edit-coords');
const locationReset = document.getElementById('coords-reset');

recordForm.addEventListener('submit', e => e.preventDefault());

const updateCoords = ({ lng, lat }) => {
  coordDisplay.value = `${lng()}, ${lat()}`;
  coordDisplay.hidden = false;
};

const resetLocationFields = () => {
  locationInput.value = '';
  coordDisplay.value = '';
  coordDisplay.hidden = true;
};

const liveUpdate = new google.maps.places.Autocomplete(locationInput);
liveUpdate.addListener('place_changed', () => {
  const location = liveUpdate.getPlace();
  if (location.geometry) {
    updateCoords(location.geometry.location);
  } else {
    alert(`Error: no geospatial coordinates availabe for "${location.name}"`);
  }
});

locationReset.addEventListener('click', () => resetLocationFields());

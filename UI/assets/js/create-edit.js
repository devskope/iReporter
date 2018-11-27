const recordForm = document.getElementById('add-edit--form');
const locationInput = document.getElementById('add-edit-location');
const coordDisplay = document.getElementById('add-edit-coords');
const locationReset = document.getElementById('coords-reset');
const mediaToggle = document.getElementById('add-edit-media-toggle');

recordForm.addEventListener('submit', e => e.preventDefault());

const getCoords = ({ lng, lat }) => `${lng()}, ${lat()}`;

const displayCoords = coordinateString => {
  coordDisplay.value = coordinateString;
  coordDisplay.hidden = false;
};

const liveUpdate = new google.maps.places.Autocomplete(locationInput);
liveUpdate.addListener('place_changed', () => {
  const location = liveUpdate.getPlace();
  if (location.geometry) {
    const coordinateString = getCoords(location.geometry.location);
    displayCoords(coordinateString);
  } else {
    alert(`Error: no geospatial coordinates availabe for "${location.name}"`);
  }
});

const resetLocationFields = () => {
  locationInput.value = '';
  coordDisplay.value = '';
  coordDisplay.hidden = true;
};
locationReset.addEventListener('click', () => resetLocationFields());

mediaToggle.addEventListener('change', () =>
  recordForm
    .querySelectorAll('.hidden')
    .forEach(element => element.classList.toggle('gone'))
);

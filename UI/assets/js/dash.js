const modals = document.querySelectorAll(
  '.modal-wrapper--admin, .modal-wrapper--dash, .modal-wrapper--user'
);
const openModal = document.querySelectorAll('.record__more-btn');
const closeModal = document.querySelectorAll('.detail-modal__close');
const btnsEditRecord = document.querySelectorAll('.detail-modal__edit');
const btnsCreateRecord = document.querySelectorAll(
  '.dashboard__sidebar-btn.new'
);
const btnsTodash = document.querySelectorAll('.dashboard__sidebar-btn.dash');
const locationInput = document.querySelector('.create-edit-form__location');
const coordDisplay = document.querySelector('.create-edit-form__geocodes');
const locationReset = document.querySelector(
  '.create-edit-form__location-reset'
);

/* Bind listeners to all modal toggles */
[...openModal, ...closeModal].forEach(element =>
  element.addEventListener('click', () =>
    modals.forEach(modal => (modal ? modal.classList.toggle('visible') : null))
  )
);

btnsCreateRecord.forEach(element =>
  element.addEventListener('click', () =>
    window.location.assign('new-record.html')
  )
);

btnsTodash.forEach(element =>
  element.addEventListener('click', () => window.location.assign('user.html'))
);

btnsEditRecord.forEach(element =>
  element.addEventListener('click', () =>
    window.location.assign('edit-record.html')
  )
);

const getCoords = ({ lng, lat }) => `${lng()},${lat()}`;

const displayCoords = coordinateString => {
  coordDisplay.textContent = coordinateString;
  coordDisplay.classList.remove('hidden');
};

const liveUpdate = new window.google.maps.places.Autocomplete(locationInput);
liveUpdate.addListener('place_changed', () => {
  const geoLocation = liveUpdate.getPlace();
  if (geoLocation.geometry) {
    const coordinateString = getCoords(geoLocation.geometry.location);
    displayCoords(coordinateString);
  } else {
    alert(
      `Error: no geospatial coordinates availabe for "${geoLocation.name}"`
    );
  }
});

const resetLocationFields = () => {
  locationInput.value = '';
  coordDisplay.value = '';
  coordDisplay.hidden = true;
};
locationReset.addEventListener('click', () => resetLocationFields());

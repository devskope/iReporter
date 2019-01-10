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
const statusFilterContainer = document.querySelector(
  '.dashboard__filter-categories'
);
const mobileFilterToggle = document.querySelector('.dashboard__filter-toggle');

const toggleMobileFilter = () => {
  statusFilterContainer.classList.toggle('active');
  mobileFilterToggle.classList.toggle('active');
};

const fieldsBelow = document.querySelectorAll(
  '.form-field--media, .btn--submit'
);

if (mobileFilterToggle)
  mobileFilterToggle.addEventListener('click', toggleMobileFilter);

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
  coordDisplay.hidden = false;
  coordDisplay.textContent = coordinateString;

  fieldsBelow.forEach(field => field.classList.add('pushdown'));

  coordDisplay.classList.remove('hidden');
};

if (window.google && locationInput) {
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
}

const resetLocationFields = () => {
  coordDisplay.hidden = true;
  coordDisplay.classList.add('hidden');

  fieldsBelow.forEach(field => field.classList.remove('pushdown'));

  coordDisplay.value = '';
  locationInput.value = '';
};

if (locationReset)
  locationReset.addEventListener('click', () => resetLocationFields());

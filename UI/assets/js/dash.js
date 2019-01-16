this.addEventListener('load', async () => {
  const dashboard = document.querySelector('.dashboard');

  const {
    authCheck,
    autoCompleteHook,
    createRecord,
    displayNotification,
    findMissingFields,
    getFeedNode,
    getLocationString,
    getStatCounters,
    initAsideListeners,
    initFilterListeners,
    loadingAnimation,
    logoutListener,
    missingFieldsMessage,
    notify,
    populateDashboardStats,
    populateDashboardFeed,
    resetLocationFields,
    responsiveNav,
    initUserWidget,
    syncState,
  } = window.IR_HELPERS;

  authCheck('login.html');
  responsiveNav();
  notify();
  logoutListener();

  const { classList } = dashboard;

  const generalDash = dashboard && classList.contains('dashboard--users');
  const profileDash =
    dashboard && classList.contains('dashboard--user-profile');
  const recordCreationDash =
    dashboard && dashboard.querySelector('.create-edit-form--create');

  const state = {
    detailmodalOpened: false,
    feedLoading: false,
    feedLoadSuccess: false,
    profileFeed: false,
    statusFilter: null,
    typeFilter: null,

    set loadingFeed(setTo) {
      if (setTo) {
        this.feedLoading = true;
        loadingAnimation({ show: true });
      } else {
        this.feedLoading = false;
        loadingAnimation({ show: false });
      }
    },
    set feedLoaded(setTo) {
      if (setTo) {
        this.feedLoadSuccess = true;
        this.feedLoading = false;
        loadingAnimation({ show: false });
      } else {
        this.feedLoadSuccess = false;
        loadingAnimation({ show: true });
      }
    },
  };

  if (generalDash) {
    initAsideListeners(dashboard);

    await populateDashboardStats({
      widgetList: getStatCounters(dashboard),
    });

    await populateDashboardFeed({
      feedNode: getFeedNode(dashboard),
      state,
    });

    initFilterListeners(dashboard, state);
  }

  if (profileDash) {
    initAsideListeners(dashboard);
    initUserWidget();

    await populateDashboardStats({
      widgetList: getStatCounters(dashboard),
      scope: 'user',
    });

    syncState(state, { profileFeed: true });

    await populateDashboardFeed({
      feedNode: getFeedNode(dashboard),
      state,
    });

    initFilterListeners(dashboard, state);
  }

  if (recordCreationDash) {
    const newRecordForm = document.querySelector('.create-edit-form--create');
    const locationInput = document.querySelector('.create-edit-form__location');
    const locationReset = document.querySelector(
      '.create-edit-form__location-reset'
    );

    await populateDashboardStats({
      widgetList: getStatCounters(dashboard),
      scope: 'user',
    });

    initAsideListeners(dashboard);

    autoCompleteHook(locationInput);

    locationReset.addEventListener('click', () => resetLocationFields());

    newRecordForm.addEventListener('submit', e => {
      e.preventDefault();

      const { currentTarget: form } = e;
      const { value: type } = form.querySelector('.create-edit-form__type');
      const { value: title } = form.querySelector(
        '.create-edit-form__record-title'
      );
      const { value: comment } = form.querySelector(
        '.create-edit-form__comment'
      );
      const emailNotify = form.querySelector(
        '.create-edit-form__email-notification'
      );

      const missingFields = findMissingFields({ type, title, comment });

      return missingFields.length > 0
        ? displayNotification({ message: missingFieldsMessage(missingFields) })
        : createRecord({
            type,
            title,
            comment,
            location: getLocationString(),
            emailNotify: emailNotify.checked,
          });
    });
  }
});
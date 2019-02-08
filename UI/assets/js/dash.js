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
    initUserWidget,
    loadingAnimation,
    logoutListener,
    missingFieldsMessage,
    notify,
    populateDashboardStats,
    populateDashboardFeed,
    populateEditForm,
    populatePublicProfile,
    resetLocationFields,
    responsiveNav,
    stickyFilters,
    syncState,
  } = window.IR_HELPERS;

  authCheck('login.html');
  responsiveNav();
  notify();
  logoutListener();

  const { classList } = dashboard;

  const adminDash = dashboard && classList.contains('dashboard--admin');
  const generalDash = dashboard && classList.contains('dashboard--users');
  const profileDash =
    dashboard && classList.contains('dashboard--user-profile');
  const publicProfileDash =
    dashboard && classList.contains('dashboard--user-public-profile');
  const recordCreationDash =
    dashboard && dashboard.querySelector('.create-edit-form--create');
  const recordEditDash =
    dashboard && dashboard.querySelector('.create-edit-form--edit');

  const state = {
    detailmodalOpened: false,
    feedLoading: false,
    feedLoadSuccess: false,
    isAdmin: false,
    profileFeed: false,
    statusFilter: null,
    typeFilter: null,

    set loadingFeed(setTo) {
      if (setTo) {
        this.feedLoading = true;
        loadingAnimation({ recordFeed: true, show: true });
      } else {
        this.feedLoading = false;
        loadingAnimation({ recordFeed: true, show: false });
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

  if (adminDash) {
    initAsideListeners(dashboard);

    await populateDashboardStats({
      widgetList: getStatCounters(dashboard),
    });

    syncState(state, { isAdmin: true });

    await populateDashboardFeed({
      feedNode: getFeedNode(dashboard),
      state,
    });

    initFilterListeners(dashboard, state);
  }

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

  if (publicProfileDash) {
    const recordToggle = dashboard.querySelector('.user-records__toggle');
    const userRecordFeed = dashboard.querySelector('.user-records');
    const { search: queryString } = window.location;
    
    const userID = new URLSearchParams(queryString).get('uid');

    if (userID) {
      populatePublicProfile(userID);
      initAsideListeners(dashboard);

      recordToggle.addEventListener('click', () => {
        userRecordFeed.classList.toggle('remove');
        recordToggle.textContent = userRecordFeed.classList.contains('remove')
          ? 'View Records'
          : 'Hide Records';
      });

      stickyFilters();
      initFilterListeners(dashboard, state);

      syncState(state, { profileFeed: true, userID });
      await populateDashboardFeed({
        feedNode: getFeedNode(dashboard),
        state,
      });
    } else {
      displayNotification({
        type: 'Error',
        title: 'Error',
        message: 'Invalid User profile request',
      });
    }
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
      const { files: media } = form.querySelector('.create-edit-form__media');
      const emailNotify = form.querySelector(
        '.create-edit-form__email-notification'
      );
      const recordDetails = new FormData();
      const attachmentState = {
        errors: [],
        valid: true,
        setValidity(newState) {
          this.valid = newState;
        },
      };
      const missingFields = findMissingFields({ type, title, comment });

      [
        ['type', type],
        ['title', title],
        ['comment', comment],
        [
          ...(getLocationString() !== ''
            ? ['location', getLocationString()]
            : []),
        ],
        ['emailNotify', emailNotify.checked],
      ].forEach(([name, value]) =>
        value || value === false ? recordDetails.append(name, value) : null
      );

      Array.from(media).forEach(file => {
        if (['image', 'video'].includes(file.type.split('/')[0])) {
          recordDetails.append('media', file);
        } else {
          if (attachmentState.valid) attachmentState.setValidity(false);
          attachmentState.errors.push(
            `<b>"${
              file.name
            }"</b> - <i>has an unsupported file format and will be discarded.</i>`
          );
        }
      });

      if (missingFields.length && attachmentState.valid === false) {
        displayNotification({
          message: [
            missingFieldsMessage(missingFields),
            ...attachmentState.errors,
          ],
        });
      } else if (missingFields.length) {
        displayNotification({
          message: [missingFieldsMessage(missingFields)],
        });
      } else if (attachmentState.valid === false) {
        displayNotification({
          message: attachmentState.errors,
        });
        createRecord({ type, recordDetails });
      } else createRecord({ type, recordDetails });
    });
  }

  if (recordEditDash) {
    await populateDashboardStats({
      widgetList: getStatCounters(dashboard),
      scope: 'user',
    });

    initAsideListeners(dashboard);

    const { search: queryString } = window.location;
    try {
      if (
        queryString &&
        ((new URLSearchParams(queryString).has('type') &&
          new URLSearchParams(queryString).has('id')) ||
          (queryString
            .substring(1)
            .split('&')[0]
            .split('=')[0] === 'type' &&
            queryString
              .substring(1)
              .split('&')[1]
              .split('=')[0] === 'id'))
      ) {
        const recordID =
          new URLSearchParams(queryString).get('id') ||
          queryString
            .substring(1)
            .split('&')[1]
            .split('=')[1];

        const recordType =
          new URLSearchParams(queryString).get('type') ||
          queryString
            .substring(1)
            .split('&')[0]
            .split('=')[1];

        if (recordType && typeof JSON.parse(recordID) === 'number')
          populateEditForm(recordType, recordID);
        else throw Error('invalid record path');
      }
    } catch (error) {
      displayNotification({
        type: 'Error',
        title: 'Error',
        message: 'No record to edit',
      });
    }
  }
});

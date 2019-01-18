/* eslint-disable no-nested-ternary */
const IR_HELPERS = {
  API_ROOT_URL: 'https://ireporter-pms.herokuapp.com/api/v1',

  API_LOGIN_URL: 'https://ireporter-pms.herokuapp.com/api/v1/auth/login',

  API_SIGNUP_URL: 'https://ireporter-pms.herokuapp.com/api/v1/auth/signup',

  errors: {
    fetch: {
      name: 'fetchError',
      message: 'Failed to fetch Records. Please check your internet connection',
    },
    internal: {
      name: 'Error',
      message: `Something weird happened... `,
    },
    invalidAddress: {
      name: 'noLocation',
      message: 'No address exists for given coordinates',
    },
    noRecords: {
      name: 'Error',
      message: 'No records found',
    },
    mapLoad: {
      name: 'Error loading location Information',
      message:
        'There was a problem loading the address/map. Please check your internet connection',
    },
  },

  redirects: {
    adminAuthSuccessRedirect: () => window.location.assign('admin.html'),
    authSuccessRedirect: ({ first = false } = {}) =>
      !first
        ? window.location.assign('user.html')
        : window.location.assign(
            'user.html?type=success&title=First+login&message=Welcome+to+iReporter'
          ),
    back: ({ queryString = '' } = {}) =>
      document.referrer &&
      new URL(document.referrer).hostname === window.location.hostname &&
      document.referrer.split('?')[0] !== window.location.href.split('?')[0]
        ? window.location.assign(document.referrer + queryString)
        : window.location.assign(`profile.html${queryString}`),
    redirectTo: url => window.location.assign(url),
  },

  authCheck(redirectUrl) {
    return !IR_HELPERS.getToken() ? window.location.assign(redirectUrl) : null;
  },

  autoCompleteHook(locationInput) {
    try {
      const Hook = window.google.maps.places.Autocomplete;

      if (Hook) {
        const liveUpdate = new Hook(locationInput);
        liveUpdate.addListener('place_changed', () => {
          const { geometry, name } = liveUpdate.getPlace();

          if (geometry) {
            const coordinateString = IR_HELPERS.getCoords(geometry.location);

            IR_HELPERS.displayCoords(coordinateString);
          } else {
            IR_HELPERS.displayNotification({
              type: 'error',
              message: [
                `Error: no geospatial coordinates availabe for "${name}"`,
              ],
            });
          }
        });
      }
    } catch (error) {
      IR_HELPERS.displayNotification({
        message: 'Please check your internet connection',
      });
    }
  },

  buildFetchPath({ singleRecordPath, status, type, profile }) {
    return IR_HELPERS.nonExistent(singleRecordPath, status, type, profile)
      ? `${IR_HELPERS.API_ROOT_URL}/records/`
      : IR_HELPERS.exists(singleRecordPath)
      ? `${IR_HELPERS.API_ROOT_URL}/${singleRecordPath}`
      : IR_HELPERS.exists(type, status, profile)
      ? `${IR_HELPERS.API_ROOT_URL}/user/records/${type}/${status}`
      : IR_HELPERS.exists(type, profile)
      ? `${IR_HELPERS.API_ROOT_URL}/user/records/${type}`
      : IR_HELPERS.exists(type, status)
      ? `${IR_HELPERS.API_ROOT_URL}/records/${type}/${status}`
      : IR_HELPERS.exists(status, profile)
      ? `${IR_HELPERS.API_ROOT_URL}/user/records/${status}`
      : IR_HELPERS.exists(profile)
      ? `${IR_HELPERS.API_ROOT_URL}/user/records`
      : IR_HELPERS.exists(status)
      ? `${IR_HELPERS.API_ROOT_URL}/records/${status}`
      : IR_HELPERS.exists(type)
      ? `${IR_HELPERS.API_ROOT_URL}/${type}s`
      : undefined;
  },

  capitalize(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
  },

  clearNode(node) {
    node.innerHTML = '';
  },

  createRecord({ type, title, comment, location, emailNotify }) {
    fetch(`${IR_HELPERS.API_ROOT_URL}/${type}s`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${IR_HELPERS.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        title,
        comment,
        location,
        emailNotify: JSON.stringify(emailNotify),
      }),
    })
      .then(res => res.json())
      .then(({ errors, data }) => {
        if (errors) {
          IR_HELPERS.displayNotification({
            message: errors,
            title: 'Error creating record',
          });
          return;
        }
        const [{ message }] = data;
        IR_HELPERS.redirects.back({
          queryString: `?title=success&type=success&message=${message.replace(
            /\s/g,
            '+'
          )}`,
        });
      })
      .catch(() =>
        IR_HELPERS.displayNotification({ message: 'Something went wrong' })
      );
  },

  displayCoords(coordinateString) {
    const coordDisplay = document.querySelector('.create-edit-form__geocodes');
    const fieldsBelow = document.querySelectorAll(
      '.form-field--media, .form-field--notification, .btn--submit'
    );

    coordDisplay.hidden = false;
    coordDisplay.textContent = coordinateString;
    fieldsBelow.forEach(field => field.classList.add('pushdown'));

    coordDisplay.classList.remove('hidden');
    IR_HELPERS.setLocationString(coordinateString);
  },

  displayNotification({
    type,
    title = type === 'success' ? 'Success' : 'Error',
    message,
    timeout,
  }) {
    const notificationWrapper = document.querySelector('.notification-wrapper');

    const createNotification = () => {
      let messageList = '';
      let notification;

      if (title) {
        if (message instanceof Array) {
          message.forEach(msg => {
            messageList += `<p class="notification__text">${msg}</p>\n`;
          });
        } else {
          messageList += `<p class="notification__text">${message}</p>`;
        }
        notification = IR_HELPERS.spawnElement({
          element: 'div',
          attrs: {
            class: 'notification',
          },
          inner: `
            <div class="dismiss__notification">&odash;</div>
            <ul class="notification__list">
              <li class="notification__item">
                <h3 class="notification__title">${title}</h3>
                ${messageList || `<p class="notification__text">${message}</p>`}
              </li>
            </ul>`,
        });
      } else if (message instanceof Array) {
        message.forEach(msg => {
          messageList += `<li class="notification__text">${msg}</li>\n`;
        });
        notification = IR_HELPERS.spawnElement({
          element: 'div',
          attrs: {
            class: `notification`,
          },
          inner: `
            <div class="dismiss__notification">&odash;</div>
            <ul class="notification__list">
              ${messageList}
            </ul>`,
        });
      } else {
        notification = IR_HELPERS.spawnElement({
          element: 'div',
          attrs: {
            class: `notification`,
          },
          inner: `
            <div class="dismiss__notification">&odash;</div>
            <ul class="notification__list">
              <li class="notification__text">${message}</li>
            </ul>`,
        });
      }
      return notification;
    };

    const dismissNotification = notificationElement => {
      notificationElement.classList.remove('visible');
      setTimeout(() => {
        if (
          notificationElement &&
          notificationWrapper.contains(notificationElement)
        )
          notificationWrapper.removeChild(notificationElement);
      }, 200);

      return !notificationWrapper.hasChildNodes()
        ? notificationWrapper.classList.remove('visible')
        : null;
    };

    const notification = createNotification();

    if (!notificationWrapper.classList.contains('visible')) {
      notificationWrapper.classList.add('visible');
    }
    if (notificationWrapper.childElementCount >= 3) {
      const { firstChild } = notificationWrapper;
      notificationWrapper.removeChild(firstChild);
    }
    notificationWrapper.appendChild(notification);
    notification.classList.add(
      `${type === 'success' ? 'notification--success' : 'notification--error'}`,
      'visible'
    );

    const dismissButton = notification.querySelector('.dismiss__notification');
    dismissButton.addEventListener('click', () => {
      dismissNotification(notification);
    });

    setTimeout(() => {
      dismissNotification(notification);
    }, timeout || 5000);
  },

  async editRecord(path, fields) {
    const responsePromises = await Promise.all(
      Object.keys(fields).map(field =>
        IR_HELPERS.patchRecord(path, field, fields[field])
      )
    ).then(res => res.map(each => each.json()));

    const { errors, messages } = await responsePromises.reduce(
      async (parsedObjectPromise, response) => {
        const parsedObject = await parsedObjectPromise;
        const { data, errors: responseErrors } = await response;
        let message;

        if (data) [{ message }] = data;

        return responseErrors
          ? Object.assign(parsedObject, {
              errors: [...parsedObject.errors, ...responseErrors],
            })
          : Object.assign(parsedObject, {
              messages: [...parsedObject.messages, message],
            });
      },
      { errors: [], messages: [] }
    );

    return errors.length
      ? IR_HELPERS.displayNotification({
          message: errors,
          title: 'Error Updating record',
        })
      : messages.length
      ? IR_HELPERS.redirects.back({
          queryString: `?title=success&type=success&message=${messages
            .join('<br>')
            .replace(/\s/g, '+')
            .replace(/#/, '%23')}`,
        })
      : null;
  },

  exists(...args) {
    return args.every(param => param !== null && typeof param !== 'undefined');
  },

  async fetchRecords({ type, status, profile } = {}) {
    const requestUrl = IR_HELPERS.buildFetchPath({
      type,
      status,
      profile,
    });
    let records;

    try {
      const res = await fetch(requestUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${IR_HELPERS.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const { status: resStatus, errors, data } = await res.json();

      if (errors) {
        errors.forEach(error => {
          if (error === `Ooops something happened, can't find User`) {
            IR_HELPERS.redirects.redirectTo('login.html');
          }
        });
      }
      if (resStatus === 404 || !data.length) {
        throw IR_HELPERS.errors.noRecords;
      }
      records = data;
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        throw IR_HELPERS.errors.fetch;
      } else throw err;
    }
    return records;
  },

  async fetchRecordByid(singleRecordPath) {
    const requestUrl = IR_HELPERS.buildFetchPath({
      singleRecordPath,
    });
    let record;
    let errors;

    try {
      const res = await fetch(requestUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${IR_HELPERS.getToken()}`,
          'Content-Type': 'application/json',
        },
      });
      const { errors: errorList, data } = await res.json();

      errors = errorList;
      [record] = data;
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        throw IR_HELPERS.errors.fetch;
      }
    }
    return { record, errors };
  },

  fetchFilterProps(statusFilter, typeFilter) {
    if (typeFilter && statusFilter) {
      return {
        basePath: typeFilter,
        subPath: statusFilter,
      };
    }
    if (typeFilter) {
      return {
        basePath: typeFilter,
      };
    }
    return undefined;
  },

  filterStateSync(filters, state) {
    const { statusFilter, typeFilter } = filters;

    const status =
      state.statusFilter && statusFilter === null
        ? null
        : statusFilter === null
        ? null
        : statusFilter || state.statusFilter;

    const type =
      state.typeFilter && typeFilter === null
        ? null
        : typeFilter === null
        ? null
        : typeFilter || state.typeFilter;

    return { status, type };
  },

  findChangedFields(fieldPairs) {
    const changedFields = [];

    Object.keys(fieldPairs).forEach(field =>
      fieldPairs[field][0] !== fieldPairs[field][1] &&
      fieldPairs[field][1] !== ''
        ? changedFields.push({ [field]: fieldPairs[field][1] })
        : null
    );

    return changedFields;
  },

  findMissingFields(fields) {
    const missingFields = [];
    Object.keys(fields).forEach(fieldName => {
      if (
        IR_HELPERS.isEmpty(fields[fieldName]) ||
        IR_HELPERS.nonExistent(fields[fieldName])
      ) {
        missingFields.push(fieldName);
      }
    });
    return missingFields;
  },

  flipLocationString(locationString) {
    return locationString
      .split(',')
      .reverse()
      .join(',');
  },

  getCoords({ lng, lat }) {
    return `${lng()},${lat()}`;
  },

  getLocationString() {
    return IR_HELPERS.locationString;
  },

  getStatCounters(dashboard) {
    return dashboard.querySelectorAll('.dashboard__stat');
  },

  getFeedNode(dashboard) {
    return dashboard.querySelector('.dashboard__main-content');
  },

  getToken() {
    return localStorage.getItem('iReporter-token');
  },

  getUsername() {
    return localStorage.getItem('iReporter-username');
  },

  async getUsernameByID(creatorID) {
    const response = await fetch(
      `${IR_HELPERS.API_ROOT_URL}/user/id2name/${creatorID}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${IR_HELPERS.getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const {
      data: [{ username }],
      errors,
    } = await response.json();
    if (errors) {
      IR_HELPERS.displayNotification({
        type: 'error',
        title: 'An Error occured',
        message: errors.forEach(error => `${error}<br>`),
      });
      return undefined;
    }
    return username;
  },

  initAsideListeners(dashboard) {
    const sidebar = dashboard.querySelector('.dashboard__sidebar');
    const sidebarToggle = dashboard.querySelector('.dashboard__sidebar-toggle');
    const btnsTodash = dashboard.querySelector('.dashboard__sidebar-btn.dash');
    const createRecordBtn = dashboard.querySelector(
      '.dashboard__sidebar-btn.new'
    );
    const { location } = window;
    let eventTimeout;
    const revealSidebar = () => {
      sidebar.classList.toggle('active');
    };
    const resizeFunc = () => {
      const { innerHeight } = window;
      const minHeight = 448;
      if (innerHeight <= minHeight) {
        sidebar.addEventListener('click', revealSidebar);
      } else {
        sidebar.removeEventListener('click', revealSidebar);
        sidebar.classList.remove('active');
        sidebarToggle.classList.remove('active');
        sidebarToggle.textContent = 'SIDEBAR';
      }
      eventTimeout = null;
    };
    if (createRecordBtn) {
      createRecordBtn.addEventListener('click', () =>
        location.assign('new-record.html')
      );
    }
    if (btnsTodash) {
      btnsTodash.addEventListener('click', () => location.assign('user.html'));
    }
    sidebarToggle.addEventListener('click', () => {
      revealSidebar();
      sidebarToggle.classList.toggle('active');
      sidebarToggle.textContent =
        sidebarToggle.textContent === 'SIDEBAR' ? 'X' : 'SIDEBAR';
    });
    window.addEventListener('resize', () => {
      if (!eventTimeout || eventTimeout === null) {
        eventTimeout = setTimeout(() => {
          resizeFunc();
        }, 450);
      } else {
        clearTimeout(eventTimeout);
        eventTimeout = setTimeout(() => {
          resizeFunc();
        }, 250);
      }
    });
    resizeFunc();
  },

  initFilterListeners(dashboard, state) {
    const typeSelector = dashboard.querySelector(
      '.dashboard__filter-report-types'
    );
    const statusFilterContainer = dashboard.querySelector(
      '.dashboard__filter-categories'
    );
    const statusFilters = dashboard.querySelectorAll(
      '.dashboard__filter-category'
    );
    const mobileFilterToggle = dashboard.querySelector(
      '.dashboard__filter-toggle'
    );
    const toggleMobileFilter = () => {
      statusFilterContainer.classList.toggle('active');
      mobileFilterToggle.classList.toggle('active');
    };
    mobileFilterToggle.addEventListener('click', toggleMobileFilter);
    typeSelector.addEventListener(
      'change',
      ({ currentTarget: { value: typeFilter } }) => {
        IR_HELPERS.populateDashboardFeed({
          clear: true,
          feedNode: IR_HELPERS.getFeedNode(dashboard),
          typeFilter: typeFilter === 'all' ? null : typeFilter.toLowerCase(),
          state,
        });
      }
    );
    statusFilters.forEach(filter =>
      filter.addEventListener('click', ({ currentTarget }) => {
        const activeFilter = dashboard.querySelector(
          '.dashboard__filter-category.active'
        );
        activeFilter.classList.remove('active');
        currentTarget.classList.add('active');
        const {
          attributes: {
            value: { value: statusFilter },
          },
        } = currentTarget;
        IR_HELPERS.populateDashboardFeed({
          clear: true,
          state,
          feedNode: IR_HELPERS.getFeedNode(dashboard),
          statusFilter:
            statusFilter === 'all' ? null : statusFilter.toLowerCase(),
        });
        mobileFilterToggle.textContent = IR_HELPERS.capitalize(statusFilter);
        toggleMobileFilter();
      })
    );
  },

  initModalMap(locationString, mapDiv) {
    const [lat, lng] = locationString.split(',').map(x => Number(x));
    const position = {
      lat,
      lng,
    };
    const marker = opts => new window.google.maps.Marker(opts);
    try {
      const map = new window.google.maps.Map(mapDiv, {
        center: position,
        gestureHandling: 'cooperative',
        zoom: 13,
      });
      marker({
        position,
        map,
      });
    } catch (error) {
      IR_HELPERS.displayNotification({
        type: 'error',
        title: IR_HELPERS.errors.mapLoad.name,
        message: IR_HELPERS.errors.mapLoad.message,
      });
    }
  },

  initUserWidget() {
    const userWidget = document.querySelector('.topbar__profile-widget');
    const userWidgetDropdown = document.querySelector(
      '.topbar__profile-dropdown'
    );
    const userWidgetText = document.querySelector(
      '.topbar__profile-widget-text'
    );
    const username = IR_HELPERS.getUsername();

    userWidget.addEventListener('click', () => {
      userWidgetDropdown.classList.toggle('hidden');
      userWidgetDropdown.classList.toggle('visible');
    });

    userWidgetText.textContent = `Hi ${IR_HELPERS.capitalize(username)}`;
  },

  isEmpty(...args) {
    return args.every(param => param === '');
  },

  async loadFeed(feedComponents, node) {
    return feedComponents.forEach(component => {
      node.appendChild(component);
    });
  },

  loadingAnimation({ element = document, show = false }) {
    const animation = element.querySelector('.loader');
    const { classList } = animation;
    if (animation && !classList.contains('active') && show) {
      animation.classList.add('active');
    }
    if (!show) animation.classList.remove('active');
  },

  async login(username, password) {
    fetch(IR_HELPERS.API_LOGIN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(res => res.json())
      .then(({ errors, data }) => {
        if (errors) {
          IR_HELPERS.makeAuthFormMessages({
            type: 'error',
            messages: errors,
          });
          return;
        }
        const [{ token, user }] = data;
        localStorage.setItem('iReporter-token', token);
        localStorage.setItem('iReporter-username', user.username);
        IR_HELPERS.makeAuthFormMessages({
          type: 'success',
          messages: [
            `${
              user.username
            } Signed up successfully. <br> Redirecting to dashboard`,
          ],
        });
        setTimeout(
          () =>
            user.is_admin
              ? IR_HELPERS.redirects.adminAuthSuccessRedirect()
              : IR_HELPERS.redirects.authSuccessRedirect(),
          600
        );
      })
      .catch(() => {
        IR_HELPERS.makeAuthFormMessages({
          type: 'error',
          messages: [
            'Something went wrong. Please check your internet connection and try again.',
          ],
        });
      });
  },

  logoutListener() {
    document
      .querySelector('.btn--logout')
      .addEventListener('click', () => localStorage.clear());
  },

  makeAuthFormMessages({ type, messages }) {
    const alertDiv = document.querySelector('.auth__messages');
    const dismissButton = document.querySelector('.auth__messages-dismiss');
    const messageList = document.querySelector('.auth__message-list');

    const dismissAlert = () => {
      alertDiv.classList.remove('visible');
      messageList.innerHTML = '';
      alertDiv.className = 'auth__messages';
    };
    if (alertDiv.classList.contains('visible')) {
      dismissAlert();
    }
    messages.forEach(message => {
      messageList.innerHTML += `<li class="auth__message">${message}</li>\n`;
    });
    alertDiv.classList.add(
      `${
        type === 'success' ? 'auth__messages--success' : 'auth__messages--error'
      }`,
      'visible'
    );
    dismissButton.addEventListener('click', dismissAlert);
  },

  missingFieldsMessage(fields) {
    return `Missing ${
      fields.length > 1 ? fields.slice(0, -1).join(', ') : fields[0]
    } ${fields.length > 1 ? `and ${fields.slice(-1)} fields.` : 'field.'}`;
  },

  modalBinds(state, admin) {
    const modals = document.querySelectorAll('.modal-wrapper');
    const openModal = document.querySelectorAll('.record__more-btn');
    const closeModal = document.querySelectorAll('.detail-modal__close');
    /* Bind listeners to all modal toggles */
    [...openModal].forEach(element => {
      element.addEventListener('click', ({ currentTarget: recDetailBtn }) => {
        const { 'record-path': recordPath } = recDetailBtn.attributes;
        modals.forEach(modal => {
          if (modal) {
            IR_HELPERS.fetchRecordByid(recordPath.value).then(
              ({ errors, record }) => {
                if (errors) {
                  IR_HELPERS.displayNotification({
                    type: 'error',
                    title: 'Error fetching record',
                    message: errors,
                    timeout: 1000,
                  });
                } else if (record) {
                  IR_HELPERS.populateModal({
                    modal,
                    record,
                    state,
                    admin,
                  });
                  modal.classList.add('visible');
                }
              }
            );
          }
        });
      });
    });
    [...closeModal].forEach(element => {
      element.addEventListener('click', () =>
        modals.forEach(modal => {
          if (modal) {
            modal.classList.remove('visible');
            IR_HELPERS.purgeModal({
              modal,
              state,
              admin,
            });
          }
        })
      );
    });
  },

  nonExistent(...args) {
    return args.every(param => param === null || typeof param === 'undefined');
  },

  notify() {
    const { search: queryString } = window.location;

    try {
      if (
        queryString &&
        ((new URLSearchParams(queryString).has('type') &&
          new URLSearchParams(queryString).has('title') &&
          new URLSearchParams(queryString).has('message')) ||
          (queryString
            .substring(1)
            .split('&')[0]
            .split('=')[0] === 'type' &&
            queryString
              .substring(1)
              .split('&')[1]
              .split('=')[0] === 'title' &&
            queryString
              .substring(1)
              .split('&')[1]
              .split('=')[0] === 'message'))
      ) {
        const type =
          new URLSearchParams(queryString).get('type') ||
          queryString
            .substring(1)
            .split('&')[0]
            .split('=')[1];
        const title =
          new URLSearchParams(queryString).get('title').replace(/\+/g, ' ') ||
          queryString
            .substring(1)
            .split('&')[1]
            .split('=')[1]
            .replace(/\+/g, ' ');
        const message =
          new URLSearchParams(queryString).get('message').replace(/\+/g, ' ') ||
          queryString
            .substring(1)
            .split('&')[2]
            .split('=')[1]
            .replace(/\+/g, ' ');

        if (type && title && message)
          window.history.pushState(
            {},
            document.title,
            window.location.href.split('?')[0]
          );

        IR_HELPERS.displayNotification({
          message,
          type,
          title,
        });
      }
    } catch ({ name }) {
      // pass
    }
  },

  patchRecord(recordPath, field, value) {
    let requestUrl = IR_HELPERS.buildFetchPath({
      singleRecordPath: recordPath,
    });
    requestUrl += `/${field.toLowerCase()}`;

    return fetch(requestUrl, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${IR_HELPERS.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [field]: value }),
    });
  },

  async populateDashboardFeed({
    feedNode,
    clear = false,
    admin = false,
    state,
    statusFilter,
    typeFilter,
    retries = 0,
  } = {}) {
    const filtersToSync = { statusFilter, typeFilter };
    const { status, type } = IR_HELPERS.filterStateSync(filtersToSync, state);
    let filter =
      type && status
        ? (() => ({ type, status }))()
        : type
        ? (() => ({ type }))()
        : status
        ? (() => ({ status }))()
        : undefined;

    if (filter && state.profileFeed) {
      Object.assign(filter, { profile: true });
    } else if (state.profileFeed) {
      filter = { profile: true };
    }

    IR_HELPERS.syncState(state, {
      loadingFeed: true,
    });

    if (clear) IR_HELPERS.clearNode(feedNode);

    try {
      await IR_HELPERS.loadFeed(
        await IR_HELPERS.recordsToFeedComponents(
          await IR_HELPERS.fetchRecords(filter),
          IR_HELPERS.spawnElement
        ),
        feedNode
      );

      IR_HELPERS.modalBinds(state, admin);

      IR_HELPERS.syncState(state, {
        feedLoaded: true,
        statusFilter: status,
        typeFilter: type,
      });
    } catch ({ name, message }) {
      if (message === 'No records found') {
        IR_HELPERS.syncState(state, {
          loadingFeed: false,
        });
        IR_HELPERS.displayNotification({
          type: 'error',
          message,
          title: name,
        });
      } else {
        const timeout =
          retries > 0 && retries <= 3
            ? retries * 3000
            : retries > 3
            ? 10000
            : undefined;

        IR_HELPERS.syncState(state, {
          feedLoaded: false,
        });

        if (retries > 0 && retries <= 3) {
          IR_HELPERS.displayNotification({
            type: 'error',
            message: [message, `Retrying in ${timeout / 1000}s`],
            title: name,
          });
        }

        setTimeout(() => {
          IR_HELPERS.populateDashboardFeed({
            feedNode,
            statusFilter,
            typeFilter,
            clear,
            state,
            retries: retries + 1,
          });
        }, (() => timeout || 3000)());
      }
    }
  },

  async populateDashboardStats({ widgetList, scope }) {
    const statPath = scope ? `${scope}/recordstats` : 'records/stats';

    try {
      const res = await fetch(`${IR_HELPERS.API_ROOT_URL}/${statPath}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${IR_HELPERS.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const { status, errors, data } = await res.json();

      if (status === 404 || errors) {
        widgetList.forEach(statWidget => {
          statWidget.querySelector('.dashboard__stat-count').textContent = 0;
        });
        return;
      }

      const [
        { draft, resolved, rejected, 'under investigation': investigating },
      ] = data;

      widgetList.forEach((statWidget, idx) => {
        const statCount = statWidget.querySelector('.dashboard__stat-count');

        if (idx === 0) {
          statCount.textContent = draft || 0;
        }
        if (idx === 1) {
          statCount.textContent = resolved || 0;
        }
        if (idx === 2) {
          statCount.textContent = investigating || 0;
        }
        if (idx === 3) {
          statCount.textContent = rejected || 0;
        }
      });
    } catch ({ message }) {
      if (message === 'Failed to fetch') {
        setTimeout(() => {
          IR_HELPERS.populateDashboardStats({
            widgetList,
            scope,
          });
        }, 10000);
      }
    }
  },

  async populateEditForm(recordType, id) {
    const form = document.querySelector('.create-edit-form--edit');
    const titleField = form.querySelector('.create-edit-form__record-title');
    const commentField = form.querySelector('.create-edit-form__comment');
    const locationField = form.querySelector('.create-edit-form__location');
    const typeSelector = form.querySelector('.create-edit-form__type');
    const locationReset = document.querySelector(
      '.create-edit-form__location-reset'
    );
    const emailNotify = form.querySelector(
      '.create-edit-form__email-notification'
    );
    form.addEventListener('submit', e => e.preventDefault());

    try {
      const { errors, record } = await IR_HELPERS.fetchRecordByid(
        `${recordType}s/${id}`
      );

      if (errors) {
        IR_HELPERS.displayNotification({
          type: 'error',
          message: errors,
        });
        return;
      }

      if (record) {
        const {
          title,
          comment,
          location,
          type,
          email_notify: emailUpdates,
        } = record;

        titleField.value = title;
        commentField.value = comment;
        emailNotify.checked = emailUpdates;
        typeSelector.value = type;

        IR_HELPERS.autoCompleteHook(locationField);
        locationReset.addEventListener('click', () =>
          IR_HELPERS.resetLocationFields()
        );
        if (location) {
          locationField.value = await IR_HELPERS.reverseGeocode(
            IR_HELPERS.flipLocationString(location)
          );
          IR_HELPERS.displayCoords(location);
        }
      }

      form.addEventListener('submit', e => {
        e.preventDefault();
        const { comment, location, email_notify: emailUpdates } = record;
        const recordPath = `${record.type}s/${record.id}`;

        const changedFields = IR_HELPERS.findChangedFields({
          comment: [comment, commentField.value],
          emailNotify: [emailUpdates, emailNotify.checked],
          ...(location ||
          (IR_HELPERS.exists(IR_HELPERS.getLocationString()) &&
            !IR_HELPERS.isEmpty(IR_HELPERS.getLocationString()))
            ? { location: [location, IR_HELPERS.getLocationString()] }
            : {}),
        });

        return changedFields.length
          ? IR_HELPERS.editRecord(
              recordPath,
              changedFields.reduce((acc, curr) => ({ ...acc, ...curr }), {})
            )
          : IR_HELPERS.displayNotification({
              type: 'success',
              title: `Editing ${recordType} #${id}`,
              message: `No edits made.<br>
                        Comment/Location fields can only be updated, not cleared`,
            });
      });
    } catch ({ name, message }) {
      IR_HELPERS.displayNotification({
        type: 'error',
        title: name,
        message,
      });
    }
  },

  populateModal({ modal, record, state }) {
    const modalHeader = modal.querySelector('.detail-modal__type-id');
    const locationMap = modal.querySelector('.detail-modal__map');
    const recordTitle = modal.querySelector('.detail-modal__title');
    const recordByLine = modal.querySelector('.detail-modal__byline');
    const recordComment = modal.querySelector('.detail-modal__comment');
    const recordMedia = modal.querySelector('.detail-modal__media');
    const recordEditBtn = document.querySelector('.detail-modal__edit');
    const {
      comment,
      created_by: creatorID,
      id,
      location,
      title,
      type,
    } = record;

    modalHeader.textContent = `${IR_HELPERS.capitalize(type)}  #${id}`;
    if (!location) {
      locationMap.style.display = 'none';
    } else {
      IR_HELPERS.initModalMap(
        IR_HELPERS.flipLocationString(location),
        locationMap
      );
    }
    recordTitle.textContent = IR_HELPERS.capitalize(title);
    IR_HELPERS.getUsernameByID(creatorID).then(username => {
      recordByLine.innerHTML = `by: <a href="#">${username}</a>`;
    });
    recordComment.textContent = comment;
    recordMedia.appendChild(
      IR_HELPERS.spawnElement({
        element: 'img',
        attrs: {
          src: '../assets/images/crashSite.jpeg',
          class: 'detail-modal__media-item',
        },
      })
    );
    if (recordEditBtn) {
      recordEditBtn.addEventListener('click', () =>
        window.location.assign(`edit-record.html?type=${type}&id=${id}`)
      );
    }
    IR_HELPERS.syncState(state, {
      detailmodalOpened: true,
    });
  },

  purgeModal({ modal, state }) {
    const modalHeader = modal.querySelector('.detail-modal__type-id');
    const locationMap = modal.querySelector('.detail-modal__map');
    const recordTitle = modal.querySelector('.detail-modal__title');
    const recordByLine = modal.querySelector('.detail-modal__byline');
    const recordComment = modal.querySelector('.detail-modal__comment');
    const recordMedia = modal.querySelector('.detail-modal__media');

    [
      modalHeader,
      recordTitle,
      recordByLine,
      recordComment,
      recordMedia,
    ].forEach(element => IR_HELPERS.clearNode(element));
    locationMap.style.display = 'block';
    IR_HELPERS.syncState(state, {
      detailmodalOpened: false,
    });
  },

  recordsToFeedComponents(recArray, elementCreator) {
    const defaultImage = '../assets/images/crashSite.jpeg';
    if (!recArray) throw IR_HELPERS.errors.internal;
    return recArray.map(
      ({ type, id, imgUrl = defaultImage, status, title, comment }) =>
        elementCreator({
          element: 'div',
          attrs: {
            class: `record record--${type} record--${
              status === 'under investigation' ? 'investigating' : status
            }`,
          },
          inner: `
        <div class="record__image-holder">
          <img class="record__image" src=${imgUrl} alt="crash site" >
        </div>
        <div class="record__details">
          <h4 class="record__title">${title}</h4>
          <p class="record__comment">${comment
            .split(' ')
            .filter(word => word !== '')
            .slice(0, 30)
            .join(' ')}...</p>
        </div>
        <button class="record__more-btn" record-path="${type}s/${id}">View More</button>
        `,
        })
    );
  },

  resetLocationFields() {
    const coordDisplay = document.querySelector('.create-edit-form__geocodes');
    const locationInput = document.querySelector('.create-edit-form__location');
    const fieldsBelow = document.querySelectorAll(
      '.form-field--media, .form-field--notification, .btn--submit'
    );

    coordDisplay.hidden = true;
    coordDisplay.classList.add('hidden');
    coordDisplay.value = '';
    locationInput.value = '';

    fieldsBelow.forEach(field => field.classList.remove('pushdown'));
    IR_HELPERS.setLocationString('');
  },

  responsiveNav() {
    const menu = document.querySelector('.topbar__links');
    const navToggle = document.querySelector('.topbar__toggle');
    navToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.textContent = navToggle.classList.contains('active')
        ? 'Close'
        : 'Menu';
    });
  },

  async reverseGeocode(locationString) {
    try {
      const apiRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationString}&key=AIzaSyApBXNZ8DfcSajnuuNOEMWNNH0eIZdBtws`
      );
      const { results } = await apiRes.json();

      if (results.length) {
        const [{ formatted_address: mostApproximateLocation }] = results;
        return mostApproximateLocation;
      }
      throw IR_HELPERS.errors.invalidAddress;
    } catch ({ name, message }) {
      if (name === 'noLocation') {
        IR_HELPERS.displayNotification({
          type: 'error',
          title: name,
          message,
        });
      } else {
        IR_HELPERS.displayNotification({
          type: 'error',
          title: IR_HELPERS.errors.mapLoad.name,
          message: IR_HELPERS.errors.mapLoad.message,
        });
      }
    }
    return '';
  },

  setLocationString(coordinateString) {
    IR_HELPERS.locationString = coordinateString;
  },

  setText(node, text) {
    node.textContent = text;
  },

  signUp(firstname, lastname, username, email, password) {
    fetch(IR_HELPERS.API_SIGNUP_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password,
      }),
    })
      .then(res => res.json())
      .then(async ({ data, errors }) => {
        if (errors) {
          IR_HELPERS.makeAuthFormMessages({
            type: 'error',
            messages: errors,
          });
          return;
        }
        const [{ token, user }] = data;
        localStorage.setItem('iReporter-token', token);
        localStorage.setItem('iReporter-username', user.username);
        IR_HELPERS.makeAuthFormMessages({
          type: 'success',
          messages: [
            `${
              user.username
            } Signed up successfully. <br> Redirecting to dashboard`,
          ],
        });
        setTimeout(
          () =>
            IR_HELPERS.redirects.authSuccessRedirect({
              first: true,
            }),
          600
        );
      })
      .catch(() => {
        IR_HELPERS.makeAuthFormMessages({
          type: 'error',
          messages: [
            'Something went wrong. Please check your internet connection and try again.',
          ],
        });
      });
  },

  spawnElement({ element, attrs, inner }) {
    const elem = document.createElement(element);
    if (typeof attrs === 'object') {
      Object.keys(attrs).forEach(attr => elem.setAttribute(attr, attrs[attr]));
    }
    if (typeof inner === 'string') elem.innerHTML = inner;
    return elem;
  },

  syncState(state, newState) {
    Object.assign(state, newState);
  },
};

window.IR_HELPERS = IR_HELPERS;

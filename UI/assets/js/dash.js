this.addEventListener('load', async () => {
  const dashboard = document.querySelector('.dashboard');

  const {
    authCheck,
    getFeedNode,
    getStatCounters,
    initAsideListeners,
    initFilterListeners,
    loadingAnimation,
    logoutListener,
    notify,
    populateDashboardStats,
    populateDashboardFeed,
    responsiveNav,
    initUserWidget,
    syncState,
  } = window.IR_HELPERS;

  authCheck('login.html');
  responsiveNav();
  logoutListener();

  const { classList } = dashboard;

  const generalDash = dashboard && classList.contains('dashboard--users');
  const profileDash =
    dashboard && classList.contains('dashboard--user-profile');

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
    notify();
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
});

const IR_HELPERS = {
  API_SIGNUP_URL: 'https://ireporter-pms.herokuapp.com/api/v1/auth/signup',

  redirects: {
    adminAuthSuccessRedirect: () => window.location.assign('admin.html'),
    authSuccessRedirect: () => window.location.assign('user.html'),
  },

  findMissingFields(fields) {
    const missingFields = [];
    Object.keys(fields).forEach(fieldName => {
      if (
        IR_HELPERS.isEmpty(fields[fieldName]) ||
        IR_HELPERS.nonExistent(fields[fieldName])
      )
        missingFields.push(fieldName);
    });

    return missingFields;
  },

  isEmpty(...args) {
    return args.every(param => param === '');
  },

  makeAuthFormMessages({ type, messages }) {
    const alertDiv = document.querySelector('.auth__messages');
    const dismissButton = document.querySelector('.auth__messages-dismiss');
    const messageList = document.querySelector('.auth__message-list');

    messages.forEach(message => {
      messageList.innerHTML += `<li class="auth__message">${message}</li>\n`;
    });

    alertDiv.classList.add(
      `${
        type === 'success' ? 'auth__messages--success' : 'auth__messages--error'
      }`,
      'visible'
    );

    dismissButton.addEventListener('click', () => {
      alertDiv.classList.remove('visible');
      messageList.innerHTML = '';
    });
  },

  missingFieldsMessage(fields) {
    return `Missing ${
      fields.length > 1 ? fields.slice(0, -1).join(', ') : fields[0]
    } ${fields.length > 1 ? `and ${fields.slice(-1)} fields.` : 'field.'}`;
  },

  nonExistent(...args) {
    return args.every(param => param === null || typeof param === 'undefined');
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
          IR_HELPERS.makeAuthFormMessages({ type: 'error', messages: errors });
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
};

window.IR_HELPERS = IR_HELPERS;

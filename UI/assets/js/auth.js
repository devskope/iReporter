this.addEventListener('load', () => {
  const loginForm = document.querySelector('.auth__form--login');
  const signupForm = document.querySelector('.auth__form--signup');

  const {
    findMissingFields,
    login,
    makeAuthFormMessages,
    missingFieldsMessage,
    signUp,
    responsiveNav,
  } = window.IR_HELPERS;

  responsiveNav();

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const { currentTarget: form } = e;
      const { value: username } = form.querySelector('.form-field__username');
      const { value: password } = form.querySelector('.form-field__password');

      const missingFields = findMissingFields({ username, password });

      return missingFields.length > 0
        ? makeAuthFormMessages({
            type: 'error',
            messages: [missingFieldsMessage(missingFields)],
          })
        : login(username, password);
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();

      const { currentTarget: form } = e;
      const { value: firstname } = form.querySelector('.form-field__firstname');
      const { value: lastname } = form.querySelector('.form-field__lastname');
      const { value: username } = form.querySelector('.form-field__username');
      const { value: email } = form.querySelector('.form-field__email');
      const { value: password } = form.querySelector('.form-field__password');

      const missingFields = findMissingFields({ username, email, password });

      return missingFields.length > 0
        ? makeAuthFormMessages({
            type: 'error',
            messages: [missingFieldsMessage(missingFields)],
          })
        : signUp(firstname, lastname, username, email, password);
    });
  }
});

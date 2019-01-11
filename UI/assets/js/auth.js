this.addEventListener('load', () => {
  const signupForm = document.querySelector('.auth__form--signup');

  const {
    findMissingFields,
    makeAuthFormMessages,
    missingFieldsMessage,
    signUp,
    responsiveNav,
  } = window.IR_HELPERS;

  responsiveNav();

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

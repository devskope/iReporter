const loginForm = document.querySelector('.auth__form--login');

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const { currentTarget: form } = e;
  const username = form.querySelector('.form-field__login-username');
  const password = form.querySelector('.form-field__login-password');

  if (username.value === 'admin' && password.value === 'admin')
    window.location.assign('admin.html');
});

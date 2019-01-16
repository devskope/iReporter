const menu = document.querySelector('.topbar__links');
const navToggle = document.querySelector('.topbar__toggle');

navToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
  navToggle.classList.toggle('active');
  navToggle.textContent = navToggle.classList.contains('active')
    ? 'Close'
    : 'Menu';
});

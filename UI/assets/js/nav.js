const topNav = document.querySelector('.top-nav');
const navToggle = document.querySelector('.top-nav__toggle');
const navList = document.querySelector('.top-nav__list');

navToggle.addEventListener('click', () => {
  [topNav, navToggle, navList].forEach(element => {
    element.classList.toggle('active');
  });
});

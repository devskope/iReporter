const { getToken, responsiveNav } = window.IR_HELPERS;

const accessBtns = document.querySelectorAll('.btn.access');

responsiveNav();

if (!getToken()) {
  accessBtns.forEach(btn =>
    btn.addEventListener('click', () =>
      window.location.assign('./UI/views/signup.html')
    )
  );
} else {
  const navLoginBtn = document.querySelector('.btn.btn--nav');
  const footerRegLink = document.querySelector('.footer__link-join');

  navLoginBtn.href = './UI/views/user.html';
  navLoginBtn.textContent = 'Dashboard';

  accessBtns.forEach(btn => {
    btn.addEventListener('click', () =>
      window.location.assign('./UI/views/user.html')
    );
    btn.textContent = 'Latest Reports';
  });

  footerRegLink.style.display = 'none';
}

const accessBtns = document.querySelectorAll('.btn.access');

accessBtns.forEach(btn =>
  btn.addEventListener('click', () =>
    window.location.assign('./UI/views/signup.html')
  )
);

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}


//* Day 1

const buttonAuth = document.querySelector('.button-auth'),
  buttonOut = document.querySelector('.button-out'),
  buttonLogin = document.querySelector('.button-login'),
  modalAuth = document.querySelector('.modal-auth'),
  modalFooter = document.querySelector('#logInForm .modal-footer'),
  closeAuth = document.querySelector('.close-auth'),
  logInForm = document.querySelector('#logInForm'),
  loginInput = document.querySelector('#login'),
  passwordInput = document.querySelector('#password'),
  userName = document.querySelector('.user-name');

let login = localStorage.getItem('gloDelivery');

// modalAuth.classList.add('hello'); //* свойства функции classList
// modalAuth.classList.remove('modal-auth'); //*
// modalAuth.classList.toggle('modal-auth'); //*
// console.log(modalAuth.classList.contains('hello'));

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
}

function authorized() {

  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    buttonOut.style.display = '';
    userName.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  console.log("Авторизован");

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'inline';
  userName.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}

function maskInput(string) {
  return !!string.trim();
}
function notAuthorized() {
  console.log("Не авторизован");

  function logIn(event) {
    event.preventDefault();
    loginInput.style.backgroundColor = '';

    if (maskInput(loginInput.value.trim())) {
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset(); //* сбрасывает поля ввода
      checkAuth();
    } else {
      loginInput.style.borderColor = 'pink';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  // buttonLogin.disabled = true;
  // checkInput(loginInput);
  // checkInput(passwordInput);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}
/* 
function checkInput(a) {
  if (a.value == '') {
    a.addEventListener('blur', function () {
      a.style.backgroundColor = 'pink';
      console.log("Вы не ввели логин/пароль");

      a.addEventListener('input', function () {
        if (a.value == '') {
          a.style.backgroundColor = 'pink';
        }
        a.style.backgroundColor = '';
        buttonLogin.disabled = false;
      });
    });
  } else {
    // a.style.backgroundColor = '';
    // buttonLogin.disabled = false;
  }
} */

// checkInput();

checkAuth();
'use strict';

const buttonAuth = document.querySelector('.button-auth'),
  cartButton = document.querySelector("#cart-button"),
  modal = document.querySelector(".modal"),
  close = document.querySelector(".close"),
  buttonOut = document.querySelector('.button-out'),
  buttonLogin = document.querySelector('.button-login'),
  modalAuth = document.querySelector('.modal-auth'),
  modalFooter = document.querySelector('#logInForm .modal-footer'),
  closeAuth = document.querySelector('.close-auth'),
  logInForm = document.querySelector('#logInForm'),
  loginInput = document.querySelector('#login'),
  passwordInput = document.querySelector('#password'),
  userName = document.querySelector('.user-name'),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  containerPromo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

// modalAuth.classList.add('hello'); //* свойства функции classList
// modalAuth.classList.remove('modal-auth'); //*
// modalAuth.classList.toggle('modal-auth'); //*
// console.log(modalAuth.classList.contains('hello'));

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  passwordInput.style.borderColor = '';
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

    if (maskInput(loginInput.value.trim() && passwordInput.value.trim())) {
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
      passwordInput.style.borderColor = 'pink';

    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  checkInput(loginInput);
  checkInput(passwordInput);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

const error = `
<div class="error" style="display: none;">Вы не ввели логин/пароль</div>  
`;
modalFooter.insertAdjacentHTML('beforebegin', error)

function checkInput(a) {
  a.addEventListener('blur', function () {
    if (!maskInput(a.value.trim())) {
      a.style.borderColor = 'pink';
      console.log("Вы не ввели логин/пароль");
    }
  });
  a.addEventListener('input', function () {
    if (!maskInput(a.value.trim())) {
      a.style.borderColor = 'pink';
    } else {
      a.style.borderColor = '';
    }
  });
}


function createCardsRestaurants() {

  const card = `
  <a class="card card-restaurant">
    <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">Пицца плюс</h3>
        <span class="card-tag tag">50 мин</span>
      </div>
      <div class="card-info">
        <div class="rating">
          4.5
        </div>
        <div class="price">От 900 ₽</div>
        <div class="category">Пицца</div>
      </div>
    </div>
  </a>
`;

  cardsRestaurants.insertAdjacentHTML('beforeend', card); //! лучше чем innerHTML. не переводит в строку и потом обратоно в обьект

}

function createCardGood() {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
      <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">Пицца Классика</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
            грибы.
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">510 ₽</strong>
        </div>
      </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {

  const target = event.target,
    restaurant = target.closest('.card-restaurant'); //* ищет ближайшее упомянание селектора
  // console.dir(target.parentElement); //* можно обращаться к свойствам и искать нужные значения через консоль

  if (restaurant && login) {
    cardsMenu.textContent = ''; //! ошищение блока перед добавлением, чтобы не дублировались
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    createCardGood();
    createCardGood();
    createCardGood();

  } else {
    toggleModalAuth();
  }
}

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', function () {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});

checkAuth();

createCardsRestaurants();
createCardsRestaurants();
createCardsRestaurants();
createCardsRestaurants();
createCardsRestaurants();
createCardsRestaurants();
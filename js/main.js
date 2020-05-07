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
  cardsMenu = document.querySelector('.cards-menu'),
  cardRest = document.querySelector('.card-restaurant');


let cardHeader = document.querySelector('.card-header');

let login = localStorage.getItem('gloDelivery');

const getData = async function (url) {
  const response = await fetch(url);
  if (!response.ok) { //! в любом случае выдавать ответ
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)
  }
  return await response.json();
};


// modalAuth.classList.add('hello'); //* свойства функции classList
// modalAuth.classList.remove('modal-auth'); //*
// modalAuth.classList.toggle('modal-auth'); //*
// console.log(modalAuth.classList.contains('hello'));//*

const valid = function (str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  passwordInput.style.borderColor = '';
  logInForm.reset(); //* сбрасывает поля ввода
  errorMsg.style.display = 'none';
}

function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
  cardHeader.innerHTML = ''; //! обнуляем блок хедера в ресторане
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
    returnMain();
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
    // loginInput.style.backgroundColor = '';

    if (valid(loginInput.value.trim())) {
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
      loginInput.value = '';
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

let error = `
<div class="error" style="display: none;color: #ff0202">Неверная пара логин/пароль</div>  
`;
modalFooter.insertAdjacentHTML('beforebegin', error);
let errorMsg = document.querySelector('.error');

//* проверка на введеные символы у login input 
function checkInput(a) {
  a.addEventListener('blur', function () {
    if (!valid(a.value.trim())) {
      a.style.borderColor = 'pink';
      errorMsg.style.display = 'block';
    }

  });
  a.addEventListener('input', function () {
    if (!valid(a.value.trim())) {
      a.style.borderColor = 'pink';
    } else {
      a.style.borderColor = '';
      errorMsg.style.display = 'none';
    }
  });
}

//* создание карточек ресторанов из одной 
function createCardsRestaurants(restaurant) {

  const {
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery: timeOfDelivery
  } = restaurant;

  const card = `
  <a class="card card-restaurant" 
  data-products="${products}" 
  data-name="${name}"
  data-stars="${stars}"
  data-kitchen="${kitchen}"
  data-price="${price}">
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery}</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  </a>
`;
  cardsRestaurants.insertAdjacentHTML('beforeend', card); //! лучше чем innerHTML. не переводит в строку и потом обратоно в обьект
}

//* создание карточек товаров

function createCardGood({
  description,
  id,
  image,
  name,
  price
}) { //* есть возможность заисать так а не как выше у

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}</div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">${price} ₽</strong>
        </div>
      </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

//* есть возможность заисать так а не как выше у


function openGoods(event) {

  const target = event.target,
    restaurant = target.closest('.card-restaurant'); //* ищет ближайшее упомянание селектора
  // console.dir(target.parentElement); //* можно обращаться к свойствам и искать нужные значения через консоль

  if (restaurant && login) {
    console.log(restaurant.dataset.products);
    console.log(restaurant.dataset.name);

    cardsMenu.textContent = ''; //! ошищение блока перед добавлением, чтобы не дублировались
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    getData(`../db/${restaurant.dataset.products}`).then(function (data) {
      data.forEach(createCardGood);
    });

//* добавляем блок хедера карточек в ресторане обращаясь к dataset в 

    cardHeader.insertAdjacentHTML('beforeend', `
        <h2 class="section-title restaurant-title">${restaurant.dataset.name}</h2>
        <div class="card-info">
          <div class="rating">
          ${restaurant.dataset.stars}
          </div>
          <div class="price">От ${restaurant.dataset.price} ₽</div>
          <div class="category">${restaurant.dataset.kitchen}</div>
        </div>
  `);

  } else {
    toggleModalAuth();
  }
}


function init() {
  getData('../db/partners.json').then(function (data) {
    data.forEach(createCardsRestaurants);
  });

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', returnMain);

  checkAuth();

  /*   new Swiper('.swiper-container', {
      loop: true,
      autoplay: true,
    }); */
}

init();
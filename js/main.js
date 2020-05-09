'use strict';

const buttonAuth = document.querySelector('.button-auth'),
	cartButton = document.getElementById("cart-button"),
	modal = document.querySelector(".modal"),
	close = document.querySelector(".close"),
	buttonOut = document.querySelector('.button-out'),
	buttonLogin = document.querySelector('.button-login'),
	modalAuth = document.querySelector('.modal-auth'),
	modalFooter = document.querySelector('#logInForm .modal-footer'),
	closeAuth = document.querySelector('.close-auth'),
	logInForm = document.getElementById('logInForm'),
	loginInput = document.querySelector('#login'),
	passwordInput = document.getElementById('password'),
	userName = document.querySelector('.user-name'),
	cardsRestaurants = document.querySelector('.cards-restaurants'),
	containerPromo = document.querySelector('.container-promo'),
	restaurants = document.querySelector('.restaurants'),
	menu = document.querySelector('.menu'),
	logo = document.querySelector('.logo'),
	cardsMenu = document.querySelector('.cards-menu'),
	cardRest = document.querySelector('.card-restaurant'),
	restaurantTitle = document.querySelector('.restaurant-title'),
	rating = document.querySelector('.rating'),
	category = document.querySelector('.category'),
	minPrice = document.querySelector('.price'),
	inputSearch = document.querySelector('.input-search'),
	modalBody = document.querySelector('.modal-body'),
	modalPricetag = document.querySelector('.modal-pricetag'),
	cart = [];


let cardHeader = document.querySelector('.card-header');
let login = localStorage.getItem('gloDelivery');


const getData = async function (url) {
	const response = await window.fetch(url);
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
		cart.length = 0;
		localStorage.removeItem('gloDelivery');
		buttonAuth.style.display = '';
		buttonOut.style.display = '';
		userName.style.display = '';
		cartButton.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		checkAuth();
		returnMain();

	}

	console.log("Авторизован");

	userName.textContent = login;
	buttonAuth.style.display = 'none';
	buttonOut.style.display = 'inline';
	userName.style.display = 'flex';
	cartButton.style.display = 'flex';
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
		name,
		stars,
		kitchen,
		price,
		products,
		time_of_delivery: timeOfDelivery
	} = restaurant;
	const card = document.createElement('a');
	card.className = 'card card-restaurant';
	card.products = products;
	card.info = [kitchen, name, price, stars];

	card.insertAdjacentHTML('beforeend', `
		<img src="${image}" alt="${name}" class="card-image"/>
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
`);

	cardsRestaurants.insertAdjacentElement('beforeend', card); //! лучше чем innerHTML. не переводит в строку и потом обратоно в обьект
}

//* создание карточек товаров

function createCardGood({
	description,
	image,
	name,
	price,
	id
}) { //* есть возможность заисать так а не как выше у

	const card = document.createElement('div');
	card.className = 'card';
	card.insertAdjacentHTML('beforeend', `
			<img src="${image}" alt="${name}" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title card-title-reg">${name}</h3>
				</div>
				<div class="card-info">
					<div class="ingredients">${description}</div>
				</div>
				<div class="card-buttons">
					<button class="button button-primary button-add-cart" id="${id}">
						<span class="button-card-text">В корзину</span>
						<span class="button-cart-svg"></span>
					</button>
					<strong class="card-price card-price-bold">${price} ₽</strong>
				</div>
			</div>
	`);
	cardsMenu.insertAdjacentElement('beforeend', card);
}

//* есть возможность заисать так а не как выше у

// открывает меню ресторана
function openGoods(event) {
	const target = event.target;
	if (login) {

		const restaurant = target.closest('.card-restaurant'); //* ищет ближайшее упомянание селектора
		// console.dir(target.parentElement); //* можно обращаться к свойствам и искать нужные значения через консоль

		if (restaurant) {
			//   console.log(restaurant.dataset.products);
			//   console.log(restaurant.dataset.name);
			const [kitchen, name, price, stars] = restaurant.info; //присваиваем каджому элементу имя
			console.log(restaurant);

			cardsMenu.textContent = ''; //! ошищение блока перед добавлением, чтобы не дублировались
			containerPromo.classList.add('hide');
			restaurants.classList.add('hide');
			menu.classList.remove('hide');


			//* добавляем блок хедера карточек в ресторане обращаясь к dataset в Day3 homeWork

			// const info = restaurant.dataset.info.split(','); //разбиваем массив

			// ! 1) вариант - добавляет элементы уже в вёрстку.
			restaurantTitle.textContent = name;
			rating.textContent = stars;
			category.textContent = kitchen;
			minPrice.textContent = `От ${price} ₽`;

			getData(`../db/${restaurant.products}`).then(function (data) {
				data.forEach(createCardGood);
			});
			// ! 2) мой вариант - создает карточкку хедера

			/*       cardHeader.insertAdjacentHTML('beforeend', `
							<h2 class="section-title restaurant-title">${name}</h2>
							<div class="card-info">
								<div class="rating">
								${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
				`); */
		}
	} else {
		toggleModalAuth();
	}
}

function addToCart(event) {
	const target = event.target;
	const buttonAddToCart = target.closest('.button-add-cart');

	if (buttonAddToCart) {
		const card = target.closest('.card');
		const title = card.querySelector('.card-title-reg').textContent;
		const cost = card.querySelector('.card-price').textContent;
		const id = buttonAddToCart.id;
		const food = cart.find(function (item) {
			return item.id === id;
		});
		if (food) {
			food.count += 1;
		} else {
			cart.push({
				id,
				title,
				cost,
				count: 1
			});
		}

		console.log(cart);
	}
}

function renderCart() {
	modalBody.textContent = '';

	cart.forEach(function ({
		id,
		title,
		cost,
		count
	}) {
		const itemCart = `
		<div class="food-row">
			<span class="food-name">${title}</span>
			<strong class="food-price">${cost}</strong>
			<div class="food-counter">
				<button class="counter-button counter-minus" data-id=${id}>-</button>
				<span class="counter">${count}</span>
				<button class="counter-button counter-plus" data-id=${id}>+</button>
			</div>
		</div>
				`;
		modalBody.insertAdjacentHTML('afterbegin', itemCart);
	});

	const totalPrice = cart.reduce(function (result, item) {
		return result + (parseFloat(item.cost) * item.count);
	}, 0);

	modalPricetag.textContent = totalPrice + ' ₽';
}

function changeCount(event) {
	const target = event.target;

	if (target.classList.contains('counter-button')) {

		const food = cart.find(function (item) {
			return item.id === target.dataset.id;
		});
		if (target.classList.contains('counter-minus')) {
			food.count--;
		}
		if (target.classList.contains('counter-plus')) {
			food.count++;
		}
		renderCart();
	}

}

function init() {
	getData('../db/partners.json').then(function (data) {
		data.forEach(createCardsRestaurants);
	});

	cartButton.addEventListener("click", function () {
		renderCart();
		toggleModal();

	});

	modalBody.addEventListener('click', changeCount());

	cardsMenu.addEventListener('click', addToCart);

	close.addEventListener("click", toggleModal);

	cardsRestaurants.addEventListener('click', openGoods);

	logo.addEventListener('click', returnMain);

	inputSearch.addEventListener('keydown', function (event) {

		if (event.keyCode === 13) {
			const target = event.target;

			const value = target.value.toLowerCase().trim();
			
			target.value = '';
			
			if (!value || value.length < 3) {
				target.style.backgroundColor = 'tomato';
				setTimeout(function () {
					target.style.backgroundColor = '';
				}, 2000);
				return;
			}
			
			
			const goods = [];

			getData('./db/partners.json')
				.then(function (data) {

					const products = data.map(function (item) {
						return item.products;
					}); //* этот метод возвращает каждую итерацию

					products.forEach(function (product) {
						getData(`../db/${product}`)
							.then(function (data) {

								goods.push(...data);

								const searchGoods = goods.filter(function (item) {
									return item.name.toLowerCase().includes(value);
								});

								console.log(searchGoods);


								cardsMenu.textContent = '';

								containerPromo.classList.add('hide');
								restaurants.classList.add('hide');
								menu.classList.remove('hide');

								restaurantTitle.textContent = 'Результат поиска';
								rating.textContent = '';
								category.textContent = '';
								minPrice.textContent = '';

								return searchGoods;

							})
							.then(function (data) {
								data.forEach(createCardGood);
							});

					});

				});
		}
	});

	checkAuth();

	// new Swiper('.swiper-container', {
	//   loop: true,
	//   autoplay: true,
	// });
}

init();
'use strict';
(function () {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';
  var DECIMAL_RADIX = 10;
  var SINGULAR = 1;
  var SINGULAR_USE_EXEPTION = 11;
  var FIRST_NUMBER_TO_USE_WITH_GENITIVE = 5;
  var LAST_OF_EXEPTION_TEN = 20;
  var typeToRussian = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var currentPin;
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var mapElement = document.querySelector('.map');
  var filtersContainerElement = mapElement.querySelector('.map__filters-container');

  var getRoomsText = function (num) {
    if (num >= FIRST_NUMBER_TO_USE_WITH_GENITIVE && num < LAST_OF_EXEPTION_TEN
      || num % DECIMAL_RADIX >= FIRST_NUMBER_TO_USE_WITH_GENITIVE || num % DECIMAL_RADIX === 0) {
      return num + ' комнат для ';
    }
    return (num % DECIMAL_RADIX === SINGULAR) ? num + ' комната для ' : num + ' комнаты для ';
  };

  var getGuestsText = function (num) {
    return (num % DECIMAL_RADIX === SINGULAR && num !== SINGULAR_USE_EXEPTION) ? num + ' гостя' : num + ' гостей';
  };

  var fillFeatureList = function (list, availableFeatures) {
    // Создаем фрагмент из доступных удобств
    var fragment = document.createDocumentFragment();
    availableFeatures.forEach(function (el) {
      var listElement = list.querySelector('.popup__feature--' + el);
      var newItem = listElement.cloneNode(true);
      newItem.textContent = el;
      fragment.appendChild(newItem);
    });
    // Удаляем из разметки первоначальный список всех возможных удобств
    // Вставляем собранный фрагмент в разметку
    list.innerHTML = '';
    list.appendChild(fragment);
  };

  var fillPhotoList = function (list, photoSources) {
    var element = list.querySelector('.popup__photo');
    element.remove();
    photoSources.forEach(function (src) {
      var newElement = element.cloneNode(true);
      newElement.src = src;
      list.appendChild(newElement);
    });
  };

  // Обработчики для кнопки закрытия карточки объявления
  var closeButtonClickHandler = function () {
    closeCard();
  };

  var closeButtonPressEnterHandler = function (evt) {
    if (evt.key === ENTER_KEY) {
      closeCard();
    }
  };

  var cardPressEscHandler = function (evt) {
    if (evt.key === ESC_KEY) {
      closeCard();
    }
  };

  var fillAdvertisementCard = function (advertisement) {
    var card = cardTemplate.cloneNode(true);
    var featureListElement = card.querySelector('.popup__features');
    var photoListElement = card.querySelector('.popup__photos');

    card.querySelector('.popup__title').textContent = advertisement.offer.title;
    card.querySelector('.popup__text--address').textContent = advertisement.offer.address;
    card.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = typeToRussian[advertisement.offer.type];
    card.querySelector('.popup__text--capacity').textContent = getRoomsText(advertisement.offer.rooms) + getGuestsText(advertisement.offer.guests);
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;
    fillFeatureList(featureListElement, advertisement.offer.features);
    card.querySelector('.popup__description').textContent = advertisement.offer.description;
    fillPhotoList(photoListElement, advertisement.offer.photos);
    card.querySelector('.popup__avatar').src = advertisement.author.avatar;

    return card;
  };

  var openCard = function (pin) {
    if (currentPin === pin) {
      return;
    }
    if (currentPin) {
      closeCard();
    }
    currentPin = pin;
    currentPin.classList.add('map__pin--active');
    var closeButton = currentPin.card.querySelector('.popup__close');
    closeButton.addEventListener('click', closeButtonClickHandler);
    closeButton.addEventListener('keydown', closeButtonPressEnterHandler);
    document.addEventListener('keydown', cardPressEscHandler);
    mapElement.insertBefore(currentPin.card, filtersContainerElement);
  };

  var closeCard = function () {
    if (!currentPin) {
      return;
    }
    mapElement.removeChild(currentPin.card);
    currentPin.classList.remove('map__pin--active');
    currentPin = null;
    document.removeEventListener('keydown', cardPressEscHandler);
  };

  window.card = {
    create: fillAdvertisementCard,
    open: openCard,
    close: closeCard
  };
})();

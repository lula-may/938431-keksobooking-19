'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var ESC_KEY = 'Escape';

  var PIN_GAP_X = 20;
  var PIN_GAP_Y = 40;

  var mapElement = document.querySelector('.map');

  // Обработчики воздействия на метку объявления
  var mapPinClickHandler = function (evt) {
    openPinCard(evt.currentTarget);
  };

  var mapPinPressEnterHandler = function (evt) {
    if (evt.key === ENTER_KEY) {
      openPinCard(evt.currentTarget);
    }
  };
  // Создание и сборка фрагмента из меток на основе шаблона
  var createPinFragment = function (arr, template) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      var advertisement = arr[i];
      var pinElement = template.cloneNode(true);
      pinElement.style = 'left: ' + (advertisement.location.x - PIN_GAP_X) + 'px; top: ' + (advertisement.location.y - PIN_GAP_Y) + 'px;';
      var picture = pinElement.querySelector('img');
      picture.src = advertisement.author.avatar;
      picture.alt = advertisement.offer.title;
      pinElement.i = i;
      // pinElement.card = ;
      pinElement.addEventListener('click', mapPinClickHandler);
      pinElement.addEventListener('keydown', mapPinPressEnterHandler);
      fragment.appendChild(pinElement);
    }
    return fragment;
  };

  var advertisements = window.data.create();
  // Показываем сгенерированные метки
  var showSimilarPins = function () {
    var pinListElement = document.querySelector('.map__pins');
    var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    pinListElement.appendChild(createPinFragment(advertisements, mapPinTemplate));
  };

  var currentCard;
  var activePin;

  var closePinCard = function (card) {
    card.remove();
    activePin = null;
    document.removeEventListener('keydown', cardPressEscHandler);
  };

  // Обработчики для кнопки закрытия карточки объявления
  var closeButtonClickHandler = function () {
    closePinCard(currentCard);
  };

  var closeButtonPressEnterHandler = function (evt) {
    if (evt.key === ENTER_KEY) {
      closePinCard(currentCard);
    }
  };

  var cardPressEscHandler = function (evt) {
    if (evt.key === ESC_KEY) {
      closePinCard(currentCard);
    }
  };

  var openPinCard = function (pin) {
    if (pin !== activePin) {
      if (currentCard) {
        currentCard.remove();
      }
      currentCard = window.card.fill(advertisements[pin.i]);
      var closeButton = currentCard.querySelector('.popup__close');
      var filtersContainer = mapElement.querySelector('.map__filters-container');

      closeButton.addEventListener('click', closeButtonClickHandler);
      closeButton.addEventListener('keydown', closeButtonPressEnterHandler);
      document.addEventListener('keydown', cardPressEscHandler);
      mapElement.insertBefore(currentCard, filtersContainer);
      activePin = pin;
    }
  };

  window.map = {
    showPins: showSimilarPins
  };
})();

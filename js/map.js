'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  // var ESC_KEY = 'Escape';

  var PIN_GAP_X = 20;
  var PIN_GAP_Y = 40;
  var mapElement = document.querySelector('.map');
  var filterSelects = mapElement.querySelectorAll('select');
  var advertisements = window.data.list;

  // Обработчики воздействия на метку объявления
  var mapPinClickHandler = function (evt) {
    window.card.open(evt.currentTarget.i);
  };

  var mapPinPressEnterHandler = function (evt) {
    if (evt.key === ENTER_KEY) {
      window.card.open(evt.currentTarget.i);
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
      pinElement.addEventListener('click', mapPinClickHandler);
      pinElement.addEventListener('keydown', mapPinPressEnterHandler);
      fragment.appendChild(pinElement);
    }
    return fragment;
  };

  // Показываем сгенерированные метки
  var showSimilarPins = function () {
    var pinListElement = document.querySelector('.map__pins');
    var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    pinListElement.appendChild(createPinFragment(advertisements, mapPinTemplate));
  };

  var activateMap = function () {
    mapElement.classList.remove('map--faded');
    filterSelects.forEach(function (el) {
      el.removeAttribute('disabled');
    });
    showSimilarPins();
  };

  var disableMap = function () {
    mapElement.classList.add('map--faded');
    filterSelects.forEach(function (el) {
      el.setAttribute('disabled', '');
    });
  };

  disableMap();

  window.map = {
    activate: activateMap,
    disable: disableMap
  };
})();

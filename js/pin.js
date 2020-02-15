'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var LEFT_MOUSE_KEY = 0;
  var MAIN_PIN_SIZE = 62;
  var PIN_ACTIVE_HEIGHT = 84;
  var pinWidth = MAIN_PIN_SIZE;
  var pinHeight = MAIN_PIN_SIZE;

  var mapElement = document.querySelector('.map');
  var mapPinMain = mapElement.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');

  // Определяем координаты метки
  var getAddressValue = function () {
    var location = {
      x: mapPinMain.offsetLeft + pinWidth / 2,
      y: mapPinMain.offsetTop + pinHeight
    };
    return location.x + ', ' + location.y;
  };

  var activatePage = function () {
    window.map.activate();
    window.form.activate();
    pinHeight = PIN_ACTIVE_HEIGHT;
    addressInput.value = getAddressValue();
    mapPinMain.removeEventListener('mousedown', mapPinMainMousedownHandler);
    mapPinMain.removeEventListener('keydown', mapPinMainPressEnterHandler);
  };

  // Обработчики взаимодействия с меткой
  var mapPinMainMousedownHandler = function (evt) {
    if (evt.button === LEFT_MOUSE_KEY) {
      activatePage();
    }
  };

  var mapPinMainPressEnterHandler = function (evt) {
    if (evt.key === ENTER_KEY) {
      activatePage();
    }
  };

  // Вешаем обработчики воздействия на метку
  mapPinMain.addEventListener('mousedown', mapPinMainMousedownHandler);
  mapPinMain.addEventListener('keydown', mapPinMainPressEnterHandler);
  // Заполняем поле адреса
  addressInput.value = getAddressValue();
})();


'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var LEFT_MOUSE_KEY = 0;
  var MAIN_PIN_SIZE = 64;
  var PIN_ACTIVE_HEIGHT = 73;
  var pinWidth = MAIN_PIN_SIZE;
  var pinHeight = MAIN_PIN_SIZE;
  var MAP_TOP = 130;
  var MAP_BOTTOM = 630;

  var mapElement = document.querySelector('.map');
  var mapPinMain = mapElement.querySelector('.map__pin--main');
  var addressInput = document.querySelector('#address');
  var pinArea = {
    top: MAP_TOP - PIN_ACTIVE_HEIGHT,
    bottom: MAP_BOTTOM - PIN_ACTIVE_HEIGHT,
    left: (-pinWidth / 2),
    right: mapElement.offsetWidth - pinWidth / 2
  };

  var START_PIN_COORDS = {
    x: mapPinMain.offsetLeft,
    y: mapPinMain.offsetTop
  };

  var Coordinate = function (x, y, area) {
    this.x = x;
    this.y = y;
    this._area = area;
  };

  Coordinate.prototype.setX = function (x) {
    if (x >= this._area.left && x <= this._area.right) {
      this.x = x;
    }
  };

  Coordinate.prototype.setY = function (y) {
    if (y >= this._area.top && y <= this._area.bottom) {
      this.y = y;
    }
  };

  // Определяем координаты метки
  var pinLocation = new Coordinate(START_PIN_COORDS.x, START_PIN_COORDS.y, pinArea);

  var setAddressValue = function () {
    addressInput.value = ((pinLocation.x + pinWidth / 2) + ', ' + (pinLocation.y + pinHeight));
  };

  var resetPin = function () {
    pinHeight = MAIN_PIN_SIZE;
    pinLocation.x = START_PIN_COORDS.x;
    pinLocation.y = START_PIN_COORDS.y;
    mapPinMain.style.left = START_PIN_COORDS.x + 'px';
    mapPinMain.style.top = START_PIN_COORDS.y + 'px';
    setAddressValue();
    mapPinMain.addEventListener('mousedown', mapPinMainMousedownHandler);
    mapPinMain.addEventListener('mousedown', mapPinMainDragHandler);
    mapPinMain.addEventListener('keydown', mapPinMainPressEnterHandler);
  };

  var activatePage = function () {
    window.map.activate();
    window.form.activate();
    pinHeight = PIN_ACTIVE_HEIGHT;
    setAddressValue();
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

  // Обработчик перетаскивания метки
  var mapPinMainDragHandler = function (evt) {
    evt.preventDefault();
    pinArea.right = mapElement.offsetWidth - pinWidth / 2;
    var startCoords = new Coordinate(evt.clientX, evt.clientY);
    var calculatedCoord = new Coordinate(pinLocation.x, pinLocation.y);
    var shift = new Coordinate(0, 0);

    var setPinLocation = function (mouseShift) {
      calculatedCoord.x -= mouseShift.x;
      calculatedCoord.y -= mouseShift.y;
      pinLocation.setX(calculatedCoord.x);
      pinLocation.setY(calculatedCoord.y);
      mapPinMain.style.left = pinLocation.x + 'px';
      mapPinMain.style.top = pinLocation.y + 'px';
    };

    var mousemoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      shift.x = startCoords.x - moveEvt.clientX;
      shift.y = startCoords.y - moveEvt.clientY;
      startCoords.x = moveEvt.clientX;
      startCoords.y = moveEvt.clientY;
      setPinLocation(shift);
      setAddressValue();
    };

    var mouseupHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
      startCoords = null;
      calculatedCoord = null;
      shift = null;
    };

    document.addEventListener('mousemove', mousemoveHandler);
    window.addEventListener('mouseup', mouseupHandler);
  };

  // Вешаем обработчики воздействия на метку
  mapPinMain.addEventListener('mousedown', mapPinMainMousedownHandler);
  mapPinMain.addEventListener('mousedown', mapPinMainDragHandler);
  mapPinMain.addEventListener('keydown', mapPinMainPressEnterHandler);
  // Заполняем поле адреса
  setAddressValue();

  window.pin = {
    reset: resetPin
  };
})();


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

  // Определяем исходные координаты метки
  var initialPinCoord = new Coordinate(mapPinMain.offsetLeft, mapPinMain.offsetTop);

  var setAddressValue = function () {
    addressInput.value = ((mapPinMain.offsetLeft + pinWidth / 2) + ', ' + (mapPinMain.offsetTop + pinHeight));
  };

  var resetPin = function () {
    pinHeight = MAIN_PIN_SIZE;
    mapPinMain.style.left = initialPinCoord.x + 'px';
    mapPinMain.style.top = initialPinCoord.y + 'px';
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
    var pinLocation = new Coordinate(mapPinMain.offsetLeft, mapPinMain.offsetTop, pinArea);
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
      pinLocation = null;
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


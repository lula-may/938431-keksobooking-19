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
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var addressInputElement = document.querySelector('#address');
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
  var initialPinCoord = new Coordinate(mapPinMainElement.offsetLeft, mapPinMainElement.offsetTop);

  var setAddressValue = function () {
    addressInputElement.value = ((mapPinMainElement.offsetLeft + pinWidth / 2) + ', ' + (mapPinMainElement.offsetTop + pinHeight));
  };

  var resetPin = function () {
    pinHeight = MAIN_PIN_SIZE;
    mapPinMainElement.style.left = initialPinCoord.x + 'px';
    mapPinMainElement.style.top = initialPinCoord.y + 'px';
    setAddressValue();
    mapPinMainElement.addEventListener('mousedown', mapPinMainMousedownHandler);
    mapPinMainElement.addEventListener('mousedown', mapPinMainDragHandler);
    mapPinMainElement.addEventListener('keydown', mapPinMainPressEnterHandler);
  };

  var activatePage = function () {
    window.map.activate();
    window.form.activate();
    pinHeight = PIN_ACTIVE_HEIGHT;
    setAddressValue();
    mapPinMainElement.removeEventListener('mousedown', mapPinMainMousedownHandler);
    mapPinMainElement.removeEventListener('keydown', mapPinMainPressEnterHandler);
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
    var pinLocation;
    evt.preventDefault();
    if (!pinLocation) {
      pinLocation = new Coordinate(mapPinMainElement.offsetLeft, mapPinMainElement.offsetTop, pinArea);
      var startCoord = new Coordinate(evt.clientX, evt.clientY);
      var calculatedCoord = new Coordinate(pinLocation.x, pinLocation.y);
      var shift = new Coordinate(0, 0);
    } else {
      pinLocation.x = mapPinMainElement.offsetLeft;
      pinLocation.y = mapPinMainElement.offsetTop;
      startCoord.x = evt.clientX;
      startCoord.y = evt.clientY;
      calculatedCoord.x = pinLocation.x;
      calculatedCoord.y = pinLocation.y;
      shift.x = 0;
      shift.y = 0;
    }
    pinArea.right = mapElement.offsetWidth - pinWidth / 2;

    var setPinLocation = function (mouseShift) {
      calculatedCoord.x -= mouseShift.x;
      calculatedCoord.y -= mouseShift.y;
      pinLocation.setX(calculatedCoord.x);
      pinLocation.setY(calculatedCoord.y);
      mapPinMainElement.style.left = pinLocation.x + 'px';
      mapPinMainElement.style.top = pinLocation.y + 'px';
    };

    var mousemoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      shift.x = startCoord.x - moveEvt.clientX;
      shift.y = startCoord.y - moveEvt.clientY;
      startCoord.x = moveEvt.clientX;
      startCoord.y = moveEvt.clientY;
      setPinLocation(shift);
      setAddressValue();
    };

    var mouseupHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mousemoveHandler);
      document.removeEventListener('mouseup', mouseupHandler);
    };

    document.addEventListener('mousemove', mousemoveHandler);
    window.addEventListener('mouseup', mouseupHandler);
  };

  // Вешаем обработчики воздействия на метку
  mapPinMainElement.addEventListener('mousedown', mapPinMainMousedownHandler);
  mapPinMainElement.addEventListener('mousedown', mapPinMainDragHandler);
  mapPinMainElement.addEventListener('keydown', mapPinMainPressEnterHandler);
  // Заполняем поле адреса
  setAddressValue();

  window.pin = {
    reset: resetPin
  };
})();


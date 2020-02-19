'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var LEFT_MOUSE_KEY = 0;
  var MAIN_PIN_SIZE = 64;
  var PIN_ACTIVE_HEIGHT = 72;
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

  // Определяем координаты метки
  var pinLocation = new Coordinate(mapPinMain.offsetLeft, mapPinMain.offsetTop, pinArea);
  var calculatedCoords = new Coordinate(pinLocation.x, pinLocation.y);
  var shift = new Coordinate(0, 0);

  var setAddressValue = function () {
    addressInput.value = ((pinLocation.x + pinWidth / 2) + ', ' + (pinLocation.y + pinHeight));
  };

  var setPinLocation = function (mouseShift) {
    calculatedCoords.x -= mouseShift.x;
    calculatedCoords.y -= mouseShift.y;
    pinLocation.setX(calculatedCoords.x);
    pinLocation.setY(calculatedCoords.y);
    mapPinMain.style.left = pinLocation.x + 'px';
    mapPinMain.style.top = pinLocation.y + 'px';
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
      mapPinMain.addEventListener('mousedown', mapPinMainDragHandler);
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
    };

    document.addEventListener('mousemove', mousemoveHandler);
    window.addEventListener('mouseup', mouseupHandler);
  };


  // Вешаем обработчики воздействия на метку
  mapPinMain.addEventListener('mousedown', mapPinMainMousedownHandler);
  mapPinMain.addEventListener('keydown', mapPinMainPressEnterHandler);
  // Заполняем поле адреса
  setAddressValue();
})();


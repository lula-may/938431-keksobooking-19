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
  var pinLocationLimit = {
    top: MAP_TOP - PIN_ACTIVE_HEIGHT,
    bottom: MAP_BOTTOM - PIN_ACTIVE_HEIGHT,
    left: (-pinWidth / 2),
    right: mapElement.offsetWidth - pinWidth / 2
  };
  var pinMainPosition;

  // Определяем координаты метки
  var setAddressValue = function () {
    var location = {
      x: mapPinMain.offsetLeft + pinWidth / 2,
      y: mapPinMain.offsetTop + pinHeight
    };
    addressInput.value = (location.x + ', ' + location.y);
  };


  var setPinLocation = function (mouseShift) {
    pinMainPosition.x -= mouseShift.x;
    pinMainPosition.y -= mouseShift.y;
    // Проверяем, что метка не выходит за границы карты по горизонтали
    if (pinMainPosition.x < pinLocationLimit.left) {
      mapPinMain.style.left = pinLocationLimit.left;
    } else if (pinMainPosition.x > pinLocationLimit.right) {
      mapPinMain.style.left = pinLocationLimit.right;
    } else {
      mapPinMain.style.left = (mapPinMain.offsetLeft - mouseShift.x) + 'px';
    }
    // Проверяем, что метки на выходит за границы карты по вертикали
    if (pinMainPosition.y < pinLocationLimit.top) {
      mapPinMain.style.top = pinLocationLimit.top;
    } else if (pinMainPosition.y > pinLocationLimit.bottom) {
      mapPinMain.style.top = pinLocationLimit.bottom;
    } else {
      mapPinMain.style.top = (mapPinMain.offsetTop - mouseShift.y) + 'px';
    }
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

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    pinMainPosition = {
      x: mapPinMain.offsetLeft,
      y: mapPinMain.offsetTop
    };

    pinLocationLimit.right = mapElement.offsetWidth - pinWidth / 2;

    var mousemoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

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
  mapPinMain.addEventListener('mousedown', mapPinMainMousedownHandler);
  mapPinMain.addEventListener('keydown', mapPinMainPressEnterHandler);
  // Заполняем поле адреса
  setAddressValue();
})();


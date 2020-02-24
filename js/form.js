'use strict';

(function () {
  var TOO_MANY_ROOMS = '100';
  var NO_GUESTS = '0';
  var INVALID_STYLE = 'border: 2px solid red';
  var adForm = document.querySelector('.ad-form');
  var formFieldsets = adForm.querySelectorAll('fieldset');
  var formElements = adForm.querySelectorAll('select, input');
  var typeSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var roomSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var timeinSelect = adForm.querySelector('#timein');
  var timeoutSelect = adForm.querySelector('#timeout');
  var submitButton = adForm.querySelector('.ad-form__submit');

  // Связываем значение поля "Тип жилья" с полем "Цена"
  var setPriceValidity = function () {
    var type = typeSelect.value;
    switch (type) {
      case 'palace':
        priceInput.setAttribute('min', '10000');
        priceInput.setAttribute('placeholder', '10000');
        break;
      case 'flat':
        priceInput.setAttribute('min', '1000');
        priceInput.setAttribute('placeholder', '1000');
        break;
      case 'house':
        priceInput.setAttribute('min', '5000');
        priceInput.setAttribute('placeholder', '5000');
        break;
      default:
        priceInput.setAttribute('min', '0');
        priceInput.setAttribute('placeholder', '0');
    }
  };

  // Связываем значение поля "Количество комнат" с "Количеством мест"
  var setGuestSelectValidity = function () {
    var rooms = roomSelect.value;
    var capacity = capacitySelect.value;

    if (rooms === TOO_MANY_ROOMS && capacity !== NO_GUESTS) {
      capacitySelect.setCustomValidity('Ваши комнаты - не для гостей. Выберите "Не для гостей".');
    } else if (rooms !== TOO_MANY_ROOMS && capacity > rooms) {
      capacitySelect.setCustomValidity('Гостей не должно быть больше чем комнат. Выберите другое значение.');
    } else if (rooms !== TOO_MANY_ROOMS && capacity === NO_GUESTS) {
      capacitySelect.setCustomValidity('Выберите хотя бы одного гостя!');
    } else {
      capacitySelect.setCustomValidity('');
    }
  };

  // Связываем время заезда и время выезда
  var setSameValue = function (select, value) {
    select.value = value;
  };

  // Подсвечиваем невалидные поля при попытке отправки
  var highlightInvalidFields = function () {
    var invalidFields = Array.from(formElements).filter(function (el) {
      return !el.validity.valid;
    });

    invalidFields.forEach(function (el) {
      var elChangeHandler = function () {
        if (el.validity.valid) {
          el.style.cssText = '';
          el.removeEventListener('change', elChangeHandler);
        }
      };
      el.style.cssText = INVALID_STYLE;
      el.addEventListener('change', elChangeHandler);
    });
  };

  // Действия при успешной оправке формы
  var doOnSuccessfulSending = function () {
    window.success.show();
    resetForm();
    window.map.reset();
  };

  // Обработчики изменения значений полей формы
  var typeChangeHandler = function () {
    setPriceValidity();
  };

  var timeinSelectChangeHandler = function () {
    setSameValue(timeoutSelect, timeinSelect.value);
  };

  var timeoutSelectChangeHandler = function () {
    setSameValue(timeinSelect, timeoutSelect.value);
  };

  var capacitySelectChangeHandler = function () {
    setGuestSelectValidity();
  };

  var roomSelectChangeHandler = function () {
    setGuestSelectValidity();
  };

  var adFormSubmitHandler = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), doOnSuccessfulSending, window.error.show);
  };

  var clickSubmitButtonHandler = function () {
    highlightInvalidFields();
  };

  // Валидация формы
  var validateForm = function () {
    // Проверка полей в начале
    setGuestSelectValidity();
    setPriceValidity();
    typeSelect.addEventListener('change', typeChangeHandler);
    timeinSelect.addEventListener('change', timeinSelectChangeHandler);
    timeoutSelect.addEventListener('change', timeoutSelectChangeHandler);
    capacitySelect.addEventListener('change', capacitySelectChangeHandler);
    roomSelect.addEventListener('change', roomSelectChangeHandler);
  };

  var activateForm = function () {
    adForm.classList.remove('ad-form--disabled');
    formFieldsets.forEach(function (el) {
      el.removeAttribute('disabled');
    });
    validateForm();
    adForm.addEventListener('submit', adFormSubmitHandler);
    submitButton.addEventListener('click', clickSubmitButtonHandler);
  };

  var disableForm = function () {
    adForm.classList.add('ad-form--disabled');
    formFieldsets.forEach(function (el) {
      el.setAttribute('disabled', '');
    });
    typeSelect.removeEventListener('change', typeChangeHandler);
    timeinSelect.removeEventListener('change', timeinSelectChangeHandler);
    timeoutSelect.removeEventListener('change', timeoutSelectChangeHandler);
    capacitySelect.removeEventListener('change', capacitySelectChangeHandler);
    roomSelect.removeEventListener('change', roomSelectChangeHandler);
    adForm.removeEventListener('submit', adFormSubmitHandler);
    // adForm.removeEventListener('oninvalid', adFormInvalidHandler);
  };

  var resetForm = function () {
    adForm.reset();
    disableForm();
  };

  disableForm();

  window.form = {
    activate: activateForm,
    disable: disableForm,
    reset: resetForm
  };
})();

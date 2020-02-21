'use strict';

(function () {
  var ESC_KEY = 'Escape';
  var LEFT_MOUSE_BUTTON = 0;

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorContainer = document.querySelector('main');
  var errorElement;

  var buttonClickHandler = function (evt) {
    evt.preventDefault();
    hideErrorMessage();
  };

  var EscPressHandler = function (evt) {
    if (evt.key === ESC_KEY) {
      hideErrorMessage();
    }
  };

  var documentClickHandler = function (evt) {
    if (evt.button === LEFT_MOUSE_BUTTON) {
      hideErrorMessage();
    }
  };

  var hideErrorMessage = function () {
    errorElement.remove();
    document.removeEventListener('keydown', EscPressHandler);
    window.removeEventListener('click', documentClickHandler);
  };

  var showErrorMessage = function (message) {
    errorElement = errorTemplate.cloneNode(true);
    var button = errorElement.querySelector('.error__button');
    errorElement.querySelector('.error__message').textContent = message;
    button.addEventListener('click', buttonClickHandler);
    document.addEventListener('keydown', EscPressHandler);
    document.addEventListener('mousedown', documentClickHandler);
    errorContainer.appendChild(errorElement);
  };

  window.error = {
    show: showErrorMessage
  };
})();

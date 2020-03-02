'use strict';

(function () {
  var ESC_KEY = 'Escape';
  var LEFT_MOUSE_BUTTON = 0;

  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successContainer = document.querySelector('main');
  var successElement;

  var escPressHandler = function (evt) {
    if (evt.key === ESC_KEY) {
      hideMessage();
    }
  };

  var documentClickHandler = function (evt) {
    if (evt.button === LEFT_MOUSE_BUTTON) {
      hideMessage();
    }
  };

  var hideMessage = function () {
    successElement.remove();
    document.removeEventListener('keydown', escPressHandler);
    window.removeEventListener('click', documentClickHandler);
  };

  var showMessage = function () {
    successElement = successTemplate.cloneNode(true);
    document.addEventListener('keydown', escPressHandler);
    document.addEventListener('mousedown', documentClickHandler);
    successContainer.appendChild(successElement);
  };

  window.success = {
    show: showMessage
  };
})();

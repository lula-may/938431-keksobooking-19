'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpeg', 'jpg', 'png'];
  var avatarLoaderElement = document.querySelector('#avatar');
  var avatarContainerElement = document.querySelector('.ad-form-header__preview');
  var housingPhotoLoaderElement = document.querySelector('#images');
  var housingPhotoContainerElement = document.querySelector('.ad-form__photo');
  var avatarElement = avatarContainerElement.querySelector('img');
  var initialImg = avatarElement.src;


  var setPictureLoader = function (pictureLoader, pictureContainer) {
    var picture = pictureContainer.querySelector('img');

    var pictureLoaderChangeHandler = function () {
      var file = pictureLoader.files[0];
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();
        var readerLoadHandler = function () {
          picture.src = reader.result;
          pictureContainer.classList.add('chosen');
          picture.classList.add('loaded');
          reader.removeEventListener('load', readerLoadHandler);
        };
        reader.addEventListener('load', readerLoadHandler);
        reader.readAsDataURL(file);
      }
    };

    if (!picture) {
      picture = document.createElement('img');
      pictureContainer.appendChild(picture);
    }

    pictureLoader.addEventListener('change', pictureLoaderChangeHandler);
    pictureLoader.removeListener = function () {
      this.removeEventListener('change', pictureLoaderChangeHandler);
    };
  };

  var activatePictureLoaders = function () {
    setPictureLoader(avatarLoaderElement, avatarContainerElement);
    setPictureLoader(housingPhotoLoaderElement, housingPhotoContainerElement);
  };

  var disable = function () {
    housingPhotoContainerElement.innerHTML = '';
    housingPhotoContainerElement.classList.remove('chosen');
    avatarContainerElement.classList.remove('chosen');
    avatarElement.classList.remove('loaded');
    avatarElement.src = initialImg;
    housingPhotoLoaderElement.removeListener();
    avatarLoaderElement.removeListener();
  };


  window.imgLoader = {
    activate: activatePictureLoaders,
    disable: disable
  };
})();

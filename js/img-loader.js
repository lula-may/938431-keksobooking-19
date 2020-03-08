'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpeg', 'jpg', 'png'];
  var avatarLoader = document.querySelector('#avatar');
  var avatarContainer = document.querySelector('.ad-form-header__preview');
  var housingPhotoLoader = document.querySelector('#images');
  var housingPhotoContainer = document.querySelector('.ad-form__photo');
  var avatar = avatarContainer.querySelector('img');
  var initialImg = avatar.src;


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
    setPictureLoader(avatarLoader, avatarContainer);
    setPictureLoader(housingPhotoLoader, housingPhotoContainer);
  };

  var disable = function () {
    housingPhotoContainer.innerHTML = '';
    housingPhotoContainer.classList.remove('chosen');
    avatarContainer.classList.remove('chosen');
    avatar.classList.remove('loaded');
    avatar.src = initialImg;
    housingPhotoLoader.removeListener();
    avatarLoader.removeListener();
  };


  window.imgLoader = {
    activate: activatePictureLoaders,
    disable: disable
  };
})();

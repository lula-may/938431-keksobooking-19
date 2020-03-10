'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpeg', 'jpg', 'png'];
  var avatarLoaderElement = document.querySelector('#avatar');
  var avatarContainerElement = document.querySelector('.ad-form-header__preview');
  var housingPhotoContainerElement = document.querySelector('.ad-form__photo-container');
  var housingPhotoLoaderElement = housingPhotoContainerElement.querySelector('#images');
  var housingPhotoDivElement = housingPhotoContainerElement.querySelector('.ad-form__photo');
  var avatarElement = avatarContainerElement.querySelector('img');
  var initialImg = avatarElement.src;
  var userPhotos = [];
  var noUserPhoto = true;

  var avatarLoaderChangeHandler = function () {
    var file = avatarLoaderElement.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      var readerLoadHandler = function () {
        avatarElement.src = reader.result;
        avatarContainerElement.classList.add('chosen');
        avatarElement.classList.add('loaded');
        reader.removeEventListener('load', readerLoadHandler);
      };
      reader.addEventListener('load', readerLoadHandler);
      reader.readAsDataURL(file);
    }
  };

  var createHousingPhotoList = function () {
    var files = housingPhotoLoaderElement.files;
    var fragment = document.createDocumentFragment();
    [].forEach.call(files, function (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
      if (matches) {
        var reader = new FileReader();
        var photoContainer = housingPhotoDivElement.cloneNode(true);
        var photo = document.createElement('img');
        var readerLoadHandler = function () {
          photo.src = reader.result;
          photoContainer.classList.add('chosen');
          photo.classList.add('loaded');
          photoContainer.appendChild(photo);
          reader.removeEventListener('load', readerLoadHandler);
        };
        reader.addEventListener('load', readerLoadHandler);
        reader.readAsDataURL(file);
        fragment.appendChild(photoContainer);
        userPhotos.push(photoContainer);
      }
    });
    if (noUserPhoto) {
      noUserPhoto = false;
      housingPhotoDivElement.remove();
    }
    housingPhotoContainerElement.appendChild(fragment);
  };

  var photoLoaderChangeHandler = function () {
    createHousingPhotoList();
  };

  var activatePictureLoaders = function () {
    avatarLoaderElement.addEventListener('change', avatarLoaderChangeHandler);
    housingPhotoLoaderElement.addEventListener('change', photoLoaderChangeHandler);
  };

  var disable = function () {
    userPhotos.forEach(function (el) {
      el.remove();
    });
    userPhotos.length = 0;
    noUserPhoto = true;
    housingPhotoContainerElement.appendChild(housingPhotoDivElement);
    avatarContainerElement.classList.remove('chosen');
    avatarElement.classList.remove('loaded');
    avatarElement.src = initialImg;
    housingPhotoLoaderElement.removeEventListener('change', photoLoaderChangeHandler);
    avatarLoaderElement.removeEventListener('change', avatarLoaderChangeHandler);
  };


  window.imgLoader = {
    activate: activatePictureLoaders,
    disable: disable
  };
})();

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

  var matches = function (file) {
    var fileName = file.name.toLowerCase();
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  var showAvatar = function (reader, container) {
    avatarElement.src = reader.result;
    container.classList.add('chosen');
    avatarElement.classList.add('loaded');
  };

  var getNewPhoto = function (reader, container) {
    var photo = document.createElement('img');
    photo.src = reader.result;
    container.classList.add('chosen');
    photo.classList.add('loaded');
    container.appendChild(photo);
  };

  var setUpFileReader = function (file, container, onSuccess) {
    var reader = new FileReader();
    var readerLoadHandler = function () {
      onSuccess(reader, container);
      reader.removeEventListener('load', readerLoadHandler);
    };
    reader.addEventListener('load', readerLoadHandler);
    reader.readAsDataURL(file);
  };

  var getAvatar = function (file) {
    if (matches(file)) {
      setUpFileReader(file, avatarContainerElement, showAvatar);
    }
  };

  var createHousingPhotoList = function (files) {
    var fragment = document.createDocumentFragment();
    [].forEach.call(files, function (file) {
      if (matches(file)) {
        var photoContainer = housingPhotoDivElement.cloneNode(true);
        setUpFileReader(file, photoContainer, getNewPhoto);
        fragment.appendChild(photoContainer);
        userPhotos.push(photoContainer);
      }
    });
    if (housingPhotoDivElement) {
      housingPhotoDivElement.remove();
    }
    housingPhotoContainerElement.appendChild(fragment);
  };

  var avatarLoaderChangeHandler = function (evt) {
    var file = evt.target.files[0];
    getAvatar(file, avatarContainerElement);
  };

  var photoLoaderChangeHandler = function (evt) {
    var files = evt.target.files;
    createHousingPhotoList(files);
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

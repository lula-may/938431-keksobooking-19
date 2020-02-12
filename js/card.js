'use strict';
(function () {

  var housing = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var getTypeInRussian = function (type) {
    return housing[type];
  };

  var getRoomsText = function (num) {
    if (num > 10 && num < 15 || num % 10 > 4 || num % 10 === 0) {
      return num + ' комнат для ';
    }
    switch (num % 10) {
      case 1: return num + ' комната для ';
      default: return num + ' комнаты для ';
    }
  };

  var getGuestsText = function (num) {
    return (num % 10 === 1 && num !== 11) ? num + ' гостя' : num + ' гостей';
  };

  var fillFeatureList = function (list, availableFeatures) {
    // Создаем фрагмент из доступных удобств
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < availableFeatures.length; i++) {
      var listElement = list.querySelector('.popup__feature--' + availableFeatures[i]);
      var newItem = listElement.cloneNode(true);
      newItem.textContent = availableFeatures[i];
      fragment.appendChild(newItem);
    }
    // Удаляем из разметки первоначальный список всех возможных удобств
    // Вставляем собранный фрагмент в разметку
    list.innerHTML = '';
    list.appendChild(fragment);
  };

  var fillPhotoList = function (list, photoSources) {
    var element = list.querySelector('.popup__photo');
    element.src = photoSources[0];
    for (var i = 1; i < photoSources.length; i++) {
      var newElement = element.cloneNode(true);
      newElement.src = photoSources[i];
      list.appendChild(newElement);
    }
  };

  var fillAdvertisementCard = function (advertisement) {
    var card = cardTemplate.cloneNode(true);
    card.querySelector('.popup__title').textContent = advertisement.offer.title;
    card.querySelector('.popup__text--address').textContent = advertisement.offer.address;
    card.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = getTypeInRussian(advertisement.offer.type);
    card.querySelector('.popup__text--capacity').textContent = getRoomsText(advertisement.offer.rooms) + getGuestsText(advertisement.offer.guests);
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;
    var featureList = card.querySelector('.popup__features');
    fillFeatureList(featureList, advertisement.offer.features);
    card.querySelector('.popup__description').textContent = advertisement.offer.description;
    var photoList = card.querySelector('.popup__photos');
    fillPhotoList(photoList, advertisement.offer.photos);
    card.querySelector('.popup__avatar').src = advertisement.author.avatar;
    return card;
  };

  window.card = {
    fill: fillAdvertisementCard
  };
})();

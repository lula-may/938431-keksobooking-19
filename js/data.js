'use strict';

(function () {
  var PRICE = {
    HIGH: 50000,
    MIDDLE: 10000,
  };
  var RANGE = {
    HIGH: 'high',
    MIDDLE: 'middle',
    LOW: 'low'
  };
  var NOT_SET = 'any';

  var getPriceRange = function (value) {
    if (value >= PRICE.HIGH) {
      return RANGE.HIGH;
    }
    if (value >= PRICE.MIDDLE) {
      return RANGE.MIDDLE;
    }
    return RANGE.LOW;
  };

  var matches = function (item, sample) {
    return item === sample || sample === NOT_SET || sample === undefined;
  };

  var matchesFeatures = function (offerFeatures, sample) {
    for (var prop in sample) {
      if (sample.hasOwnProperty(prop) && sample[prop]) {
        if (!offerFeatures.some(function (el) {
          return el === prop;
        })) {
          return false;
        }
      }
    }
    return true;
  };

  var matchesFilter = function (offer, filter) {
    if (!matches(offer.type, filter.type)) {
      return false;
    }
    if (!matches(getPriceRange(offer.price), filter.price)) {
      return false;
    }
    if (!matches((offer.rooms).toString(), filter.rooms)) {
      return false;
    }
    if (!matches((offer.guests).toString(), filter.guests)) {
      return false;
    }
    return matchesFeatures(offer.features, filter.features);
  };

  window.data = {
    matches: matchesFilter
  };
})();

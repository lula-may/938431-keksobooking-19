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

  var matchesFilter = function (advertisement, filter) {
    var offer = advertisement.offer;
    if (!(offer.type === filter.type || filter.type === NOT_SET)) {
      return false;
    }
    if (!(getPriceRange(offer.price) === filter.price || filter.price === NOT_SET)) {
      return false;
    }
    if (!(offer.rooms + '' === filter.rooms || filter.rooms === NOT_SET)) {
      return false;
    }
    if (!(offer.guests + '' === filter.guests || filter.guests === NOT_SET)) {
      return false;
    }
    for (var i = 0; i < filter.features.length; i++) {
      var currentFeature = filter.features[i];
      if (offer.features.indexOf(currentFeature) === -1) {
        return false;
      }
    }
    return true;
  };

  window.data = {
    matches: matchesFilter
  };
})();

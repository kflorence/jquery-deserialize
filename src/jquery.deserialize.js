/**
 *  jQuery.deserialize
 *
 *  @author Kyle Florence <kyle[dot]florence[at]gmail[dot]com>
 *  @website https://github.com/kflorence/jquery-deserialize/
 *  @version 1.0.0
 *
 *  Dual licensed under the MIT and BSD licenses.
 */
;(function($) {
  var rcheck = /^(radio|checkbox)$/i,
      rselect = /^(option|select-one|select-multiple)$/i,
      rvalue = /^(hidden|text|search|tel|url|email|password|datetime|date|month|week|time|datetime-local|number|range|color|submit|image|reset|button|textarea)$/i;

  // Adds name/value pairs to an array
  function addItem(name, value) {
    var i = 0, length = this.length;

    if ($.isArray(value)) {
      for (; i < length; i++) {
        this.push({ name: name, value: value[i] });
      }
    } else {
      this.push({ name: name, value: value });
    }
  }

  $.fn.deserialize = function(data, callback) {
    if (!this.length || !data) {
      return this;
    }

    var i,
        length,
        dataType = $.type(data),
        elements = this[0].elements || this.find(":input").get(),
        normalized = [];

    if (dataType === "string") {
      data = decodeURIComponent(data).split("&");

      for (i = 0, length = data.length; i < length; i++) {
        addItem.apply(normalized, data[i].split("="));
      }
    } else if (dataType === "array") {
      normalized = data;
    } else if (dataType === "object") {
      var key;

      for (key in data) {
        if (data.hasOwnProperty(key)) {
          addItem.call(normalized, key, data[key]);
        }
      }
    }

    if (!elements || !(length = normalized.length)) {
      return this;
    }

    var current,
        element,
        item,
        j,
        len,
        property,
        type;

    for (i = 0; i < length; i++) {
      current = normalized[i];

      if (!(element = elements[current.name])) {
        continue;
      }

      type = (len = element.length) ? element[0] : element;
      type = type.type || type.tagName;

      property = null;
      rvalue.test(type) && (property = "value");
      rcheck.test(type) && (property = "checked");
      rselect.test(type) && (property = "selected");

      // Handle element group
      if (len) {
        for (j = 0; j < len; j++) {
          item = element[j];

          if (item.value == current.value) {
            item[property] = true;
          }
        }
      } else {
        element[property] = current.value;
      }
    }

    if ($.isFunction(callback)) {
      callback.call(this);
    }

    return this;
  };
})(jQuery);

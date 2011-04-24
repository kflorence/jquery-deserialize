/**
 *  jQuery.deserialize
 *
 *  @author Kyle Florence <kyle[dot]florence[at]gmail[dot]com>
 *  @website https://github.com/kflorence/jquery-deserialize/
 *  @version 1.0.20110423
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

  // Returns the property to update
  function getProperty(element) {
    var type, property = null;

    element = element[0] || element;
    type = element.type || element.tagName;

    if (rvalue.test(type)) {
      property = "value";
    } else if (rcheck.test(type)) {
      property = "checked";
    } else if (rselect.test(type)) {
      property = "selected";
    }

    return property;
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
        value;

    for (i = 0; i < length; i++) {
      current = normalized[i];

      // Element not found or of invalid type
      if (!(element = elements[current.name]) || !(property = getProperty(element))) {
        continue;
      }

      // Use boolean if not operating on value property
      value = property == "value" ? current.value : !!current.value;

      // Handle element with multiple inputs (checkbox, radio, select)
      if ((len = element.length)) {
        for (j = 0; j < len; j++) {
          item = element[j];

          if (item.value == current.value) {
            item[property] = value;
            break;
          }
        }
      } else {
        element[property] = value;
      }
    }

    if ($.isFunction(callback)) {
      callback.call(this);
    }

    return this;
  };
})(jQuery);

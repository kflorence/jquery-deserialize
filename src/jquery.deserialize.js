/**
 *  jQuery.deserialize
 *
 *  @author Kyle Florence <kyle[dot]florence[at]gmail[dot]com>
 *  @website https://github.com/kflorence/jquery-deserialize/
 *  @version 1.0.20110420
 *
 *  Dual licensed under the MIT and BSD licenses.
 */
;(function($) {
  var hasOwn = Object.prototype.hasOwnProperty,
      // Which inputs need to be checked
      rcheck = /^(radio|checkbox)$/i,
      // Which inputs need to be selected
      rselect = /^(option|select-one|select-multiple)$/i,
      // Which inputs need a value set
      rvalue = /^(hidden|text|search|tel|url|email|password|datetime|date|month|week|time|datetime-local|number|range|color|submit|image|reset|button|textarea)$/i;

  // Add support for $.type pre 1.4.3
  if (!$.type) {
    var class2type = {}, toString = Object.prototype.toString;

    // Populate the class2type map
    $.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
      class2type["[object " + name + "]"] = name.toLowerCase();
    });

    $.extend({
      type: function( obj ) {
        return obj == null ? String( obj ) : class2type[ toString.call(obj) ] || "object";
      }
    });
  }

  // Adds name/value pairs to an array
  function addItem(name, value) {
    var i = 0,
        length = this.length;

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
    var property = element[0] || element;

    property = property.type || property.tagName;

    if (rvalue.test(property)) {
      return "value";
    } else if (rcheck.test(property)) {
      return "checked";
    } else if (rselect.test(property)) {
      return "selected";
    } else {
      return null;
    }
  }

  $.fn.deserialize = function(options) {
    // Quick fail if no element is passed in
    if (!this.length) {
      return this;
    }

    options = $.extend(true, {}, $.fn.deserialize.options, options);

    var data = options.data,
        dataType = $.type(data),
        elements = this[0].elements || this.find(":input").get(),
        serializedArray = [];

    // We need data and elements to populate
    if (!data || !elements) {
      return this;
    }

    // Clear out old form values before populating
    if (options.clearForm) {
      // TODO
    }

    var i,
        length;

    if (dataType === "string") {
      data = decodeURIComponent(data).split("&");

      for (i = 0, length = data.length; i < length; i++) {
        addItem.apply(serializedArray, data[i].split("="));
      }
    } else if (dataType === "array") {
      serializedArray = data;
    } else if (dataType === "object") {
      var key;

      for (key in data) {
        if (hasOwn.call(data, key)) {
          addItem.call(serializedArray, key, data[key]);
        }
      }
    }

    // Data set is empty
    if (!(length = serializedArray.length)) {
      return this;
    }

    var element,
        elementLength,
        item,
        j,
        property,
        serialized,
        value;

    for (i = 0; i < length; i++) {
      serialized = serializedArray[i];

      // Element not found
      if (!(element = elements[serialized.name])) {
        continue;
      }

      // Invalid input type
      if (!(property = getProperty(element))) {
        continue;
      }

      // Use true if we need to select or check the element
      value = property == "value" ? serialized.value : true;

      // Name matches multiple inputs, find the one with the correct value
      if ((elementLength = element.length)) {
        for (j = 0; j < elementLength; j++) {
          item = element[j];

          // Not strict equals, allows for string/number comparison
          if (item.value == serialized.value) {
            item[property] = value;
            break;
          }
        }
      }

      // Single inputs
      else {
        element[property] = value;
      }
    }

    // Let the element know we are done with it
    return this.trigger(options.events.deserialized);
  };

  // Default options
  $.fn.deserialize.options = {
    data: null,
    events: {
      deserialized: "deserialized"
    },
    clearForm: false
  };
})(jQuery);

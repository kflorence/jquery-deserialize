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
  var normalizedPairs,
      rcheck = /^(radio|checkbox)$/i,
      rselect = /^(select-one|select-multiple)$/i,
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

  function addPair(name, value) {
    if ($.isArray(value)) {
      $.each(value, function() {
        normalizedPairs.push({ name: name, value: this });
      });
    } else {
      normalizedPairs.push({ name: name, value: value });
    }
  }

  $.fn.deserialize = function(data, clearForm) {
    if (!data || !this.length) {
      return this;
    }

    var self = this, type = $.type(data);

    if (clearForm) {
      $(":checked", self).removeAttr("checked");
      $(":selected", self).removeAttr("selected");
    }

    normalizedPairs = [];

    if (type === "string") {
      var pair;

      $.each(decodeURIComponent(data).split("&"), function() {
        addPair.apply(window, this.split("="));
      });
    } else if (type === "array") {
      normalizedPairs = data;
    } else if (type === "object") {
      $.each(data, function(name, value) {
        addPair(name, value);
      });
    }

    if (normalizedPairs.length) {
      var $input, attr, inputType;

      $.each(normalizedPairs, function(i, input) {
        $input = self.find("[name='" + input.name + "']");

        if (!$input.length) {
          return;
        }

        inputType = ($input[0].type || $input[0].tagName).toLowerCase();

        if (rvalue.test(inputType)) {
          $input.val(input.value);
        } else {
          if (rcheck.test(inputType)) {
            attr = "checked";
          } else if (rselect.test(inputType)) {
            attr = "selected";
            $input = $input.find("option");
          }

          $input.filter(function() {
            return this.value == input.value;
          }).attr(attr, true);
        }
      });
    }

    return this.trigger("deserialized");
  };
})(jQuery);

/**
 * @author Kyle Florence <kyle[dot]florence[at]gmail[dot]com>
 * @website https://github.com/kflorence/jquery-deserialize/
 * @version 1.2.1
 *
 * Dual licensed under the MIT and GPLv2 licenses.
 */
(function( jQuery, undefined ) {
'use strict';

var rcheck = /^(?:radio|checkbox)$/i,
    rplus = /\+/g,
    rselect = /^(?:option|select-one|select-multiple)$/i,
    rvalue = /^(?:button|color|date|datetime|datetime-local|email|hidden|month|number|password|range|reset|search|submit|tel|text|textarea|time|url|week)$/i;

function getElements( elements ) {
    return elements.map(function() {
            return this.elements ? jQuery.makeArray( this.elements ) : this;
        }).filter( ":input:not(:disabled)" ).get();
}

// Flip an array to a map of arrays based on 'name'. Optionally pluck 'value'.
function flip (data, name, value) {
    var result = {},
        i, length, key;

    for ( i = 0, length = data.length; i < length; i++ ) {
        key = data[i][name];

        if ( !result[key] ) {
            result[key] = [];
        }

        result[key].push(value !== undefined ? data[i][value] : data[i]);
    }

    return result;
}

jQuery.fn.deserialize = function( data, options ) {
    var i, length, key,
        elements = getElements( this ),
        normalized = {};

    if ( !data || !elements.length ) {
        return this;
    }

    if ( jQuery.isPlainObject( data ) ) {
        normalized = data;

    } else if ( jQuery.isArray( data ) ) {
        normalized = flip(data, 'name', 'value');

    } else if ( typeof data === "string" ) {
        var parts;

        data = data.split( "&" );

        for ( i = 0, length = data.length; i < length; i++ ) {
            parts =  data[i].split( "=" );
            key = decodeURIComponent( parts[0] );

            if ( !normalized[key] ) {
                normalized[key] = [];
            }

            normalized[key].push(decodeURIComponent( parts[ 1 ].replace( rplus, "%20" ) ));
        }

    }

    var current, element, j, len, name, property, type, value,
        change = jQuery.noop,
        complete = jQuery.noop,
        names = {};

    options = options || {};
    elements = flip( elements, 'name' );

    // Backwards compatible with old arguments: data, callback
    if ( jQuery.isFunction( options ) ) {
        complete = options;

    } else {
        change = jQuery.isFunction( options.change ) ? options.change : change;
        complete = jQuery.isFunction( options.complete ) ? options.complete : complete;
    }

    for ( name in elements ) {
        len = elements.length;
        element = elements[name];

        type = ( len = element.length ) ? element[ 0 ] : element;
        type = ( type.type || type.nodeName ).toLowerCase();
        property = null;

        var values = normalized[name] || [];

        if ( rvalue.test( type ) ) {
            property = "value";
            values.__deser_remain = 0;

        } else if ( rcheck.test( type ) ) {
            property = "checked";

        } else if ( rselect.test( type ) ) {
            property = "selected";
            element = jQuery(element).find('option').get();
            len = element.length;

        }

        for ( i = 0; i < len; i++) {
            var set_to = '';

            current = element[i];

            if (property === "value") {
                if ( jQuery.isArray(values) && values.length ) {
                    set_to = values[ values.__deser_remain++ ];
                } else if (typeof values == 'string') {
                    set_to = values;
                }

            } else {
                j = 0;
                do {
                    set_to = current.value == values[j];
                    j++;
                } while (j < values.length && !set_to);
            }

            // only call change if the property is being set.
            if ( current[ property ] != set_to ) {
                current[ property ] = set_to;
                change.call( current, set_to );

            }

        }
    }

    complete.call( this );

    return this;
};

})( jQuery );
/**
 * @author Kyle Florence <kyle[dot]florence[at]gmail[dot]com>
 * @website https://github.com/kflorence/jquery-deserialize/
 * @version 1.1.5
 *
 * Dual licensed under the MIT and GPLv2 licenses.
 */
(function( jQuery ) {

var push = Array.prototype.push,
    rcheck = /^(radio|checkbox)$/i,
    rselect = /^(option|select-one|select-multiple)$/i,
    rplus = /\+/g,
    rvalue = /^(hidden|text|search|tel|url|email|password|datetime|date|month|week|time|datetime-local|number|range|color|submit|image|reset|button|textarea)$/i;

jQuery.fn.extend({
    deserialize: function( data, callback ) {
        if ( !this.length || !data ) {
            return this;
        }

        var i, length,
            elements = this[ 0 ].elements || this.find( ":input" ).get(),
            normalized = [];

        if ( !elements ) {
            return this;
        }

        if ( jQuery.isArray( data ) ) {
            normalized = data;

        } else if ( jQuery.isPlainObject( data ) ) {
            var key, value;

            for ( key in data ) {
                jQuery.isArray( value = data[ key ] ) ?
                    push.apply( normalized, jQuery.map( value, function( v ) {
                        return { name: key, value: v };
                    })) : push.call( normalized, { name: key, value: value } );
            }

        } else if ( typeof data === "string" ) {
            var parts;

            data = data.split( "&" );

            for ( i = 0, length = data.length; i < length; i++ ) {
                parts =  data[ i ].split( "=" );
                push.call( normalized, {
                    name: decodeURIComponent( parts[ 0 ] ),
                    value: decodeURIComponent( parts[ 1 ].replace( rplus, "%20" ) )
                });
            }
        }

        if ( !( length = normalized.length ) ) {
            return this;
        }

        var current, element, index, item, j, len, property, type,
            names = {};

        for ( i = 0; i < length; i++ ) {
            current = normalized[ i ];

            if ( !( element = elements[ current.name ] ) ) {
                continue;
            }

            type = ( len = element.length ) ? element[ 0 ] : element;
            type = type.type || type.nodeName;

            if ( rvalue.test( type ) ) {
                if ( len ) {
                    j = names[ current.name ];
                    element = element[ ( names[ current.name ] = ( j == undefined ) ? 0 : ++j ) ];
                }

                element.value = current.value;

            } else {
                property = null;

                if ( rcheck.test( type ) ) {
                    property = "checked";

                } else if ( rselect.test( type ) ) {
                    property = "selected";
                }

                for ( j = 0; j < len; j++ ) {
                    item = element[ j ];

                    if ( item.value == current.value ) {
                        item[ property ] = true;
                    }
                }
            }
        }

        if ( jQuery.isFunction( callback ) ) {
            callback.call( this );
        }

        return this;
    }
});

})( jQuery );

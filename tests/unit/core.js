var $elements, $form, $wrapper, originalData;

module( "Core", {
    setup: function() {
        $form = $( "#form" );
        $wrapper = $( "#qunit-fixture" );
        $elements = [ $form, $wrapper.find( ":input" ) ];
        originalData = $form.serializeArray();
    },
    teardown: function() {
        $form.deserialize( originalData );
    }
});

test( "Basic Requirements", function() {
    expect( 2 );

    ok( jQuery, "jQuery" );
    equals( jQuery, $, "$ = jQuery" );
});

$.each( [ "serialize", "serializeArray", "serializeObject" ], function( i, serializeMethod ) {
    test( "jQuery.deserialize (" + serializeMethod + ")", function() {
        // because these tests are round tripping the data, the change method
        // should never be called.
        var changeCount = 0;

        expect( 2 * $elements.length );
        
        $.each( $elements, function( elementIndex, $element ) { 
            var changeCalledCount = 0,
                data = $form[ serializeMethod ]();

            // reset doesn't set the values to empty, but to their initial
            // values when the form was loaded.
            $form.get( 0 ).reset();

            $form.deserialize( data, {
                change: function() {
                    changeCalledCount++;
                },
                complete: function() {
                    deepEqual( data, $form[ serializeMethod ](), "Serialized data matches deserialized data (element #" + elementIndex + ")" );
                    equal( changeCount, changeCalledCount, "Change called for each changed input (element #" + elementIndex + ")" );
                }
            });
        });
    });
});

$(function () {
    'use strict';
    /*globals $, test, equal, module */

    module("Individual Use Cases");

    $('[data-test-url]').each(function () {
        var $form = $(this),
            url = $form.attr('data-test-url');

        test('jQuery.deserialize should properly deserialize ' + url, function () {
            $form.deserialize(url);

            $($form[0].elements).each(function () {
                var $input = $(this),
                    type = $input.attr('type'),
                    title = $input.attr('title') || 'input',
                    expected_checked = $input.attr('data-expected-checked'),
                    expected_value = $input.attr('data-expected-value');

                if (typeof expected_checked !== 'undefined') {
                    equal($input.is(':checked'), expected_checked === 'true', 'Was the ' + title + ' properly checked?');
                }

                if (typeof expected_value !== 'undefined') {
                    equal($input.val(), expected_value, 'Does the ' + title + ' have the correct value');
                }

                if ($input.is('select')) {
                    $input.find('option').each(function () {
                        var expected_selected = $(this).attr('data-expected-selected');

                        if (typeof expected_selected !== 'undefined') {
                            equal($(this).is(':selected'), expected_selected === 'true', 'Was the ' + title + ' properly selected?');
                        }
                    });
                }
            });
        });
    });
});
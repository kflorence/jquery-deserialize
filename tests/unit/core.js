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
        var changeCount = originalData.length;

        expect( 2 * $elements.length );
        
        $.each( $elements, function( elementIndex, $element ) { 
            var changeCalledCount = 0,
                data = $form[ serializeMethod ]();

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
var $elements, $form, $wrapper, originalData;

module( "Core", {
    setup: function() {
        $form = $( "#form" );
        $wrapper = $( "#qunit-fixture" );
        $elements = [ $form, $wrapper.find( ":input" ).filter( ":not(:disabled)" ) ];
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

// Completely clear the form of any values to ensure deserialize
// repopulates the form (this differs from a form.reset(), since
// reset only resets back to the default state from initial page
// load).
function clearForm() {
	$form.find(":input").not(':button, :submit, :reset, :hidden, :checkbox, :radio, select, option').val('');
	$(':checkbox, :radio').removeAttr('checked');
	$('select').attr('selectedIndex', -1);
	$('option:selected').removeAttr('selected');
}

$.each( [ "serialize", "serializeArray", "serializeObject" ], function( i, serializeMethod ) {
    test( "deserialize from " + serializeMethod, function() {
        var changeCalledCount = 0,
			completeCalledCount = 0,
			changeCount = originalData.length,
			data = $form[ serializeMethod ]();

		clearForm();

		$form.deserialize( data, {
			change: function() {
				changeCalledCount++;
			},
			complete: function() {
				completeCalledCount++;
			}
		});

		deepEqual( $form[ serializeMethod ](), data, "Serialized data matches deserialized data." );
		equal( changeCalledCount, changeCount, "Change called for each changed input." );
		equal( completeCalledCount, 1, "Complete called after deserialization finished." );

		expect( 3 );
    });
});

test( "#34 Custom filter", function() {
	var $disabledField = $( "[name=disabledText]" );

	clearForm();

	equal( $disabledField.val(), "", "Disabled field has no value." );

	$form.deserialize( [
		{ name: "disabledText", value: "disabled" }
	], {
		filter: ":input"
	});
	equal( $disabledField.val(), "disabled", "Disabled field value has been set" );
	expect( 2 );
});

test( "#37 Multiple select deserialization", function() {
	var $selectMultiple = $( "[name=selectMultiple]" );

	deepEqual( $selectMultiple.val(), [ "1", "2" ], "Multiple select value is [ 1, 2 ]." );

	$form.deserialize( {
		selectMultiple: [ "2", "3" ]
	} );

	deepEqual( $selectMultiple.val(), [ "2", "3" ], "Multiple select value is [ 2, 3 ].");

	expect( 2 );
});

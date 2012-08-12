module("Core");

test("Basic Requirements", function() {
    expect(2);

    ok(jQuery, "jQuery");
    ok($, "$");
});

var str = "text=text+with+spaces&textarea=textarea&multtext=hi&multtext=hello&radio=3&checkbox=2&checkbox=3&select=3&selectMultiple=2&selectMultiple=3&multtext=howdy",
    encodedStr = "text=" + encodeURIComponent( "Thyme &time=again" ),
    encodedFieldNameStr = encodeURIComponent( "textarray[]" ) + "=textarray";

test("jQuery.deserialize(string)", function() {
    expect(18);

    var $elements = [$("#form"), $("#wrapper")],
        form = $elements[0].get(0);

    $.each($elements, function(i, $element) {
        form.reset();

        $element.deserialize(str);

        equals($element.find("[name=text]").val(), "text with spaces", "Serialized String: text with spaces");
        equals($element.find("[name=textarea]").val(), "textarea", "Serialized String: textarea");
        equals($element.find("[name=multtext]").map(function() {
            return this.value;
        }).get().join(","), "hi,hello,howdy", "Serialized Array: multiple hidden");
        equals($element.find("[name=radio]:checked").val(), "3", "Serialized String: radio");
        equals($element.find("[name=checkbox]:checked").map(function() {
            return this.value;
        }).get().join(","), "2,3", "Serialized String: checkbox");
        equals($element.find("[name=select]").val(), "3", "Serialized String: select");
        equals($element.find("[name=selectMultiple] > :selected").map(function() {
            return this.value;
        }).get().join(","), "2,3", "Serialized String: selectMultiple");

        form.reset();

        $element.deserialize(encodedStr);

        equals($element.find("[name=text]").val(), "Thyme &time=again", "Serialized, encoded String: Thyme &time=again");

        form.reset();

        $element.deserialize(encodedFieldNameStr);

        equals($element.find("input[name='textarray[]']").val(), "textarray", "Serialized, encoded fieldname: textarray[]");
    });
});

var arr = [
    { name: "text", value: "text" },
    { name: "textarea", value: "textarea" },
    { name: "multtext", value: "hi" },
    { name: "multtext", value: "hello" },
    { name: "radio", value: 3 },
    { name: "checkbox", value: 2 },
    { name: "checkbox", value: 3 },
    { name: "select", value: 3 },
    { name: "selectMultiple", value: 2 },
    { name: "selectMultiple", value: 3 },
    { name: "multtext", value: "howdy" }
];

test("jQuery.deserialize(array)", function() {
    expect(7);

    var $form = $("#form"), form = $form.get(0);

    form.reset();

    $form.deserialize(arr);

    equals(form.text.value, "text", "Serialized Array: text");
    equals(form.textarea.value, "textarea", "Serialized Array: textarea");
    equals($form.find("[name=multtext]").map(function() {
        return this.value;
    }).get().join(","), "hi,hello,howdy", "Serialized Array: multiple hidden");
    equals($form.find("[name=radio]:checked").val(), "3", "Serialized Array: radio");
    equals($form.find("[name=checkbox]:checked").map(function() {
        return this.value;
    }).get().join(","), "2,3", "Serialized Array: checkbox");
    equals($form.find("[name=select]").val(), "3", "Serialized Array: select");
    equals($form.find("[name=selectMultiple] > :selected").map(function() {
        return this.value;
    }).get().join(","), "2,3", "Serialized Array: selectMultiple");
});

var obj = {
    text: "text",
    textarea: "textarea",
    multtext: ["hi", "hello", "howdy"],
    radio: 3,
    checkbox: [2, 3],
    select: 3,
    selectMultiple: [2, 3]
};

test("jQuery.deserialize(object)", function() {
    expect(7);

    var $form = $("#form"), form = $form.get(0);

    form.reset();

    $form.deserialize(obj);

    equals(form.text.value, "text", "Serialized Array: text");
    equals(form.textarea.value, "textarea", "Serialized Array: textarea");
    equals($form.find("[name=multtext]").map(function() {
        return this.value;
    }).get().join(","), "hi,hello,howdy", "Serialized Array: multiple hidden");
    equals($form.find("[name=radio]:checked").val(), "3", "Serialized Array: radio");
    equals($form.find("[name=checkbox]:checked").map(function() {
        return this.value;
    }).get().join(","), "2,3", "Serialized Array: checkbox");
    equals($form.find("[name=select]").val(), "3", "Serialized Array: select");
    equals($form.find("[name=selectMultiple] > :selected").map(function() {
        return this.value;
    }).get().join(","), "2,3", "Serialized Array: selectMultiple");
});

test("jQuery.deserialize(string, callback)", function() {
    expect(1);

    var $form = $("#form"), form = $form.get(0);

    $form.deserialize("text=text", function() {
        equals(form.text.value, "text", "Callback");
    });
});
var $elements, $form, $wrapper;

module("Core", {
    setup: function() {
        $form = $("#form");
        $wrapper = $("#qunit-fixture");
        $elements = [$form, $wrapper.find(":input")];
    }
});

test("Basic Requirements", function() {
    expect(2);

    ok(jQuery, "jQuery");
    ok($, "$");
});

var str = "text=text+with+spaces&textarea=textarea&multtext=hi&multtext=hello&radio=3&checkbox=2&checkbox=3&select=3&selectMultiple=2&selectMultiple=3&multtext=howdy&loneCheckbox=true",
    encodedStr = "text=" + encodeURIComponent( "Thyme &time=again" ),
    encodedFieldNameStr = encodeURIComponent( "textarray[]" ) + "=textarray";

test("jQuery.deserialize({ data: string })", function() {
    expect(20);

    $.each($elements, function(i, $element) {
        $form.get(0).reset();

        $element.deserialize(str);

        equals($wrapper.find("[name=text]").val(), "text with spaces", "Serialized String[" + i + "]: text with spaces");
        equals($wrapper.find("[name=textarea]").val(), "textarea", "Serialized String[" + i + "]: textarea");
        equals($wrapper.find("[name=multtext]").map(function() {
            return this.value;
        }).get().join(","), "hi,hello,howdy", "Serialized Array[" + i + "]: multiple hidden");
        equals($wrapper.find("[name=radio]:checked").val(), "3", "Serialized String[" + i + "]: radio");
        equals($wrapper.find("[name=checkbox]:checked").map(function() {
            return this.value;
        }).get().join(","), "2,3", "Serialized String[" + i + "]: checkbox");
        equals($wrapper.find("[name=loneCheckbox]").attr("checked"), true, "Serialized String[" + i + "]: loneCheckbox");
        equals($wrapper.find("[name=select]").val(), "3", "Serialized String[" + i + "]: select");
        equals($wrapper.find("[name=selectMultiple] > :selected").map(function() {
            return this.value;
        }).get().join(","), "2,3", "Serialized String[" + i + "]: selectMultiple");

        $form.get(0).reset();

        $element.deserialize(encodedStr);

        equals($wrapper.find("[name=text]").val(), "Thyme &time=again", "Serialized, encoded String[" + i + "]: Thyme &time=again");

        $form.get(0).reset();

        $element.deserialize(encodedFieldNameStr);

        equals($wrapper.find("input[name='textarray[]']").val(), "textarray", "Serialized, encoded fieldname[" + i + "]: textarray[]");
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
    { name: "multtext", value: "howdy" },
    { name: "loneCheckbox", value: "true" }
];

test("jQuery.deserialize({ data: array })", function() {
    expect(14);

    $.each($elements, function(i, $element) {
        $form.get(0).reset();

        $element.deserialize(arr);

        equals($wrapper.find("[name=text]").val(), "text", "Serialized Array[" + i + "]: text");
        equals($wrapper.find("[name=textarea]").val(), "textarea", "Serialized Array[" + i + "]: textarea");
        equals($wrapper.find("[name=multtext]").map(function() {
            return this.value;
        }).get().join(","), "hi,hello,howdy", "Serialized Array[" + i + "]: multiple hidden");
        equals($wrapper.find("[name=radio]:checked").val(), "3", "Serialized Array[" + i + "]: radio");
        equals($wrapper.find("[name=checkbox]:checked").map(function() {
            return this.value;
        }).get().join(","), "2,3", "Serialized Array[" + i + "]: checkbox");
        equals($wrapper.find("[name=select]").val(), "3", "Serialized Array[" + i + "]: select");
        equals($wrapper.find("[name=selectMultiple] > :selected").map(function() {
            return this.value;
        }).get().join(","), "2,3", "Serialized Array[" + i + "]: selectMultiple");
    });
});

var obj = {
    text: "text",
    textarea: "textarea",
    multtext: ["hi", "hello", "howdy"],
    radio: 3,
    checkbox: [2, 3],
    select: 3,
    selectMultiple: [2, 3],
    loneCheckbox: true
};

test("jQuery.deserialize({ data: object })", function() {
    expect(14);

    $.each($elements, function(i, $element) {
        $form.get(0).reset();

        $element.deserialize(obj);

        equals($wrapper.find("[name=text]").val(), "text", "Serialized Array[" + i + "]: text");
        equals($wrapper.find("[name=textarea]").val(), "textarea", "Serialized Array[" + i + "]: textarea");
        equals($wrapper.find("[name=multtext]").map(function() {
            return this.value;
        }).get().join(","), "hi,hello,howdy", "Serialized Array[" + i + "]: multiple hidden");
        equals($wrapper.find("[name=radio]:checked").val(), "3", "Serialized Array[" + i + "]: radio");
        equals($wrapper.find("[name=checkbox]:checked").map(function() {
            return this.value;
        }).get().join(","), "2,3", "Serialized Array[" + i + "]: checkbox");
        equals($wrapper.find("[name=select]").val(), "3", "Serialized Array[" + i + "]: select");
        equals($wrapper.find("[name=selectMultiple] > :selected").map(function() {
            return this.value;
        }).get().join(","), "2,3", "Serialized Array[" + i + "]: selectMultiple");
    });
});

test("jQuery.deserialize({ data: string, change: function, complete: function })", function() {
    expect(4);

    var inputCount,
        changeCount = arr.length;

    $.each($elements, function(i, $element) {
        $form.get(0).reset();

        changeCalledCount = 0;

        $element.deserialize(arr, {
            change: function() {
                changeCalledCount++;
            },
            complete: function() {
                equals(changeCount, changeCalledCount, "Callback[" + i + "]: change called for each element");
                ok(true, "Callback[" + i + "]: complete called");
            }
        });
    });
});
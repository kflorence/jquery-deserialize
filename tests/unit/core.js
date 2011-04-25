module("Core");

test("Basic Requirements", function() {
  expect(2);

  ok(jQuery, "jQuery");
  ok($, "$");
});

var str = "text=text&textarea=textarea&radio=3&checkbox=2&checkbox=3&select=3&selectMultiple=2&selectMultiple=3";

test("jQuery.deserialize(string)", function() {
  expect(6);

  var $form = $("#form"), form = $form.get(0);

  form.reset();

  $form.deserialize(str);

  equals(form.text.value, "text", "Serialized String: text");
  equals(form.textarea.value, "textarea", "Serialized String: textarea");
  equals($form.find("[name=radio]:checked").val(), "3", "Serialized String: radio");
  equals($form.find("[name=checkbox]:checked").map(function() {
    return this.value;
  }).get().join(","), "2,3", "Serialized String: checkbox");
  equals($form.find("[name=select]").val(), "3", "Serialized String: select");
  equals($form.find("[name=selectMultiple] > :selected").map(function() {
    return this.value;
  }).get().join(","), "2,3", "Serialized String: selectMultiple");
});

var arr = [
  { name: "text", value: "text" },
  { name: "textarea", value: "textarea" },
  { name: "radio", value: 3 },
  { name: "checkbox", value: 2 },
  { name: "checkbox", value: 3 },
  { name: "select", value: 3 },
  { name: "selectMultiple", value: 2 },
  { name: "selectMultiple", value: 3 }
];

test("jQuery.deserialize(array)", function() {
  expect(6);

  var $form = $("#form"), form = $form.get(0);

  form.reset();

  $form.deserialize(arr);

  equals(form.text.value, "text", "Serialized Array: text");
  equals(form.textarea.value, "textarea", "Serialized Array: textarea");
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
  radio: 3,
  checkbox: [2, 3],
  select: 3,
  selectMultiple: [2, 3]
};

test("jQuery.deserialize(object)", function() {
  expect(6);

  var $form = $("#form"), form = $form.get(0);

  form.reset();

  $form.deserialize(obj);

  equals(form.text.value, "text", "Serialized Array: text");
  equals(form.textarea.value, "textarea", "Serialized Array: textarea");
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

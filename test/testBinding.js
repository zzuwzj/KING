//  testDatabinding.js

//  (c) 2015    Wang, Zhenjun

define("test.Person", [], function () {
  function Person() {
    this.name = 'Apple';
    this.age = 18;
  }

  Person.prototype = {
    init: function () {
      this.name = "Google";
      this.age = 21;
    },

    growUp: function () {
      this.age++;
    }
  }

  return Person;
});

king.fire({type: "ready"});
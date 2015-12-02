//  testKing.js

//  (c) 2015    Wang, Zhenjun

define("main", ["constant"], function () {
  alert("require contant.js done.");
  var ShapeFactory = king.use("ShapeFactory");
  alert(ShapeFactory.getShape("CIRCLE", 5).area());
  alert(ShapeFactory.getShape("RECTANGLE", 3, 4).area());
});

use("main");

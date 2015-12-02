//  testKing.js

//  (c) 2015    Wang, Zhenjun

require(["constant"], function () {
  alert("require contant.js done.");
  var ShapeFactory = king.use("ShapeFactory");
  alert(ShapeFactory.getShape("CIRCLE", 5).area());
  alert(ShapeFactory.getShape("RECTANGLE", 3, 4).area());
});

define("ShapeTypes", ["shape.Circle", "shape.Rectangle"], function (circle, rectangel) {
  return {
    CIRCLE: circle,
    RECTANGLE: rectangel
  };
});

define("ShapeFactory", ["ShapeTypes"], function (shapeTypes) {
  return {
    getShape: function (type) {
      var shape;

      switch (type) {
      case "CIRCLE":
        {
          shape = new shapeTypes[type](arguments[1]);
          break;
        }
      case "RECTANGLE":
        {
          shape = new shapeTypes[type](arguments[1], arguments[2]);
          break;
        }
      }

      return shape;
    }
  };
});

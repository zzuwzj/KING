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
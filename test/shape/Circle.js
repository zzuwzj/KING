define("shape.Circle", ["constant.PI"], function (pi) {
  var Circle = function (r) {
    this.r = r;
  };

  Circle.prototype = {
    area: function () {
      return pi * this.r * this.r;
    }
  };

  return Circle;
});
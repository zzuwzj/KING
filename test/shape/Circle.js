define("shape.Circle", ["constant"], function (cst) {
  var Circle = function (r) {
    this.r = r;
  };

  Circle.prototype = {
    area: function () {
      return cst.PI * this.r * this.r;
    }
  };

  return Circle;
});
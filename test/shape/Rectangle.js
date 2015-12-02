define("shape.Rectangle", [], function () {
  var Rectangle = function (l, w) {
    this.length = l;
    this.width = w;
  };

  Rectangle.prototype = {
    area: function () {
      return this.length * this.width;
    }
  };

  return Rectangle;
});
/*
 CanvasChart - an extremely simple chart generator

Supply some values, the DOM ID for the canvas element you want the
chart to draw in, and the color you want the line to be in. Then draw
it. Easy.

Example:

 new CanvasChart([1,5,0,4,3,5,7], 'test-canvas', '#0000ff').draw();

You can get a little fancier by specifying the base value (i.e. the
value that would be at the bottom of the chart) by doing a little
more:

 var chart = new CanvasChart([100, 80, 55, 130, 75, 120], 'test-canvas');
 chart.baseValue = 50;
 chart.draw();

TODO:

- There's a couple of magic numbers here to factor out. The line width
pegged at 2, and there's a little 1 in the yForValue function that
serves to make sure maximum values have their lines completely in the
chart. Those should get factored out in a nice way.

- HEY ALSO, yeah, there's some refactoring to do. This was thrown
together pretty quick, and I need to make the tests better.

 */

function CanvasChart(values, canvasID, color) {
  this.values = values || [];
  this.canvasID = canvasID || 'canvas';
  this.color = color || '#000000';

  this.baseValue = 0;

  this.max = function() {
    return Math.max.apply(Math, this.values);
  };

  this.canvas = document.getElementById(this.canvasID);

  this.heightPerUnit = function() {
    return (this.canvas.height - 2) / (this.max() - this.baseValue);
  };

  this.widthPerValue = function() {
    return this.canvas.width / (values.length - 1);
  };

  this.xForPosition = function(position) {
    return this.widthPerValue() * position;
  };

  this.yForValue = function(value) {
    return this.canvas.height - (this.heightPerUnit() * value) - 1 + (this.baseValue * this.heightPerUnit());
  };

  this.draw = function() {
    var context = this.canvas.getContext('2d');
    context.lineJoin = 'round';
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, this.yForValue(values[0]));
    var valueLength = this.values.length;
    for (var i = 0; i < valueLength; i++) {
      context.lineTo(this.xForPosition(i), this.yForValue(values[i]));
    };
    context.stroke();
  };
};

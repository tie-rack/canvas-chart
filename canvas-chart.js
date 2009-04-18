/*
 CanvasChart - an extremely simple chart generator

How to use it:

 // Create a CanvasChart object:
 var chart = new CanvasChart({values: [1,5,0,4,3,5,7], canvas: 'canvas-id'});
 // Draw it
 chart.draw();

The object you pass to the CanvasChart constructor must have at least two
properties: values and canvas. The values property needs to be an
array of numbers to be charted. The canvas property needs to be the
DOM ID of the canvas element to draw the chart in.

There's also a bunch of optional properties. Here's a rundown:

 color:     The color of the line you want drawn. The default is black.
            You can use any of the styles strokeStyle() takes.
 baseValue: The value that's represented by the bottom of the chart.
            The default is 0 or the lowest value (whichever is less).
 lineWidth: The width of the line for the chart. The default is 2 for
            some reason.
 lineJoin:  The kind of join for the line segments in the chart.  The
            default is 'round'. The available options are those that
            canvas supports.

TODO:

- Implement this (the opposite of baseValue):
    maxValue: The value that's represented by the top of the chart. The
              default is the maxinum value in values.
- HEY ALSO, yeah, there's some refactoring to do. This was thrown
together pretty quick, and I need to make more and better tests.

 */

function CanvasChart(options) {
  this.options = options;
  this.values = this.options.values;
  this.canvasID = this.options.canvas;
  this.color = this.options.color || '#000000';
  this.lineWidth = this.options.lineWidth || 2;
  this.lineJoin = this.options.lineJoin || 'round';

  this.baseValue = function() {
    if (options.hasOwnProperty('baseValue')) {
      return options.baseValue;
    }
    var min = this.min();
    return (0 > min ? min : 0);
  };

  this.min = function() {
    return Math.min.apply(Math, this.values);
  };

  this.max = function() {
    return Math.max.apply(Math, this.values);
  };

  this.canvas = document.getElementById(this.canvasID);

  this.heightPerUnit = function() {
    return (this.canvas.height - this.lineWidth) / (this.max() - this.baseValue());
  };

  this.widthPerValue = function() {
    return (this.canvas.width / (this.values.length - 1));
  };

  this.xForPosition = function(position) {
    return this.widthPerValue() * position;
  };

  this.yForValue = function(value) {
    return this.canvas.height - (this.heightPerUnit() * value) - (this.lineWidth / 2) + (this.baseValue() * this.heightPerUnit());
  };

  this.draw = function() {
    var context = this.canvas.getContext('2d');
    context.lineJoin = this.lineJoin;
    context.strokeStyle = this.color;
    context.lineWidth = this.lineWidth;
    context.beginPath();
    context.moveTo(0, this.yForValue(this.values[0]));
    var valueLength = this.values.length;
    for (var i = 0; i < valueLength; i++) {
      context.lineTo(this.xForPosition(i), this.yForValue(this.values[i]));
    };
    context.stroke();
  };
};

/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

var SortAction = require('./sort-action');

var BAR_COLOR = '#1e1e38';
var COMPARE_COLOR = '#e0544c';
var SWAP_SPEED = 20;
var SHUFFLE_SPEED = 100;

function SortPane(sortDefinition, array) {
  this.algorithm = sortDefinition.algorithm;
  this.snap = Snap(sortDefinition.svg);
  this.array = array.slice();

  this.isSorting = false;

  this.createBars();
}

SortPane.prototype.setArray = function (array) {
  this.array = array.slice();
  this.redrawArray();
}

SortPane.prototype.redrawArray = function () {
  this.stop();
  for (var i = 0; i < this.bars.length; i++) {
    var newHeight = this.array[i] * 6;
    this.bars[i].animate({
      height: newHeight,
      y: 125 - newHeight
    }, SHUFFLE_SPEED);
  }
}

SortPane.prototype.createBars = function () {
  this.bars = [];
  for (var i = 0; i < this.array.length; i++) {
    var x = 5 + i * 12; // 10 + 2 padding
    var width = 10;
    var height = this.array[i] * 6;
    var y = 125 - height;
    var bar = this.snap.rect(x, y, width, height);
    bar.attr('fill', BAR_COLOR);
    this.bars.push(bar);
  }
}

SortPane.prototype.stop = function () {
  this.isSorting = false;
}

SortPane.prototype.play = function () {
  this.isSorting = true;
  var sortActions = sort(this.array, this.algorithm);
  this.playSortActions(sortActions, this.bars);
};

SortPane.prototype.onplayfinished = function () {
  this.isSorting = false;
}

SortPane.prototype.playSortActions = function (sortActions) {
  if (!this.isSorting) {
    // Playback was stopped
    return;
  }
  if (sortActions.length === 0) {
    this.onplayfinished();
    return;
  }
  var action = sortActions.shift();
  if (action.isSwapAction()) {
    // Animate x values
    var temp = this.bars[action.a].getBBox().x;
    this.bars[action.a].animate({
      x: this.bars[action.b].getBBox().x
    }, SWAP_SPEED);
    this.bars[action.b].animate({
      x: temp
    }, SWAP_SPEED);
    // Swap indexes
    temp = this.bars[action.a];
    this.bars[action.a] = this.bars[action.b];
    this.bars[action.b] = temp;
  }
  if (action.isCompareAction()) {
    this.bars[action.a].attr({
      fill: COMPARE_COLOR
    });
    this.bars[action.b].attr({
      fill: COMPARE_COLOR
    });
  }

  var that = this;
  setTimeout(function () {
    if (action.isCompareAction()) {
      that.bars[action.a].attr({
        fill: BAR_COLOR
      });
      that.bars[action.b].attr({
        fill: BAR_COLOR
      });
    }
    that.playSortActions(sortActions, this.bars);
  }, SWAP_SPEED * 2);
}

function sort(array, algorithm, customCompare) {
  var sortActions = [];
  algorithm.attachCompareObserver(function (array, a, b) {
    sortActions.push(new SortAction(a, b, SortAction.COMPARE));
  });
  algorithm.attachSwapObserver(function (array, a, b) {
    sortActions.push(new SortAction(a, b, SortAction.SWAP));
  });
  algorithm(array, customCompare);
  algorithm.detachCompareObserver();
  algorithm.detachSwapObserver();
  return sortActions;
}

module.exports = SortPane;

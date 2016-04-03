/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

var SortAction = require('./sort-action');

var BAR_WIDTH = 10;
var BAR_MAX_HEIGHT = 125;
var BAR_VALUE_HEIGHT_INCREMENET = 6;
var BAR_HORIZONTAL_PADDING = 2;
var BAR_LEFT_PADDING = 5;
var BAR_COLOR = '#1e1e38';
var COMPARE_COLOR = '#e0544c';
var SWAP_SPEED = 50;
var SHUFFLE_SPEED = 100;

function SortPane(sortDefinition, array) {
  this.algorithm = sortDefinition.algorithm;
  this.snap = Snap(sortDefinition.svg);
  this.array = array.slice();

  this.sortInReverse = false;
  this.isSorting = false;

  this.createBars();
}

SortPane.prototype.setArray = function (array) {
  this.array = array.slice();
  this.redrawArray();
};

SortPane.prototype.redrawArray = function () {
  this.stop();
  for (var i = 0; i < this.bars.length; i++) {
    var newHeight = this.array[i] * BAR_VALUE_HEIGHT_INCREMENET;
    this.bars[i].animate({
      height: newHeight,
      y: BAR_MAX_HEIGHT - newHeight
    }, SHUFFLE_SPEED);
  }
};

SortPane.prototype.createBars = function () {
  this.bars = [];
  for (var i = 0; i < this.array.length; i++) {
    var x = BAR_LEFT_PADDING + i * (BAR_WIDTH + BAR_HORIZONTAL_PADDING);
    var width = BAR_WIDTH;
    var height = this.array[i] * BAR_VALUE_HEIGHT_INCREMENET;
    var y = BAR_MAX_HEIGHT - height;
    var bar = this.snap.rect(x, y, width, height);
    bar.attr('fill', BAR_COLOR);
    this.bars.push(bar);
  }
};

SortPane.prototype.toggleSortDirection = function () {
  this.sortInReverse = !this.sortInReverse;
};

SortPane.prototype.stop = function () {
  this.isSorting = false;
};

SortPane.prototype.play = function () {
  this.isSorting = true;
  var customCompare = undefined;
  if (this.sortInReverse) {
    customCompare = function (a, b) {
      return b - a;
    };
  }
  var sortActions = sort(this.array, this.algorithm, customCompare);
  this.playSortActions(sortActions, this.bars);
};

SortPane.prototype.onplayfinished = function () {
  this.isSorting = false;
};

SortPane.prototype.playSortActions = function (sortActions) {
  if (!this.isSorting) {
    // Playback was stopped
    return;
  }
  if (sortActions.length === 0) {
    this.onplayfinished();
    return;
  }
  var that = this;
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
    setTimeout(function () {
      that.bars[action.a].animate({
        fill: BAR_COLOR
      }, SWAP_SPEED);
      that.bars[action.b].animate({
        fill: BAR_COLOR
      }, SWAP_SPEED);
    }, SWAP_SPEED);
  }

  setTimeout(function () {
    that.playSortActions(sortActions);
  }, SWAP_SPEED * 2);
};

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

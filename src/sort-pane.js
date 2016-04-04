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

function SortPane(svgElement, algorithm, array) {
  this.algorithm = algorithm;
  this.snap = Snap(svgElement);
  this.array = array.slice();

  this.sortInReverse = false;
  this.isSorting = false;

  this.createBars();

  var customCompare = undefined;
  if (this.sortInReverse) {
    customCompare = function (a, b) {
      return b - a;
    };
  }
  // Clone the array do the original is retained
  this.sortActions = sort(array.slice(), this.algorithm, customCompare);
  this.currentSortActionIndex = 0;
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
  // TODO: Differentiate from pause, restart data set?
};

SortPane.prototype.pause = function () {
  this.isSorting = false;
};

SortPane.prototype.resume = function () {
  if (this.isSorting) {
    return;
  }
  this.isSorting = true;
  this.playSortActions(false);
};

SortPane.prototype.stepForward = function () {
  if (this.isSorting) {
    return;
  }
  this.isSorting = true;
  this.playSortActions(true);
  this.isSorting = false;
};

SortPane.prototype.stepBack = function () {
  if (this.isSorting) {
    return;
  }
  if (this.currentSortActionIndex === 0) {
    // Cannot go back
    return;
  }
  this.playSortAction(this.sortActions[--this.currentSortActionIndex]);
};

SortPane.prototype.play = function () {
  if (this.isSorting) {
    // Wait for action to finish, this could be improved by retaining a queue of
    // current actions and/or firing an event when everything is finished
    this.isSorting = false;
    var that = this;
    setTimeout(function () {
      if (this.currentSortActionIndex !== 0) {
        that.redrawArray();
      }
      that.isSorting = true;
      that.currentSortActionIndex = 0;
      setTimeout(that.playSortActions.bind(that, false), SHUFFLE_SPEED);
    }, SWAP_SPEED);
    return;
  }
  this.isSorting = true;
  this.currentSortActionIndex = 0;
  setTimeout(this.playSortActions.bind(this, false), SHUFFLE_SPEED);
};

SortPane.prototype.onplayfinished = function () {
  this.isSorting = false;
};

SortPane.prototype.playSortActions = function (stepOnlyOnce) {
  if (!this.isSorting) {
    // Playback was stopped
    return;
  }
  if (this.currentSortActionIndex >= this.sortActions.length) {
    this.onplayfinished();
    return;
  }
  var that = this;
  this.playSortAction(this.sortActions[this.currentSortActionIndex++]);

  if (!stepOnlyOnce) {
    setTimeout(function () {
      that.playSortActions();
    }, SWAP_SPEED * 2);
  }
};

SortPane.prototype.playSortAction = function (action) {
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
    compareTwoValues(this.bars[action.a], this.bars[action.b]);
  }
};

function compareTwoValues(barA, barB) {
  barA.attr({ fill: COMPARE_COLOR });
  barB.attr({ fill: COMPARE_COLOR });
  setTimeout(function () {
    barA.animate({ fill: BAR_COLOR }, SWAP_SPEED);
    barB.animate({ fill: BAR_COLOR }, SWAP_SPEED);
  }, SWAP_SPEED);
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

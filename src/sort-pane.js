/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

var Snap = require('imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js');
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
  this.snap = Snap(svgElement); // eslint-disable-line new-cap
  this.array = array.slice();

  this.sortInReverse = false;
  this.isSorting = false;
  this.isPausing = false;

  this.createBars();
  this.performSort();
}

SortPane.prototype.setArray = function (array) {
  this.array = array.slice();
  this.redrawArray();
};

SortPane.prototype.performSort = function () {
  var customCompare;
  if (this.sortInReverse) {
    customCompare = function (a, b) {
      return b - a;
    };
  }
  // Clone the array do the original is retained
  this.sortActions = sort(this.array.slice(), this.algorithm, customCompare);
  this.currentSortActionIndex = 0;
};

SortPane.prototype.redrawArray = function () {
  this.pause();
  for (var i = 0; i < this.bars.length; i++) {
    var newHeight = this.array[i] * BAR_VALUE_HEIGHT_INCREMENET;
    this.bars[i].animate({
      height: newHeight,
      y: BAR_MAX_HEIGHT - newHeight
    }, SHUFFLE_SPEED);
  }
  this.performSort();
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
  if (this.currentSortActionIndex === 0) {
    this.performSort();
  }
};

SortPane.prototype.pause = function () {
  this.isSorting = false;
  this.isPausing = true;
};

SortPane.prototype.stepForward = function () {
  if (this.isSorting) {
    this.pause();
  }
  this.isSorting = true;
  this.playSortActions(true);
  this.isSorting = false;
};

SortPane.prototype.stepBack = function () {
  if (this.isSorting) {
    this.pause();
  }
  if (this.currentSortActionIndex === 0) {
    // Cannot go back
    return;
  }
  this.playSortAction(this.sortActions[--this.currentSortActionIndex]);
};

SortPane.prototype.play = function () {
  if (this.isSorting) {
    return;
  }
  this.isSorting = true;
  this.isPausing = false;
  this.playSortActions(false);
};

SortPane.prototype.resume = function () {
  if (this.isPausing) {
    this.isPausing = false;
    this.isSorting = true;
  }
  if (this.isSorting) {
    return;
  }
  if (this.currentSortActionIndex === 0) {
    // Resume, don't play from start
    return;
  }
  this.isSorting = true;
  this.isPausing = false;
  this.playSortActions(false);
};

SortPane.prototype.restart = function () {
  if (this.isSorting) {
    // Wait for action to finish, this could be improved by retaining a queue of
    // current actions and/or firing an event when everything is finished
    this.isSorting = false;
    var that = this;
    setTimeout(function () {
      if (that.currentSortActionIndex !== 0) {
        that.redrawArray();
      }
      that.performSort();
      that.isSorting = true;
      that.isPausing = false;
      setTimeout(that.playSortActions.bind(that, false), SHUFFLE_SPEED);
    }, SWAP_SPEED * 2);
    return;
  }
  if (this.currentSortActionIndex !== 0) {
    this.redrawArray();
  }
  this.performSort();
  this.isSorting = true;
  this.isPausing = false;
  setTimeout(this.playSortActions.bind(this, false), SHUFFLE_SPEED);
};

SortPane.prototype.onplayfinished = function () {
  this.isSorting = false;
};

SortPane.prototype.playSortActions = function (stepOnlyOnce) {
  this.isPausing = false;
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
    }, SWAP_SPEED * 3);
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
  barA.attr({fill: COMPARE_COLOR});
  barB.attr({fill: COMPARE_COLOR});
  setTimeout(function () {
    barA.attr({fill: BAR_COLOR});
    barB.attr({fill: BAR_COLOR});
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

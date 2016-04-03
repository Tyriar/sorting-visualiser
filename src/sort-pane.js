/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

var SortAction = require('./sort-action');

function SortPane(sortDefinition, array) {
  this.algorithm = sortDefinition.algorithm;
  this.snap = Snap(sortDefinition.svg);
  this.array = array.slice();

  this.createBars();
}

SortPane.prototype.setArray = function (array) {
  this.array = array;
  this.redrawArray();
}

SortPane.prototype.redrawArray = function () {
  // TOOD: Impl
}

SortPane.prototype.createBars = function () {
  this.bars = [];
  for (var i = 0; i < this.array.length; i++) {
    var x = 5 + i * 12; // 10 + 2 padding
    var width = 10;
    var height = this.array[i] * 6;
    var y = 125 - height;
    var bar = this.snap.rect(x, y, width, height);
    this.bars.push(bar);
  }
}

SortPane.prototype.play = function () {
  var sortActions = sort(this.array, this.bars, this.algorithm);
  function finishedPlayback() {

  }
  playSortActions(sortActions, this.bars, finishedPlayback);
};

function sort(data, dataRects, algorithm, customCompare) {
  var sortActions = [];
  algorithm.attachCompareObserver(function (data, a, b) {
    sortActions.push(new SortAction(a, b, SortAction.COMPARE));
  });
  algorithm.attachSwapObserver(function (array, a, b) {
    sortActions.push(new SortAction(a, b, SortAction.SWAP));
  });
  algorithm(data, customCompare);
  algorithm.detachCompareObserver();
  algorithm.detachSwapObserver();
  // Run sortActions over dataRects
  return sortActions;
}

function playSortActions(sortActions, dataRects, cb) {
  var SPEED = 20;
  if (sortActions.length === 0) {
    cb();
    return;
  }
  var action = sortActions.shift();
  if (action.isSwapAction()) {
    // Animate x values
    var temp = dataRects[action.a].getBBox().x;
    dataRects[action.a].animate({
      x: dataRects[action.b].getBBox().x
    }, SPEED);
    dataRects[action.b].animate({
      x: temp
    }, SPEED);
    // Swap indexes
    temp = dataRects[action.a];
    dataRects[action.a] = dataRects[action.b];
    dataRects[action.b] = temp;
  }
  if (action.isCompareAction()) {
    dataRects[action.a].attr({
      fill: "#e0544c"
    });
    dataRects[action.b].attr({
      fill: "#e0544c"
    });
  }

  setTimeout(function () {
    if (action.isCompareAction()) {
      dataRects[action.a].attr({
        fill: "#1e1e38"
      });
      dataRects[action.b].attr({
        fill: "#1e1e38"
      });
    }
    playSortActions(sortActions, dataRects, cb);
  }, SPEED * 2);
}

module.exports = SortPane;

'use strict';

var bubbleSort = require('js-sorting/lib/bubble-sort');
var cocktailSort = require('js-sorting/lib/cocktail-sort');
var combSort = require('js-sorting/lib/comb-sort');
var gnomeSort = require('js-sorting/lib/gnome-sort');
var heapsort = require('js-sorting/lib/heapsort');
var oddEvenSort = require('js-sorting/lib/odd-even-sort');
var quicksort = require('js-sorting/lib/quicksort');
var selectionSort = require('js-sorting/lib/selection-sort');

var s = Snap('#svg');

// Create dummy data
var data = [];
for (var i = 1; i <= 20; i++) {
  data.push(i);
}

// Shuffle
for (var j = 0; j < 100; j++) {
  var a = Math.floor(Math.random() * 20);
  var b = Math.floor(Math.random() * 20);
  if (a !== b) {
    var temp = data[a];
    data[a] = data[b];
    data[b] = temp;
  }
}

// Create data rectangles

function generateElementRectangles(array) {
  var rects = [];
  for (var i = 0; i < array.length; i++) {
    var x = 10 + i * 12; // 10 + 2 padding
    var width = 10;
    var height = array[i] * 5;
    var y = 200 - height;
    var rect = s.rect(x, y, width, height);
    rects.push(rect);
  }
  return rects
}
var dataRects = generateElementRectangles(data);

function sort(customCompare) {
  var sortActions = [];
  bubbleSort.attachSwapObserver(function (array, a, b) {
    sortActions.push(new SortAction(a, b, 'swap'));
  });
  bubbleSort.attachCompareObserver(function (data, a, b) {
    sortActions.push(new SortAction(a, b, 'compare'));
  });

  var originalList = data;
  var finalData = bubbleSort(data, customCompare);
  // Run sortActions over dataRects
  playSortActions(sortActions, dataRects);
}

function SortAction(a, b, type) {
  this.a = a;
  this.b = b;
  this.type = type;
}

function playSortActions(sortActions, dataRects) {
  var SPEED = 20;
  if (sortActions.length === 0) {
    return;
  }
  var action = sortActions.shift();
  if (action.type === 'swap') {
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
  if (action.type === 'compare') {
    dataRects[action.a].attr({
      fill: "#e0544c"
    });
    dataRects[action.b].attr({
      fill: "#e0544c"
    });
  }

  setTimeout(function () {
    if (action.type === 'compare') {
      dataRects[action.a].attr({
        fill: "#1e1e38"
      });
      dataRects[action.b].attr({
        fill: "#1e1e38"
      });
    }
    playSortActions(sortActions, dataRects);
  }, SPEED * 2);
}

function reverseCompare(a, b) {
  return b - a;
}

sort();

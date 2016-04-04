/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

var SortPane = require('./src/sort-pane');
var sortAlgorithms = require('./src/sort-algorithms');

var ARRAY_SIZE = 20;

var sortPanes = [];

function generateRandomArray() {
  var array = [];
  var i;
  for (i = 1; i <= ARRAY_SIZE; i++) {
    array.push(i);
  }
  for (i = 0; i < array.length; i++) {
    var j = Math.floor(Math.random() * ARRAY_SIZE);
    if (i !== j) {
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  return array;
}

function play() {
  sortPanes.forEach(function (pane) {
    pane.play();
  });
}

function pause() {
  sortPanes.forEach(function (pane) {
    pane.pause();
  });
}

function restart() {
  sortPanes.forEach(function (pane) {
    pane.restart();
  });
}

function stepForward() {
  sortPanes.forEach(function (pane) {
    pane.stepForward();
  });
}

function stepBack() {
  sortPanes.forEach(function (pane) {
    pane.stepBack();
  });
}

function shuffleArray() {
  var array = generateRandomArray();
  sortPanes.forEach(function (pane) {
    pane.setArray(array);
  });
}

function sortInReverseToggled() {
  sortPanes.forEach(function (pane) {
    pane.toggleSortDirection();
  });
}

function init(elements) {
  var initialArray = generateRandomArray();
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var algorithmName = element.getAttribute('data-algorithm');
    var algorithm = sortAlgorithms[algorithmName];
    element.id = 'sorting-visualiser-' + algorithmName;
    sortPanes.push(new SortPane(element, algorithm, initialArray));
  }
}

module.exports = {
  init: init,
  play: play,
  restart: restart,
  pause: pause,
  stepBack: stepBack,
  stepForward: stepForward,
  shuffleArray: shuffleArray,
  sortInReverseToggled: sortInReverseToggled
};

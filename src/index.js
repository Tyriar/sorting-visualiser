/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

var SortAction = require('./sort-action');
var SortPane = require('./sort-pane');
var sortAlgorithms = require('./sort-algorithms');

var ARRAY_SIZE = 20;

var sortPanes = [];

function generateRandomArray() {
  var array = [];
  for (var i = 1; i <= ARRAY_SIZE; i++) {
    array.push(i);
  }
  for (var i = 0; i < array.length; i++) {
    var j = Math.floor(Math.random() * ARRAY_SIZE);
    if (i !== j) {
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  return array;
}

function init() {
  var initialArray = generateRandomArray();
  var sortingVisualisers = document.querySelectorAll('.sorting-visualiser');
  for (var i = 0; i < sortingVisualisers.length; i++) {
    var element = sortingVisualisers[i];
    var algorithmName = element.getAttribute('data-algorithm');
    var algorithm = sortAlgorithms[algorithmName];
    element.id = 'sorting-visualiser-' + algorithmName;
    sortPanes.push(new SortPane(element, algorithm, initialArray));
  };
  return sortPanes;
}

module.exports = init;

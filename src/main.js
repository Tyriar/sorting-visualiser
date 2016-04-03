/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

var SortAction = require('./sort-action');
var SortPane = require('./sort-pane');
var sorts = require('./sort-definitions');

var ARRAY_SIZE = 20;

function initEventListeners() {
  document.querySelector('#play-all').addEventListener('click', playAll);
  document.querySelector('#shuffle-array').addEventListener('click', shuffleArray);
  document.querySelector('#sort-in-reverse').addEventListener('click', sortInReverseToggled);
}

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

function playAll() {
  sorts.forEach(function (sort) {
    sort.pane.play();
  });
}

function shuffleArray() {
  var array = generateRandomArray();
  sorts.forEach(function (sort) {
    sort.pane.setArray(array);
  });
}

function sortInReverseToggled() {
  sorts.forEach(function (sort) {
    sort.pane.toggleSortDirection();
  });
}

function init() {
  var initialArray = generateRandomArray();
  sorts.forEach(function (sort) {
    sort.pane = new SortPane(sort, initialArray);
  });
  initEventListeners();
}

init();

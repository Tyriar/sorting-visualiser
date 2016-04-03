/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

var sortingVisualiser = require('../src');

var sortPanes;

function initEventListeners() {
  document.querySelector('#play-all').addEventListener('click', playAll);
  document.querySelector('#shuffle-array').addEventListener('click', shuffleArray);
  document.querySelector('#sort-in-reverse').addEventListener('click', sortInReverseToggled);
}

function playAll() {
  sortPanes.forEach(function (pane) {
    pane.play();
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

function init() {
  sortPanes = sortingVisualiser();
  initEventListeners();
}

init();

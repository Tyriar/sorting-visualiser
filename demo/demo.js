/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

var sortingVisualiser = require('../');

var sortPanes;

function initEventListeners() {
  document.querySelector('#play').addEventListener('click', sortingVisualiser.play);
  document.querySelector('#restart').addEventListener('click', sortingVisualiser.restart);
  document.querySelector('#pause').addEventListener('click', sortingVisualiser.pause);
  document.querySelector('#step-back').addEventListener('click', sortingVisualiser.stepBack);
  document.querySelector('#step-forward').addEventListener('click', sortingVisualiser.stepForward);
  document.querySelector('#shuffle-array').addEventListener('click', sortingVisualiser.shuffleArray);
  document.querySelector('#toggle-sort-direction').addEventListener('click', sortingVisualiser.toggleSortDirection);
}

function init() {
  sortingVisualiser.init(document, document.querySelectorAll('.sorting-visualiser'));
  initEventListeners();
}

init();

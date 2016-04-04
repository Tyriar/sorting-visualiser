/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

var sortingVisualiser = require('../');

var sortPanes;

function initEventListeners() {
  document.querySelector('#play-all').addEventListener('click', sortingVisualiser.playAll);
  document.querySelector('#shuffle-array').addEventListener('click', sortingVisualiser.shuffleArray);
  document.querySelector('#sort-in-reverse').addEventListener('click', sortingVisualiser.sortInReverseToggled);
}

function init() {
  sortingVisualiser.init();
  initEventListeners();
}

init();

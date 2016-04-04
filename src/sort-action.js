/**
 * @license MIT Copyright 2016 Daniel Imms (http://www.growingwiththeweb.com)
 */
'use strict';

function SortAction(a, b, type) {
  this.a = a;
  this.b = b;
  this.type = type;
}

SortAction.COMPARE = 'compare';
SortAction.SWAP = 'swap';

SortAction.prototype.isCompareAction = function () {
  return this.type === SortAction.COMPARE;
};

SortAction.prototype.isSwapAction = function () {
  return this.type === SortAction.SWAP;
};

module.exports = SortAction;

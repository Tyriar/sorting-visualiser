var assert = require('assert');
var SortAction = require('../src/sort-action');

describe('SortAction', function () {
  it('should return isCompareAction correctly', () => {
    var action = new SortAction(null, null, SortAction.COMPARE);
    assert.ok(action.isCompareAction());
    assert.ok(!action.isSwapAction());
  });

  it('should return isSwapAction correctly', () => {
    var action = new SortAction(null, null, SortAction.SWAP);
    assert.ok(!action.isCompareAction());
    assert.ok(action.isSwapAction());
  });
});

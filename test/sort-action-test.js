import test from 'ava';
import SortAction from '../src/sort-action';

test('should return isCompareAction correctly', async t => {
  var action = new SortAction(null, null, SortAction.COMPARE);
  t.true(action.isCompareAction());
  t.false(action.isSwapAction());
});

test('should return isSwapAction correctly', async t => {
  var action = new SortAction(null, null, SortAction.SWAP);
  t.false(action.isCompareAction());
  t.true(action.isSwapAction());
});

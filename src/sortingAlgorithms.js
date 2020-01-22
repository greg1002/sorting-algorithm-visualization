import {UNSORTED_ARRAY_COLOR, SORTED_ARRAY_COLOR, VALUE_MOVED_ARRAY_COLOR, VALUE_ACCESSED_ARRAY_COLOR} from "./App.js";

/*
NOTE:
The goal of all of these function is to aid in the visualization of the sorting algorithms they represent.
As such, they aren't accurate to how that sorting algorithm would be used, and the accesses and comparisons
counter doesn't reflect the comparisons and accesses made in these functions, but rather, the that amount made
whenever these sorting algorithms are actually used.
*/
export const sort = function (array, sortType, sortState, steps) {
  resetColor(array);
  switch (sortType) {
    case "bubble":
      return bubbleSort(array, sortState, steps);
    case "insertion":
      return insertionSort(array, sortState, steps);
    case "selection":
      return selectionSort(array, sortState, steps);
    case "quick":
      return quickSort(array, sortState, steps);
    case "merge":
      return mergeSort(array, sortState, steps);
    case "radix":
      return radixSort(array, sortState, steps);
    default:
      return false;
  }
}

function resetColor(array) {
  array.forEach(element => {
    if (element.color !== SORTED_ARRAY_COLOR) element.color = UNSORTED_ARRAY_COLOR;
  });
}

/*
sortState:
- i: current index
- r: index from which to the right everything is exactly sorted
- rr: index from which to the right everything has the chance of being sorted
*/
function bubbleSort(array, sortState, steps) {
  if (sortState === null) {
    sortState = {
      i: 0,
      r: array.length - 1,
      rr: 0,
      accesses: 0,
      comparisons: 0,
      finished: false
    }
  }
  if (sortState.finished) return sortState;

  while (sortState.r !== 0) {
    if (steps === 0) break;

    sortState.comparisons++;
    if  (array[sortState.i].value > array[sortState.i + 1].value) {
      array[sortState.i].color = VALUE_MOVED_ARRAY_COLOR;
      array[sortState.i + 1].color = VALUE_MOVED_ARRAY_COLOR;
      [array[sortState.i], array[sortState.i + 1]] = [array[sortState.i + 1], array[sortState.i]];
      sortState.accesses += 2;
      steps--;
      sortState.rr = sortState.i + 1;
    } else {
      if (array[sortState.i].color !== VALUE_MOVED_ARRAY_COLOR) array[sortState.i].color = VALUE_ACCESSED_ARRAY_COLOR;
      if (array[sortState.i + 1].color !== VALUE_MOVED_ARRAY_COLOR) array[sortState.i + 1].color = VALUE_ACCESSED_ARRAY_COLOR;
    }
    sortState.i++;

    if (sortState.i >= sortState.r) {
      for (let i = sortState.rr; i <= sortState.r; i++) {
        array[i].color = SORTED_ARRAY_COLOR;
      }
      sortState.r = sortState.rr;
      sortState.rr = 0;
      sortState.i = 0;
    }
  }
  if (sortState.r === 0) sortState.finished = true;
  return sortState;
}

/*
sortState:
- i: current index
- r: index from which to the left everything is where new values are being inserted
*/
function insertionSort(array, sortState, steps) {
  if (sortState === null) {
    sortState = {
      i: 1,
      r: 1,
      accesses: 0,
      comparisons: 0,
      finished: false
    }
  }
  if (sortState.finished) return sortState;

  while(sortState.r !== array.length) {
    if (steps === 0) break;
    steps--;
    sortState.comparisons++;
    if (array[sortState.i].value > array[sortState.i - 1].value) {
      if (array[sortState.i].color !== VALUE_MOVED_ARRAY_COLOR) array[sortState.i].color = VALUE_ACCESSED_ARRAY_COLOR;
      sortState.i = ++sortState.r;
    } else {
      [array[sortState.i], array[sortState.i - 1]] = [array[sortState.i - 1], array[sortState.i]];
      array[sortState.i].color = VALUE_MOVED_ARRAY_COLOR;
      array[sortState.i - 1].color = VALUE_MOVED_ARRAY_COLOR;
      sortState.accesses += 2;
      sortState.i--;
    }
    if (sortState.i === 0) {
      sortState.i = ++sortState.r;
    }
  }

  if (sortState.r === array.length) {
    sortState.finished = true;
    array.forEach(element => {
      element.color = SORTED_ARRAY_COLOR;
    });
  }
  return sortState;
}

/*
sortState:
- i: current index
- r: index from which to the left everything is Sorted
- low: index of the lowest value right of r that has been detected
*/
function selectionSort(array, sortState, steps) {
  if (sortState === null) {
    sortState = {
      i: 0,
      r: 0,
      low: 0,
      accesses: 0,
      comparisons: 0,
      finished: false
    }
  }
  if (sortState.finished) return sortState;

  while (sortState.r !== array.length) {
    if (steps === 0) break;
    steps--;
    if (sortState.i === array.length) {
      [array[sortState.low], array[sortState.r]] = [array[sortState.r],array[sortState.low]];
      array[sortState.low].color = VALUE_MOVED_ARRAY_COLOR;
      array[sortState.r].color = SORTED_ARRAY_COLOR;
      sortState.accesses += 2;
      sortState.i = sortState.low = ++sortState.r;
    } else {
      sortState.comparisons++;
      if (array[sortState.i].color !== VALUE_MOVED_ARRAY_COLOR) array[sortState.i].color = VALUE_ACCESSED_ARRAY_COLOR;
      if (array[sortState.low].color !== VALUE_MOVED_ARRAY_COLOR) array[sortState.low].color = VALUE_ACCESSED_ARRAY_COLOR;
      if (array[sortState.i].value < array[sortState.low].value) {
        sortState.low = sortState.i;
      }
      sortState.i++;
    }

  }
  if (sortState.r === array.length) sortState.finished = true;
  return sortState;
}

/*
sortState:
splits: array of indexes that mark splits in partitions
pivot: pivot
j: current element
i: everything to left < pivot
*/
function quickSort(array, sortState, steps) {
  if (sortState === null) {
    sortState = {
      splits: [-1, array.length],
      pivot: array[array.length - 1].value,
      i: 0,
      j: 0,
      accesses: 0,
      comparisons: 0,
      finished: false
    }
  }
  if (sortState.finished) return sortState;

  while (sortState.splits.length !== 0) {
    if (steps === 0) break;
    steps--;

    if (sortState.j >= sortState.splits[1] - 1) {
      if (sortState.i === sortState.splits[1]) sortState.i--;
      const diff = sortState.splits[1] - sortState.splits[0];
      if (diff < 3) {
        if (diff > 1) array[sortState.splits[0] + 1].color = SORTED_ARRAY_COLOR;
        sortState.splits.splice(0, 1);
      } else {
        [array[sortState.i], array[sortState.splits[1] - 1]] = [array[sortState.splits[1] - 1], array[sortState.i]];
        array[sortState.splits[1] - 1].color = VALUE_MOVED_ARRAY_COLOR;
        array[sortState.i].color = SORTED_ARRAY_COLOR;
        sortState.accesses += 2;
        if (sortState.i !== 0) {
          sortState.splits.splice(1, 0, sortState.i);
        } else if (array[sortState.i] == array[sortState.splits[1]]){
          sortState.splits.splice(1, 0, sortState.splits[1] - 1)
        }
      }
      if (sortState.splits.length <= 1) break;
      sortState.pivot = array[sortState.splits[1] - 1].value;
      sortState.j = sortState.i = sortState.splits[0] + 1;
      continue;
    }

    sortState.comparisons++;
    if (array[sortState.j].color !== VALUE_MOVED_ARRAY_COLOR) array[sortState.j].color = VALUE_ACCESSED_ARRAY_COLOR;
    array[sortState.splits[1] - 1].color = VALUE_ACCESSED_ARRAY_COLOR;
    if (array[sortState.j].value <= sortState.pivot) {
      [array[sortState.i], array[sortState.j]] = [array[sortState.j], array[sortState.i]];
      sortState.accesses += 2;
      array[sortState.j].color = array[sortState.i].color = VALUE_MOVED_ARRAY_COLOR;
      sortState.i++;
    }
    sortState.j++;
  }

  if (sortState.splits.length <= 1) sortState.finished = true;
  return sortState;
}

/*
sortState:
n: current partition Size
i: current index
l: temp array of left partition
r: temp array of right partition
*/
function mergeSort (array, sortState, steps) {
  if (sortState === null) {
    sortState = {
      n: 2,
      i: 0,
      l: [],
      r: [],
      accesses: 0,
      comparisons: 0,
      finished: false
    }
  }
  if (sortState.finished) return sortState;

  while (sortState.n < array.length * 2) {
    if (steps === 0) break;
    steps--;

    if (sortState.i === array.length) {
      sortState.n *= 2;
      sortState.i = 0;
    }
    if (sortState.i % sortState.n === 0) {
      sortState.accesses += sortState.n;
      sortState.l = array.slice(sortState.i, sortState.i + sortState.n / 2).map(item => item.value);
      sortState.r = array.slice(sortState.i + sortState.n / 2, Math.min(array.length, sortState.i + sortState.n)).map(item => item.value);
    }

    sortState.comparisons++;
    sortState.accesses++;
    if (sortState.l.length > 0 && sortState.r.length > 0) {
      if (sortState.l[0] < sortState.r[0]) {
        array[sortState.i].value = sortState.l[0]
        sortState.l.shift();
      } else {
        array[sortState.i].value = sortState.r[0]
        sortState.r.shift();
      }
    } else if (sortState.l.length > 0) {
      array[sortState.i].value = sortState.l[0]
      sortState.l.shift();
    } else {
      array[sortState.i].value = sortState.r[0]
      sortState.r.shift();
    }
    if (sortState.n >= array.length) {
      array[sortState.i].color = SORTED_ARRAY_COLOR;
    } else {
      array[sortState.i].color = VALUE_MOVED_ARRAY_COLOR;
    }
    sortState.i++;

  }

  if (sortState.n >= array.length * 2) sortState.finished = true;
  return sortState;
}

/*
sortState:

*/
function radixSort(array, sortState, steps) {
  if (sortState === null) {
    sortState = {
      l: 0,
      r: array.length,
      n: 2,
      accesses: 0,
      comparisons: 0,
      finished: false
    }
  }

  while (sortState.n < array.length * 2) {
    if (steps === 0) break;
    steps--;

    if (sortState.r <= sortState.l) {
      sortState.l = 0;
      sortState.r = array.length;
      sortState.n *= 2;
    }

    if (array[sortState.l].value % sortState.n < sortState.n / 2) {
      if (sortState.n > array.length) array[sortState.l].color = SORTED_ARRAY_COLOR;
      else array[sortState.l].color = VALUE_ACCESSED_ARRAY_COLOR;
      sortState.l++;
    } else {
      if (sortState.n > array.length) array[sortState.l].color = SORTED_ARRAY_COLOR;
      else array[sortState.l].color = VALUE_MOVED_ARRAY_COLOR;
      array.push(array[sortState.l]);
      array.splice(sortState.l, 1);
      sortState.r--;
      sortState.accesses += array.length - sortState.l;
    }
  }

  if (sortState.n >= array.length * 2) {
    sortState.finished = true;
    array.forEach(element => element.color = SORTED_ARRAY_COLOR);
  }
  return sortState;
}

const top = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

// Priority Queue class
class PriorityQueue {
  private _heap;
  private _comparator;
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size(): number {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top;
    while ((left(node) < this.size() && this._greater(left(node), node)) || (right(node) < this.size() && this._greater(right(node), node))) {
      const maxChild = right(node) < this.size() && this._greater(right(node), left(node)) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

const comparator = (a, b) => {
  if (a[1] === b[1]) {
    return a[2] > b[2];
  }
  return a[1] < b[1];
};

export const tobQueue = new PriorityQueue(comparator);

export function removeFromPriorityQueue(requestId: string) {
  const elements = [];
  while (tobQueue.size() !== 0) {
    elements.push(tobQueue.pop());
  }
  elements.forEach(el => {
    // If the element doesn't have the same requestID as the one we are removing, reinsert
    if (el[0] !== requestId) {
      tobQueue.push(el);
    }
  });
}

export function clearPriorityQueue() {
  while (tobQueue.size() !== 0) {
    tobQueue.pop();
  }
}

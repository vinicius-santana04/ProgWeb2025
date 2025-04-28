class IntegerSet {
    constructor(maxValue) {
      this.maxValue = maxValue;
      this.values = new Array(maxValue + 1).fill(false);
    }
  
    insert(element) {
      if (this._isValid(element)) this.values[element] = true;
    }
  
    remove(element) {
      if (this._isValid(element)) this.values[element] = false;
    }
  
    union(otherSet) {
      const max = Math.max(this.maxValue, otherSet.maxValue);
      const result = new IntegerSet(max);
      for (let i = 0; i <= max; i++) {
        result.values[i] = (this.values[i] || false) || (otherSet.values[i] || false);
      }
      return result;
    }
  
    intersection(otherSet) {
      const max = Math.max(this.maxValue, otherSet.maxValue);
      const result = new IntegerSet(max);
      for (let i = 0; i <= max; i++) {
        result.values[i] = (this.values[i] || false) && (otherSet.values[i] || false);
      }
      return result;
    }
  
    difference(otherSet) {
      const max = Math.max(this.maxValue, otherSet.maxValue);
      const result = new IntegerSet(max);
      for (let i = 0; i <= max; i++) {
        result.values[i] = (this.values[i] || false) && !(otherSet.values[i] || false);
      }
      return result;
    }
  
    toString() {
      return this.values
        .map((v, i) => (v ? i : null))
        .filter(v => v !== null)
        .join(", ") || "(conjunto vazio)";
    }
  
    _isValid(element) {
      return element >= 0 && element <= this.maxValue;
    }
  }
  
  // Aplicação de teste
  const output = document.getElementById('output');
  
  const setA = new IntegerSet(10);
  setA.insert(1);
  setA.insert(3);
  setA.insert(5);
  
  const setB = new IntegerSet(10);
  setB.insert(3);
  setB.insert(4);
  setB.insert(5);
  setB.insert(9);
  
  const unionSet = setA.union(setB);
  const intersectionSet = setA.intersection(setB);
  const differenceSet = setA.difference(setB);
  
  output.innerText = `
  Conjunto A: ${setA.toString()}
  Conjunto B: ${setB.toString()}
  
  União: ${unionSet.toString()}
  Interseção: ${intersectionSet.toString()}
  Diferença (A - B): ${differenceSet.toString()}
  `; 
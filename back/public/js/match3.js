const crypto = window.crypto || window.msCrypto;

function getRandomValue(max) {
  const byteArray = new Uint8Array(1);
  crypto.getRandomValues(byteArray);

  const range = max - 1;
  const max_range = 256;
  if (byteArray[0] >= Math.floor(max_range / range) * range) {
    return getRandomValue(max);
  }
  return byteArray[0] % range;
}

const extraMatches = [
  {
    type: 'proton',
    combination: 'uud',
  },
  {
    type: 'neutron',
    combination: 'udd',
  },
  // lambda: ['u', 'd', 's',],
  // charmedLambda: ['u', 'd', 'c',],
  // bottomLambda: ['u', 'd', 'b',],
  // sigma: ['u', 'u', 's',],
  // sigma: ['u', 'd', 's',],
  // sigma: ['d', 'd', 's',],
  // charmedSigma: ['u', 'u', 'c',],
  // charmedSigma: ['u', 'd', 'c',],
  // charmedSigma: ['d', 'd', 'c',],
  // bottomSigma: ['u', 'u', 'b',],
  // bottomSigma: ['u', 'd', 'b',],
  // bottomSigma: ['d', 'd', 'b',],
  // xi: ['u', 's', 's',],
  // xi: ['d', 's', 's',],
  // charmedXi: ['u', 's', 'c',],
  // charmedXi: ['d', 's', 'c',],
  // charmedXiPrime: ['u', 's', 'c',],
  // charmedXiPrime: ['d', 's', 'c',],
  // doubleCharmedXi: ['u', 'c', 'c',],
  // doubleCharmedXi: ['d', 'c', 'c',],
  // bottomXi: ['u', 's', 'b',],
  // bottomXi: ['d', 's', 'b',],
  // bottomXiPrime: ['u', 's', 'b',],
  // bottomXiPrime: ['d', 's', 'b',],
  // doubleBottomXi: ['u', 'b', 'b',],
  // doublebottomXi: ['d', 'b', 'b',],
  // charmedBottomXi: ['u', 'c', 'b',],
  // charmedBottomXi: ['d', 'c', 'b',],
  // charmedBottomXiPrime: ['u', 'c', 'b',],
  // charmedBottomXiPrime: ['d', 'c', 'b',],
  // charmedOmega: ['s', 's', 'c',],
  // bottomOmega: ['s', 's', 'b',],
  // doubleCharmedOmega: ['s', 'c', 'c',],
  // charmedBottomOmega: ['s', 'c', 'b',],
  // charmedBottomOmegaPrime: ['s', 'c', 'b',],
  // doubleBottomOmega: ['s', 'b', 'b',],
  // doubleCharmedBottomOmega: ['c', 'c', 'b',],
  // charmedDoubleBottomOmega: ['c', 'b', 'b']
];

const quarks = ['u', 'c', 't', 'd', 's', 'b'];


class Match3 {
  // constructor, simply turns obj information into class properties
  constructor(obj) {
    this.rows = obj.rows;
    this.columns = obj.columns;
    this.items = obj.items;
  }

  // generates the game field
  generateField() {
    this.gameArray = [];
    this.selectedItem = false;
    for (let i = 0; i < this.rows; i++) {
      this.gameArray[i] = [];
      for (let j = 0; j < this.columns; j++) {
        do {
          let randomValue = getRandomValue(this.items);
          this.gameArray[i][j] = {
            value: randomValue,
            quark: quarks[randomValue],
            isEmpty: false,
            row: i,
            column: j
          }
        } while (this.isPartOfMatch(i, j));
      }
    }
  }

  // TODO: return the list of possible moves and rearrange field if it's empty
  possibleMoves() {
    const result = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.isPartOfMatch(i, j)) {
          return true;
        }
      }
    }
    console.log('[!] result ', result);
    return true;
  }

  // returns true if there is a match in the board
  matchInBoard() {
    this.possibleMoves();
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.isPartOfMatch(i, j)) {
          return true;
        }
      }
    }
    return false;
  }

  // returns true if there is a match in the board
  baryonInBoard() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.isBaryon(i, j)) {
          return true;
        }
      }
    }
    return false;
  }

  // returns true if the item at (row, column) is part of a match
  isPartOfMatch(row, column) {
    return this.isPartOfHorizontalMatch(row, column)
      || this.isPartOfVerticalMatch(row, column)
      || this.isPartOfSquareMatch(row, column);
  }

  // returns true if the item at (row, column) is part of an horizontal match
  isPartOfHorizontalMatch(row, column) {
    return this.valueAt(row, column) === this.valueAt(row, column - 1) && this.valueAt(row, column) === this.valueAt(row, column - 2) ||
      this.valueAt(row, column) === this.valueAt(row, column + 1) && this.valueAt(row, column) === this.valueAt(row, column + 2) ||
      this.valueAt(row, column) === this.valueAt(row, column - 1) && this.valueAt(row, column) === this.valueAt(row, column + 1);
  }

  // returns true if the item at (row, column) is part of an horizontal match
  isPartOfVerticalMatch(row, column) {
    return this.valueAt(row, column) === this.valueAt(row - 1, column) && this.valueAt(row, column) === this.valueAt(row - 2, column) ||
      this.valueAt(row, column) === this.valueAt(row + 1, column) && this.valueAt(row, column) === this.valueAt(row + 2, column) ||
      this.valueAt(row, column) === this.valueAt(row - 1, column) && this.valueAt(row, column) === this.valueAt(row + 1, column);
  }

  // returns true if the item at (row, column) is part of an horizontal match
  isPartOfSquareMatch(row, column) {
    return this.valueAt(row, column) === this.valueAt(row - 1, column)
      && this.valueAt(row, column) === this.valueAt(row - 1, column - 1)
      && this.valueAt(row, column) === this.valueAt(row, column - 1)
      || this.valueAt(row, column) === this.valueAt(row + 1, column)
      && this.valueAt(row, column) === this.valueAt(row + 1, column + 1)
      && this.valueAt(row, column) === this.valueAt(row, column + 1)
      || this.valueAt(row, column) === this.valueAt(row - 1, column)
      && this.valueAt(row, column) === this.valueAt(row - 1, column + 1)
      && this.valueAt(row, column) === this.valueAt(row, column + 1)
      || this.valueAt(row, column) === this.valueAt(row + 1, column)
      && this.valueAt(row, column) === this.valueAt(row + 1, column - 1)
      && this.valueAt(row, column) === this.valueAt(row, column - 1)
  }

  // returns true if the item at (row, column) is part of an horizontal match
  isBaryon(row, column) {
    const vals = {
      columns: {},
      rows: {},
    };
    vals.columns['-1-2'] = this.quarkAt(row, column) + this.quarkAt(row, column - 1) + this.quarkAt(row, column - 2);
    vals.columns['+1+2'] = this.quarkAt(row, column) + this.quarkAt(row, column + 1) + this.quarkAt(row, column + 2);
    vals.columns['-1+1'] = this.quarkAt(row, column) + this.quarkAt(row, column - 1) + this.quarkAt(row, column + 1);
    vals.rows['-1-2'] = this.quarkAt(row, column) + this.quarkAt(row - 1, column) + this.quarkAt(row - 2, column);
    vals.rows['+1+2'] = this.quarkAt(row, column) + this.quarkAt(row + 1, column) + this.quarkAt(row + 2, column);
    vals.rows['-1+1'] = this.quarkAt(row, column) + this.quarkAt(row - 1, column) + this.quarkAt(row + 1, column);

    let result = Object.values(vals.columns)
      .findIndex(item => extraMatches.map(match => match.combination).includes(item));
    if (result >= 0) {
      return {
        direction: 'rows',
        type: extraMatches.find(item => item.combination === Object.values(vals.columns)[result]).type,
        offset1: Number(Object.keys(vals.columns)[result].slice(0, 2)),
        offset2: Number(Object.keys(vals.columns)[result].slice(2, 4)),
      };
    }
    result = Object.values(vals.rows).findIndex(item => Object.values(extraMatches).includes(item));
    if (result >= 0) {
      return {
        direction: 'columns',
        type: extraMatches.find(item => item.combination === Object.values(vals.rows)[result]).type,
        offset1: Number(Object.keys(vals.rows)[result].slice(0, 2)),
        offset2: Number(Object.keys(vals.rows)[result].slice(2, 4)),
      };
    }
    return false;
  }

  // returns the value of the item at (row, column), or false if it's not a valid pick
  valueAt(row, column) {
    if (!this.validPick(row, column)) {
      return false;
    }
    return this.gameArray[row][column].value;
  }

  // returns the value of the item at (row, column), or false if it's not a valid pick
  quarkAt(row, column) {
    if (!this.validPick(row, column)) {
      return ' ';
    }
    return this.gameArray[row][column].quark;
  }

  // returns true if the item at (row, column) is a valid pick
  validPick(row, column) {
    return row >= 0
      && row < this.rows
      && column >= 0
      && column < this.columns
      && this.gameArray[row] !== undefined
      && this.gameArray[row][column] !== undefined;
  }

  // returns the number of board rows
  getRows() {
    return this.rows;
  }

  // returns the number of board columns
  getColumns() {
    return this.columns;
  }

  // sets a custom data on the item at (row, column)
  setCustomData(row, column, customData) {
    this.gameArray[row][column].customData = customData;
  }

  setValue(row, column, value) {
    this.gameArray[row][column].value = value;
  }

  // returns the custom data of the item at (row, column)
  customDataOf(row, column) {
    if (typeof row === 'undefined') {
      throw new Error('[!] Row is not defined at row: ', row, ' col ', column);
    }
    if (typeof column === 'undefined') {
      throw new Error('[!] Column is not defined at row: ', row, ' col ', column);
    }
    return this.gameArray[row][column].customData;
  }

  // returns the selected item
  getSelectedItem() {
    return this.selectedItem;
  }

  // set the selected item as a {row, column} object
  setSelectedItem(row, column) {
    this.selectedItem = {
      row: row,
      column: column
    }
  }

  // deleselects any item
  deleselectItem() {
    this.selectedItem = false;
  }

  // checks if the item at (row, column) is the same as the item at (row2, column2)
  areTheSame(row, column, row2, column2) {
    return row === row2 && column === column2;
  }

  // returns true if two items at (row, column) and (row2, column2) are next to each other horizontally or vertically
  areNext(row, column, row2, column2) {
    return Math.abs(row - row2) + Math.abs(column - column2) === 1;
  }

  // swap the items at (row, column) and (row2, column2) and returns an object with movement information
  swapItems(row, column, row2, column2) {
    let tempObject = Object.assign(this.gameArray[row][column]);
    this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
    this.gameArray[row2][column2] = Object.assign(tempObject);
    return [{
      row: row,
      column: column,
      deltaRow: row - row2,
      deltaColumn: column - column2
    },
      {
        row: row2,
        column: column2,
        deltaRow: row2 - row,
        deltaColumn: column2 - column
      }]
  }

  // return the items part of a match in the board as an array of {row, column} object
  getMatchList() {
    let matches = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.isPartOfMatch(i, j)) {
          matches.push({
            row: i,
            column: j
          });
        }
      }
    }
    return matches;
  }

  // return the items part of a match in the board as an array of {row, column} object
  getCombinationList() {
    const adrons = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const adron = this.isBaryon(i, j);
        if (adron) {
          adrons.push({ ...adron, i, j });
          console.log('[!] adron ', adron, ' at row ', i, ' and column ', j);
          console.log(
            '[!] set empty at ',
            Number(i) + adron.direction === 'rows' ? Number(adron.offset1) : 0,
            Number(j) + adron.direction === 'columns' ? Number(adron.offset1) : 0
          );
          this.setEmpty(
            Number(i) + adron.direction === 'rows' ? Number(adron.offset1) : 0,
            Number(j) + adron.direction === 'columns' ? Number(adron.offset1) : 0
          );
          console.log(
            '[!] set empty at ',
            i + adron.direction === 'rows' ? adron.offset2 : 0,
            j + adron.direction === 'columns' ? adron.offset2 : 0
          );
          this.setEmpty(
            i + adron.direction === 'rows' ? adron.offset2 : 0,
            j + adron.direction === 'columns' ? adron.offset2 : 0
          );
          console.log('[!] set value 7 at', i, j);
          this.setValue(i, j, 7);
          // TODO: set empty to offset gems
          // TODO: replace origin gem with extra gem
          // this.setEmpty(i, j);
          // if ()
          // this.setEmpty(i, j);


        }
      }
    }
    return adrons;
  }

  // removes all items forming a match
  removeMatches() {
    let matches = this.getMatchList();
    matches.forEach(function (item) {
      this.setEmpty(item.row, item.column)
    }.bind(this))
  }

  // set the item at (row, column) as empty
  setEmpty(row, column) {
    this.gameArray[row][column].isEmpty = true;
  }

  // returns true if the item at (row, column) is empty
  isEmpty(row, column) {
    return this.gameArray[row][column].isEmpty;
  }

  // returns the amount of empty spaces below the item at (row, column)
  emptySpacesBelow(row, column) {
    let result = 0;
    if (row != this.getRows()) {
      for (let i = row + 1; i < this.getRows(); i++) {
        if (this.isEmpty(i, column)) {
          result++;
        }
      }
    }
    return result;
  }

  // arranges the board after a match, making items fall down. Returns an object with movement information
  arrangeBoardAfterMatch() {
    let result = []
    for (let i = this.getRows() - 2; i >= 0; i--) {
      for (let j = 0; j < this.getColumns(); j++) {
        let emptySpaces = this.emptySpacesBelow(i, j);
        if (!this.isEmpty(i, j) && emptySpaces > 0) {
          this.swapItems(i, j, i + emptySpaces, j)
          result.push({
            row: i + emptySpaces,
            column: j,
            deltaRow: emptySpaces,
            deltaColumn: 0
          });
        }
      }
    }
    return result;
  }

  // replenished the board and returns an object with movement information
  replenishBoard() {
    let result = [];
    for (let i = 0; i < this.getColumns(); i++) {
      if (this.isEmpty(0, i)) {
        let emptySpaces = this.emptySpacesBelow(0, i) + 1;
        for (let j = 0; j < emptySpaces; j++) {
          let randomValue = getRandomValue(this.items);
          result.push({
            row: j,
            column: i,
            deltaRow: emptySpaces,
            deltaColumn: 0
          });
          this.gameArray[j][i].value = randomValue;
          this.gameArray[j][i].isEmpty = false;
        }
      }
    }
    return result;
  }
}

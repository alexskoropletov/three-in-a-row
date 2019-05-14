class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    this.score = 0;
  }

  preload() {
    this.load.spritesheet("gems", "images/quarks100x100.png", {
      frameWidth: gameOptions.gemSize,
      frameHeight: gameOptions.gemSize
    });
  }

  create() {
    this.match3 = new Match3(gameOptions.fieldOptions);
    this.match3.generateField();
    let possibleMoves = this.match3.possibleMoves();
    while (!possibleMoves.length) {
      this.match3.generateField();
      possibleMoves = this.match3.possibleMoves();
    }
    this.canPick = true;
    this.dragging = false;
    this.drawField();
    this.input.on("pointerdown", this.gemSelect, this);
    this.input.on("pointermove", this.startSwipe, this);
    this.input.on("pointerup", this.stopSwipe, this);
  }

  drawField() {
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: '28px', fill: '#fff' });
    this.poolArray = [];
    for (let row = 0; row < this.match3.getRows(); row++) {
      for (let column = 0; column < this.match3.getColumns(); column++) {
        let gemX = gameOptions.boardOffset.x + gameOptions.gemSize * column + gameOptions.gemSize / 2;
        let gemY = gameOptions.boardOffset.y + gameOptions.gemSize * row + gameOptions.gemSize / 2;
        let gem = this.add.sprite(gemX, gemY, "gems", this.match3.valueAt(row, column));
        this.match3.setCustomData(row, column, gem);
      }
    }
  }

  gemSelect(pointer) {
    if (this.canPick) {
      this.dragging = true;
      let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
      let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
      if (this.match3.validPick(row, col)) {
        let selectedGem = this.match3.getSelectedItem();
        if (!selectedGem) {
          this.match3.customDataOf(row, col).setScale(1.2);
          this.match3.customDataOf(row, col).setDepth(1);
          this.match3.setSelectedItem(row, col);
        } else {
          if (this.match3.areTheSame(row, col, selectedGem.row, selectedGem.column)) {
            this.match3.customDataOf(row, col).setScale(1);
            this.match3.deleselectItem();
          } else {
            if (this.match3.areNext(row, col, selectedGem.row, selectedGem.column)) {
              this.match3.customDataOf(selectedGem.row, selectedGem.column).setScale(1);
              this.match3.deleselectItem();
              this.swapGems(row, col, selectedGem.row, selectedGem.column, true);
            } else {
              this.match3.customDataOf(selectedGem.row, selectedGem.column).setScale(1);
              this.match3.customDataOf(row, col).setScale(1.2);
              this.match3.setSelectedItem(row, col);
            }
          }
        }
      }
    }
  }

  swapGems(row, col, row2, col2, swapBack) {
    let movements = this.match3.swapItems(row, col, row2, col2);
    this.swappingGems = 2;
    this.canPick = false;
    movements.forEach((movement) => {
      this.tweens.add({
        targets: this.match3.customDataOf(movement.row, movement.column),
        x: this.match3.customDataOf(movement.row, movement.column).x + gameOptions.gemSize * movement.deltaColumn,
        y: this.match3.customDataOf(movement.row, movement.column).y + gameOptions.gemSize * movement.deltaRow,
        duration: gameOptions.swapSpeed,
        callbackScope: this,
        onComplete: () => {
          this.swappingGems--;
          if (this.swappingGems === 0) {
            const isMatch = this.match3.matchInBoard();
            const isBaryon = this.match3.baryonInBoard();
            if (!isMatch && !isBaryon) {
              if (swapBack) {
                this.swapGems(row, col, row2, col2, false);
              } else {
                this.canPick = true;
              }
            } else {
              if (isMatch) {
                this.handleMatches();
              } else {
                // const adrons = this.match3.getCombinationList();
                // const customDataOf = this.match3.customDataOf;
                // const makeGemsFall = this.makeGemsFall;
                // adrons.forEach((adron) => {
                //   console.log('[!] adron: ', adron);
                //   // this.poolArray.push(this.match3.customDataOf(
                //   //   Number(adron.i) + adron.direction === 'rows' ? Number(adron.offset1) : 0,
                //   //   Number(adron.j) + adron.direction === 'columns' ? Number(adron.offset1) : 0
                //   // ));
                //   // this.poolArray.push(this.match3.customDataOf(
                //   //   adron.i + adron.direction === 'rows' ? adron.offset2 : 0,
                //   //   adron.j + adron.direction === 'columns' ? adron.offset2 : 0
                //   // ));
                //   // this.tweens.add({
                //   //   targets: this.match3.customDataOf(
                //   //     Number(adron.i) + adron.direction === 'rows' ? Number(adron.offset1) : 0,
                //   //     Number(adron.j) + adron.direction === 'columns' ? Number(adron.offset1) : 0
                //   //   ),
                //   //   alpha: 0,
                //   //   duration: gameOptions.destroySpeed,
                //   //   callbackScope: this,
                //   //   onComplete: () => this.makeGemsFall
                //   // });
                //   // this.tweens.add({
                //   //   targets: this.match3.customDataOf(
                //   //     Number(adron.i) + adron.direction === 'rows' ? Number(adron.offset2) : 0,
                //   //     Number(adron.j) + adron.direction === 'columns' ? Number(adron.offset2) : 0
                //   //   ),
                //   //   alpha: 0,
                //   //   duration: gameOptions.destroySpeed,
                //   //   callbackScope: this,
                //   //   onComplete: () => this.makeGemsFall
                //   // });
                // }).bind(this);
              }
            }
          }
        }
      })
    });
  }


  startSwipe(pointer) {
    const selectedGem = this.match3.getSelectedItem();
    if (this.dragging && selectedGem) {
      let deltaX = pointer.downX - pointer.x;
      let deltaY = pointer.downY - pointer.y;
      let deltaRow = 0;
      let deltaCol = 0;
      if (deltaX > gameOptions.gemSize / 2 && Math.abs(deltaY) < gameOptions.gemSize / 4) {
        deltaCol = -1;
      }
      if (deltaX < -gameOptions.gemSize / 2 && Math.abs(deltaY) < gameOptions.gemSize / 4) {
        deltaCol = 1;
      }
      if (deltaY > gameOptions.gemSize / 2 && Math.abs(deltaX) < gameOptions.gemSize / 4) {
        deltaRow = -1;
      }
      if (deltaY < -gameOptions.gemSize / 2 && Math.abs(deltaX) < gameOptions.gemSize / 4) {
        deltaRow = 1;
      }
      if (deltaRow + deltaCol !== 0) {
        let pickedGem = this.match3.valueAt(selectedGem.row + deltaRow, selectedGem.column + deltaCol);
        if (pickedGem !== -1) {
          this.match3.customDataOf(selectedGem.row, selectedGem.column).setScale(1);
          this.swapGems(
            selectedGem.row + deltaRow,
            selectedGem.column + deltaCol,
            selectedGem.row,
            selectedGem.column,
            true
          );
          this.dragging = false;
        }
      }
    }
  }

  stopSwipe() {
    this.dragging = false;
  }

  areTheSame(gem1, gem2) {
    return gem1.row === gem2.row && gem1.column == gem2.column;
  }

  areNext(gem1, gem2) {
    return Math.abs(gem1.row - gem2.row) + Math.abs(gem1.column - gem2.column) === 1;
  }

  incrementScore(increment = 1) {
    this.score += increment;
    this.scoreText.setText('Score: ' + this.score);
  }

  handleMatches() {
    let gemsToRemove = this.match3.getMatchList();
    let destroyed = 0;
    gemsToRemove.forEach((gem) => {
      this.poolArray.push(this.match3.customDataOf(gem.row, gem.column));
      destroyed++;
      this.incrementScore();
      this.tweens.add({
        targets: this.match3.customDataOf(gem.row, gem.column),
        alpha: 0,
        duration: gameOptions.destroySpeed,
        callbackScope: this,
        onComplete: () => {
          destroyed--;
          if (destroyed === 0) {
            this.makeGemsFall();
          }
        },
      });
    });
  }

  handleReset() {
    let gemsToRemove = this.match3.getAllGems();
    let destroyed = 0;
    gemsToRemove.forEach((gem) => {
      this.poolArray.push(this.match3.customDataOf(gem.row, gem.column));
      destroyed++;
      this.tweens.add({
        targets: this.match3.customDataOf(gem.row, gem.column),
        alpha: 0,
        duration: gameOptions.destroySpeed,
        callbackScope: this,
        onComplete: () => {
          destroyed--;
          if (destroyed === 0) {
            this.makeGemsFall(true);
          }
        },
      });
    });
  }

  makeGemsFall(all = false) {
    let moved = 0;
    this.match3.removeMatches(all);
    let fallingMovements = this.match3.arrangeBoardAfterMatch();
    fallingMovements.forEach((movement) => {
      moved++;
      this.tweens.add({
        targets: this.match3.customDataOf(movement.row, movement.column),
        y: this.match3.customDataOf(movement.row, movement.column).y + movement.deltaRow * gameOptions.gemSize,
        duration: gameOptions.fallSpeed * Math.abs(movement.deltaRow),
        callbackScope: this,
        onComplete: () => {
          moved--;
          if (!moved) {
            this.endOfMove()
          }
        }
      })
    });
    let replenishMovements = this.match3.replenishBoard();
    replenishMovements.forEach((movement) => {
      moved++;
      let sprite = this.poolArray.pop();
      sprite.alpha = 1;
      sprite.y = gameOptions.boardOffset.y + gameOptions.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions.gemSize / 2;
      sprite.x = gameOptions.boardOffset.x + gameOptions.gemSize * movement.column + gameOptions.gemSize / 2;
      sprite.setFrame(this.match3.valueAt(movement.row, movement.column));
      this.match3.setCustomData(movement.row, movement.column, sprite);
      this.tweens.add({
        targets: sprite,
        y: gameOptions.boardOffset.y + gameOptions.gemSize * movement.row + gameOptions.gemSize / 2,
        duration: gameOptions.fallSpeed * movement.deltaRow,
        callbackScope: this,
        onComplete: () => {
          moved--;
          if (!moved) {
            this.endOfMove()
          }
        }
      });
    });
  }

  endOfMove() {
    if (this.match3.matchInBoard()) {
      this.time.addEvent({
        delay: 250,
        callback: this.handleMatches()
      });
    } else {
      this.canPick = true;
      this.selectedGem = null;
      if(!this.match3.possibleMoves().length) {
        this.handleReset();
      }
    }
  }
}

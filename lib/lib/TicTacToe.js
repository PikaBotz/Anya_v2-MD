class TicTacToe {
  /**
   * @param {string} playerX - Name or symbol of player X.
   * @param {string} playerO - Name or symbol of player O.
   */
  constructor(playerX = "x", playerO = "o") {
    this.playerX = playerX;
    this.playerO = playerO;
    this._currentTurn = false;
    this._x = 0;
    this._o = 0;
    this.turns = 0;
  }

  /**
   * Get the board state (combined X and O positions).
   * @returns {number} - Binary representation of the board.
   */
  get board() {
    return this._x | this._o;
  }

  /**
   * Get the player whose turn it currently is.
   * @returns {string} - Player X or O based on the current turn.
   */
  get currentTurn() {
    return this._currentTurn ? this.playerO : this.playerX;
  }

  /**
   * Get the enemy player's turn.
   * @returns {string} - Enemy player, opposite of currentTurn.
   */
  get enemyTurn() {
    return this._currentTurn ? this.playerX : this.playerO;
  }

  /**
   * Check if the given board state has a winning combination.
   * @param {number} state - Binary representation of a player's board.
   * @returns {boolean} - True if a winning combination is found.
   */
  static check(state) {
    const winningCombos = [7, 56, 73, 84, 146, 273, 292, 448];
    for (let combo of winningCombos) {
      if ((state & combo) === combo) return true;
    }
    return false;
  }

  /**
   * Convert X, Y coordinates into a binary position.
   * @param {number} x - X coordinate (0-2).
   * @param {number} y - Y coordinate (0-2).
   * @returns {number} - Binary representation of the position.
   * @throws {Error} - Throws error if coordinates are invalid.
   */
  static toBinary(x = 0, y = 0) {
    if (x < 0 || x > 2 || y < 0 || y > 2) throw new Error("invalid position");
    return 1 << (x + 3 * y);
  }

  /**
   * Perform a turn for the given player at position (x, y).
   * @param {number} player - Player (0 for X, 1 for O).
   * @param {number} x - X coordinate or flat index.
   * @param {number} [y] - Y coordinate (optional).
   * @returns {number} - Turn status (1: success, 0: position taken, -1: invalid, -2: wrong turn, -3: board full).
   */
  turn(player = 0, x = 0, y) {
    if (this.board === 511) return -3; // Board full
    let pos = 0;

    if (y === null || y === undefined) {
      if (x < 0 || x > 8) return -1; // Invalid position
      pos = 1 << x;
    } else {
      if (x < 0 || x > 2 || y < 0 || y > 2) return -1; // Invalid coordinates
      pos = TicTacToe.toBinary(x, y);
    }

    if (this._currentTurn ^ player) return -2; // Wrong player's turn
    if (this.board & pos) return 0; // Position already taken

    this[this._currentTurn ? "_o" : "_x"] |= pos;
    this._currentTurn = !this._currentTurn;
    this.turns++;
    return 1; // Turn successful
  }

  /**
   * Render the board as an array of positions or player marks.
   * @param {number} boardX - Binary representation of player X's board.
   * @param {number} boardO - Binary representation of player O's board.
   * @returns {Array<string|number>} - Array representing the board.
   */
  static render(boardX = 0, boardO = 0) {
    const combined = parseInt(boardX.toString(2), 4) + 2 * parseInt(boardO.toString(2), 4);
    return [...combined.toString(4).padStart(9, "0")]
      .reverse()
      .map((value, index) => (value === '1' ? "X" : value === '2' ? "O" : ++index));
  }

  /**
   * Render the current board state.
   * @returns {Array<string|number>} - Array representing the board.
   */
  render() {
    return TicTacToe.render(this._x, this._o);
  }

  /**
   * Get the winner of the game, if any.
   * @returns {string|null} - Returns the winning player (X or O), or null if no winner.
   */
  get winner() {
    const xWin = TicTacToe.check(this._x);
    const oWin = TicTacToe.check(this._o);
    return xWin ? this.playerX : oWin ? this.playerO : null;
  }
}

module.exports = TicTacToe;

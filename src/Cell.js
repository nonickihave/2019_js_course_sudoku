/**
 * Created by NotePad on 21.02.2019.
 */

function SudokuCell(value, indOfRow, indOfCol) {

	var cellValue = value,
		possibles = value > 0 ? [] : [1,2,3,4,5,6,7,8,9],
		indexOfRow = indOfRow,
		indexOfCol = indOfCol;

	this.getValue = function() {
		return cellValue;
	};

	this.isEmpty = function() {
		return cellValue == 0 && possibles.length > 0;
	};

	this.update = function() {
		if (possibles.length == 1) {
			cellValue = possibles.splice(0, 1);
		}
	};

	this.getIndexOfRow = function() {
		return indexOfRow;
	};

	this.getIndexOfCol = function() {
		return indexOfCol;
	};

	this.getPossibles = function() {
		return possibles;
	};

	this.removePossible = function(val) {
		if (possibles.indexOf(val) != -1) {
			possibles.splice(possibles.indexOf(val), 1);
		}
	};
}

function Square(squareNum) {
	var cells = [],
		sqrNum = squareNum;
}

var log = (msg) => console.log(msg);

cell = new SudokuCell(0);
log("Is empty: " + cell.isEmpty());
log("Possibles: " + cell.getPossibles());
cell.removePossible(1);
cell.removePossible(2);
cell.removePossible(3);
cell.removePossible(4);
cell.removePossible(5);
cell.removePossible(6);
cell.removePossible(7);
cell.removePossible(8);
log("after removing possibles");
log("Is empty: " + cell.isEmpty());
log("Possibles: " + cell.getPossibles());
log("after cell update");
cell.update();
log("Is empty: " + cell.isEmpty());
log("cell value: " + cell.getValue());
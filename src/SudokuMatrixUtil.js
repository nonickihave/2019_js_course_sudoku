/**
 * Created by NotePad on 21.02.2019.
 */

function SudokuMatrixUtil(intputMatrix) {
	var mtrx = intputMatrix;

	this.getRowByIndex = function(indexOfRow) {
		return mtrx[indexOfRow];
	};

	this.getColumnByIndex = function(indexOfColumn) {
		var length = mtrx.length,
			columns = [];
		for (var i = 0; i < length; i++) {
			columns.push(this.getRowByIndex(i)[indexOfColumn]);
		}
		return columns;
	};

	this.getColumns = function() {
		var columns = [];
		var length = mtrx.length;
		for (var i = 0; i < length; i++) {
			var column = this.getColumnByIndex(i);
			columns.push(column);
		}
		return columns;
	}

}

var m = [
	[5, 3, 4, 6, 7, 8, 9, 0, 0],
	[6, 7, 2, 1, 9, 5, 3, 4, 8],
	[1, 9, 8, 3, 4, 2, 5, 6, 7],
	[8, 5, 9, 7, 6, 1, 4, 2, 3],
	[4, 2, 6, 8, 5, 3, 7, 9, 1],
	[7, 1, 3, 9, 2, 4, 8, 5, 6],
	[9, 6, 1, 5, 3, 7, 2, 8, 4],
	[2, 8, 7, 4, 1, 9, 6, 3, 5],
	[3, 4, 5, 2, 8, 6, 1, 7, 9]
];
var util = new SudokuMatrixUtil(m);
console.log(util.getColumns());
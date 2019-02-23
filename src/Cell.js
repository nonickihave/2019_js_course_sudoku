/**
 * Created by NotePad on 21.02.2019.
 */

function SudokuCell(value, indOfRow, indOfCol/*, possibles*/) {

    var cellValue = value,
        possibles = []/*arguments[3] != undefined ? arguments[3] : (value > 0 ? [] : [1,2,3,4,5,6,7,8,9])*/,
        indexOfRow = indOfRow,
        indexOfCol = indOfCol,
        squareNumber;
	var inputPossibles = arguments[3];
	if (inputPossibles != undefined) {
		inputPossibles.forEach(possible => possibles.push(possible));
	} else {
		possibles = value > 0 ? [] : [1,2,3,4,5,6,7,8,9];
	}

    this.getValue = function() {
        return cellValue;
    };

    this.setValue = function(val) {
        cellValue = val;
		possibles = cellValue > 0 ? [] : [1,2,3,4,5,6,7,8,9];
    };

    this.isEmpty = function() {
        return cellValue == 0 && possibles.length > 0;
    };

    this.update = function() {
        if (possibles.length == 1) {
			var toRemove = possibles.splice(0, 1)[0];
            cellValue = toRemove;
        }
    };

    this.getIndexOfRow = function() {
        return indexOfRow;
    };

    this.getRowNumber = function() {
        return this.getIndexOfRow()+1;
    };



    this.getIndexOfCol = function() {
        return indexOfCol;
    };

    this.getColumnNumber = function() {
        return this.getIndexOfCol() + 1;
    };

    this.getSquareNum = function() {
        return squareNumber;
    };

    this.getPossibles = function() {
        return possibles;
    };

    this.removePossible = function(val) {
        if (possibles.indexOf(val) != -1) {
//			console.log("possible", val, "is present, removing");
            possibles.splice(possibles.indexOf(val), 1);
//			console.log("after removal: ", possibles);
        } else {
//			console.log("possible", val, "was not found");
		}
    };

    this.removePossibles = function(possiblesArr) {
        possiblesArr.forEach(possible => this.removePossible(possible));
    };

	this.hasPossible = function(possible) {
		return possibles.indexOf(possible) != -1;
	};

	this.clone = function(){
		return new SudokuCell(this.getValue(), this.getIndexOfRow(), this.getIndexOfCol(), this.getPossibles());
	};

	this.isEqualToCell = function(anotherCell) {
		var valuesAreEqual = this.getValue() == anotherCell.getValue(),
			thisPossies = this.getPossibles(),
			thatPossies = anotherCell.getPossibles(),
			lengthsAreEqual = (thisPossies.length == thatPossies.length),
			possiblesAreEqual = true;
		if (lengthsAreEqual) {
			thisPossies.sort((a,b)=> a-b);
			thatPossies.sort((a,b)=> a-b);
			for (var i in thisPossies) {
				var possible = thisPossies[i];
				if (!anotherCell.hasPossible(possible)){
					possiblesAreEqual = false;
				}
			}
		}
		var result = valuesAreEqual && lengthsAreEqual && possiblesAreEqual;

		return result;

	};

    // calculate square number
    (function(asThis){

        for (var sqrNum = 1; sqrNum <= 9; sqrNum++) {
            var upIndexOfRow = 3*Math.floor((sqrNum-1)/3),
                downIndexOfRow =  upIndexOfRow + 2,
                leftIndexOfCol = 3 * ((sqrNum-1) %3 ),
                rightIndexOfCol = leftIndexOfCol + 2,
                withinRows = asThis.getIndexOfRow() >= upIndexOfRow && asThis.getIndexOfRow() <= downIndexOfRow,
                withinCols = asThis.getIndexOfCol() >= leftIndexOfCol && asThis.getIndexOfCol() <= rightIndexOfCol;
            if (withinCols && withinRows) {
                squareNumber = sqrNum;
                break;
            }
        }
    })(this);




}



function SudokuMatrix(sqrArrOfValues_OR_arr_ofCells) {
    var cellsAsArray = [];

	if (sqrArrOfValues_OR_arr_ofCells[0] instanceof SudokuCell) {
		cellsAsArray = sqrArrOfValues_OR_arr_ofCells;
	} else {
		for (var indOfRow = 0; indOfRow < sqrArrOfValues_OR_arr_ofCells.length; indOfRow ++) {
			for (var indOfCol = 0; indOfCol < sqrArrOfValues_OR_arr_ofCells.length; indOfCol++) {
				var val = sqrArrOfValues_OR_arr_ofCells[indOfRow][indOfCol];
				cellsAsArray.push(new SudokuCell(val, indOfRow, indOfCol));
			}
		}
	}



    this.getCell = function(rowNum, colNum) {
      return cellsAsArray.filter(cell => (cell.getIndexOfRow() == rowNum -1) && (cell.getIndexOfCol() == colNum-1)).pop();
    };

    this.getRowByIndex = function(indexOfRow) {
        return cellsAsArray.filter(cell => cell.getIndexOfRow() == indexOfRow);
    };

    this.getRowByNumber = function(rowNumber) {
        return this.getRowByIndex(rowNumber - 1);
    };

    this.getColumnByIndex = function(indexOfCol) {
        return cellsAsArray.filter(cell => cell.getIndexOfCol() == indexOfCol);
    };

    this.getColumnByNumber = function(columnNumber) {
        return this.getColumnByIndex(columnNumber - 1)
    };

    this.getCellsBySquareNumber = function(squareNumber) {
        return cellsAsArray.filter(cell => cell.getSquareNum() == squareNumber);
    };

    this.removePossibleFromRow = function(rowNumber, val) {
        this.getRowByNumber(rowNumber).forEach(cell => cell.removePossible(val));
    };

    this.removePossiblesFromRow = function(rowNum, possibles) {
        for (var i in possibles) {
            var possible = possibles[i];
            this.removePossibleFromRow(rowNum, possible);
        }
    };

    this.removePossiblesFromColumn = function(colNum, possibles) {
        for (var i in possibles) {
            var possible = possibles[i];
            this.removePossibleFromColumn(colNum, possible);
        }
    };


    this.removePossibleFromColumn = function(colNumber, val) {
        this.getColumnByNumber(colNumber).forEach(cell => {

				cell.removePossible(val);



		});
    };

    this.removePossibleFromSquare = function(squareNum, val) {
        this.getCellsBySquareNumber(squareNum).forEach(cell => cell.removePossible(val));
    };

    this.getCellsWithPossiblesAmount = function(amount) {
        return cellsAsArray.filter(cell => cell.getPossibles().length == amount);
    };

    this.updateAllCells = function() {
        cellsAsArray.forEach(cell => cell.update());
    };

    this.getEmptyCellsFromRow = function(rowNum) {
        return this.getRowByNumber(rowNum).filter(cell => cell.isEmpty());
    };

    this.getValuedCellsFromMatrix = function() {
        return cellsAsArray.filter(cell => !cell.isEmpty());
    };

    this.getEmptyCellsFromMatrix = function() {
        return cellsAsArray.filter(cell => cell.isEmpty());
    };

    this.logValues = function() {
		console.log("-------------------");
        for (var i = 1; i <= 9; i++) {
            var row = this.getRowByNumber(i);
            var output = row.sort((a, b) => a.getColumnNumber() - b.getColumnNumber()).map(cell => cell.getValue()).reduce((acc, val) => acc += val + "|", '|');
            console.log(output);
        }
		console.log("-------------------");
    };

	this.logLineValues = function (line/*row or column*/) {
		console.log( line.reduce((acc, cell) => acc += cell.getValue() + " ", '') );
	};

    this.logCellPossibles = function(rowNum, colNum) {
        console.log(this.getCell(rowNum, colNum).getPossibles());
    };





	this.clone = function() {
		var copyOfCellsAsArray = [];
		for (var i in cellsAsArray) {
			var thisCell = cellsAsArray[i],
				newCell = thisCell.clone();
//			console.log("cloning matrix, this cell: " + thisCell.getValue(), thisCell.getIndexOfRow(), thisCell.getIndexOfCol(), "new cell: ", newCell.getValue());
			if (!thisCell.isEqualToCell(newCell)){
				console.error("error, could not copy the cell");
			}
			copyOfCellsAsArray.push(newCell);
		}
		return new SudokuMatrix(copyOfCellsAsArray);
	};

	this.getCells = function() {
		var copyOfCells = [];
		cellsAsArray.forEach(cell => copyOfCells.push(cell.clone()));
		return copyOfCells;
	};

	this.isEqualToMatrix = function(anotherMatrix, thisMatrixDebugName, anotherMatrixDebugName) {
		var thisCells = this.getCells(),
			thatCells = anotherMatrix.getCells(),
			lengthsAreEqual = thisCells.length == thatCells.length,
			result = true;
			for (var i = 0, cellsAmount = thisCells.length; i < cellsAmount; i++) {
				var thisCell = thisCells[i],
					thisRowNumber = thisCell.getRowNumber(),
					thisColNumber = thisCell.getColumnNumber(),
					thatCell = anotherMatrix.getCell(thisRowNumber, thisColNumber);
//				if (thisRowNumber == 1 && thisColNumber ==3) {
//					console.log("thisCell possibles", thisCell.getPossibles(), "that cell possibles", thatCell.getPossibles());
//				}
					if (!thisCell.isEqualToCell(thatCell)) {
						result = false;
//						console.log("Difference is detected at [", thisRowNumber, thisColNumber, "]");
//						console.log("\t\t" + thisCell.getValue() + " vs " + thatCell.getValue());
//						console.log("\t\t" + thisCell.getPossibles() + " vs " + thatCell.getPossibles());
						break;
					}
			}

		return lengthsAreEqual && result;
	};

	this.forEachRow = function (callback/*params to callback: row, number*/) {
		for (var i = 1; i <= 9; i++) {
			var row = this.getRowByNumber(i);
			callback.call(this, row,i);
		}
	};

	this.forEachColumn = function (callback/*params to callback: column, number*/) {
//		console.log("the fuck is that");
		for (var i = 1; i <= 9; i++) {
			var column = this.getColumnByNumber(i);
			callback.call(this, column, i);
		}
	};





}

function SudokuSolver(valuesMatrix) {
    var matrix = new SudokuMatrix(valuesMatrix);
	var result;
//	var resultingMatrix = matrix;
//
//	matrix.getCell(1,3).removePossible(9);
//	var newMatrix = matrix.clone();
//	console.log("cloned input matrix after removal of one possible, are equal: ", (newMatrix.isEqualToMatrix(matrix)));
//	console.log("removing onre more possible in new matrix");
//	newMatrix.getCell(1,3).removePossible(8);
//	console.log("new matrix is equal to input: ", (newMatrix.isEqualToMatrix(matrix)));
//	var newCell = newMatrix.getCell(1,3);
//	var oldCell = matrix.getCell(1,3);
//	console.log(newCell.getPossibles());
//	console.log(oldCell.getPossibles());
//	console.log(newCell.isEqualToCell(oldCell));
//	oldCell.removePossible(8);
//	console.log("Removed the same possible from the old matrix cell, matrixes are equal: ", newMatrix.isEqualToMatrix(matrix));

	var resultingMatrix = (function(){

		var hasChanges = true;
		var before = matrix.clone();
		var max = 500;
		for (var ii = 0; ii < max; ii++) {
//			console.log(ii);
			var after = before.clone();

			removeExistingValuesFromPossiblesCells(after);
			after.updateAllCells();
//


			findOnlyOnePossible(after);
			after.updateAllCells();
			var isEqual = before.isEqualToMatrix(after, "before", "after");
			hasChanges = !isEqual;
			before = after;
			if (!hasChanges) {
				console.log("no changes detected, stopping at iteration " + ii);
				return after;
			} else if (ii +1 == max) {
				console.log("too many iterations with no success, stopping at iteration " + ii, "after is instance of sudoku matrix: " + (after instanceof  SudokuMatrix));
				return after;

			}
		}

	})();



    function removeExistingValuesFromPossiblesCells(mtrx) {
        var valued = mtrx.getValuedCellsFromMatrix();
		valued.forEach(valuedCell => {
			var colNum = valuedCell.getColumnNumber(),
				rowNum = valuedCell.getRowNumber(),
				squareNum = valuedCell.getSquareNum(),
				value = valuedCell.getValue();

			mtrx.removePossibleFromColumn(colNum, value);
			mtrx.removePossibleFromRow(rowNum, value);
			mtrx.removePossibleFromSquare(squareNum, value);
		});
		return mtrx;
    }

	function findOnlyOnePossible(mtrx) {
		function findAndFill(line, possible) {
			var cellsHavingPossible = line.filter(cell => cell.hasPossible(possible)),
				emptyCellsAmount = line.filter(cell => cell.isEmpty()).length,
				amount = cellsHavingPossible.length;
			if (amount == 1 && emptyCellsAmount > 1) {

				var cell = cellsHavingPossible[0],
					rowNum = cell.getRowNumber(),
					columnNum = cell.getColumnNumber(),
					squareNum = cell.getSquareNum();
//				console.log("Found only one value, it's", possible);
				cellsHavingPossible[0].setValue(possible);
				mtrx.removePossibleFromColumn(columnNum, possible);
				mtrx.removePossibleFromRow(rowNum, possible);
				mtrx.removePossibleFromSquare(squareNum, possible);
//				removeExistingValuesFromPossiblesCells(mtrx);
//				strWithOtherPossibles = line.reduce((acc, cell) => acc+=cell.getPossibles() + " ||| ","possibles in line after updating the matrix: ");
//				console.log(strWithOtherPossibles);

			}
		}

		for (var possible = 1; possible <= 9; possible++) {
//			console.log("checking rows for possible ", possible);
			mtrx.forEachRow(row => {findAndFill(row, possible)});
//			console.log("checking columns for possible ", possible);
			mtrx.forEachColumn(col => {findAndFill(col, possible)});
		}
		return mtrx;
	}


//	console.log("SudokuSolver, before returning result. Result is instance of sudokuMatrix?", result instanceof  SudokuMatrix, result);
    return resultingMatrix;
}



var toSolve1 = [
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
var toSolve2 = [
    [6, 5, 0, 7, 3, 0, 0, 8, 0/*was 0*/],
    [0, 0, 0, 4, 8, 0, 5, 3, 0],
    [8, 4, 0, 9, 2, 5, 0, 0, 0],
    [0, 9, 0, 8, 0, 0, 0, 0, 0],
    [5, 3, 0, 2, 0, 9, 6, 0, 0],
    [0, 0, 6, 0, 0, 0, 8, 0, 0],
    [0, 0, 9, 0, 0, 0, 0, 0, 6],
    [0, 0, 7, 0, 0, 0, 0, 5, 0],
    [1, 6, 5, 3, 9, 0, 4, 7, 0]
];
var toSolve3 = [
	[0, 5, 0, 0, 7, 0, 0, 0, 1],
	[8, 7, 6, 0, 2, 1, 9, 0, 3],
	[0, 0, 0, 0, 3, 5, 0, 0, 0],
	[0, 0, 0, 0, 4, 3, 6, 1, 0],
	[0, 4, 0, 0, 0, 9, 0, 0, 2],
	[0, 1, 2, 0, 5, 0, 0, 0, 4],
	[0, 8, 9, 0, 6, 4, 0, 0, 0],
	[0, 0, 0, 0, 0, 7, 0, 0, 0],
	[1, 6, 7, 0, 0, 2, 5, 4, 0]
];

//console.log(new SudokuMatrix(toSolve1).isEqualToMatrix(new SudokuMatrix(toSolve2)));


solved = new SudokuSolver(toSolve3);
//solved = new SudokuMatrix(toSolve2);
initial = new SudokuMatrix(toSolve3);
console.log("changes? " + !solved.isEqualToMatrix(initial));

console.log('=======Initial=======');
initial.logValues();
console.log('=======Result=======');
solved.logValues();

console.log(solved.getCell(5,1).getPossibles());
console.log(solved.getCell(5,4).getPossibles());
console.log(solved.getCell(5,7).getPossibles());
//console.log(solved.getCell(6,2).getPossibles());
//console.log("possibles in column 2: ", solved.getColumnByNumber(2).reduce((acc, cell)=> acc += cell.getPossibles() + "|||" , ""));
//console.log("possibles in row 6: ", solved.getRowByNumber(6).reduce((acc, cell)=> acc += cell.getPossibles() + "|||" , ""));




//solved.logCellPossibles(9,6);
//solved.logCellPossibles(9,9);
//solved.logCellPossibles(1,9);
//m2 = m1.clone();
//m1.logValues();
//console.log("second values");
//m2.logValues();
//console.log("are equal: ", m1.isEqualToMatrix(m2));
//console.log("changing possibles in m2");
//m2.getCell(1,9).removePossibles([1,2,3,4,5,6,7]);
//console.log("are equal: ", m1.isEqualToMatrix(m2));

//solution.logCellPossibles(1,8);
//solution.logCellPossibles(1,9);
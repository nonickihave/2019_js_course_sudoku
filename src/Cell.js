/**
 * Created by NotePad on 21.02.2019.
 */

function SudokuCell(value, indOfRow, indOfCol) {

    var cellValue = value,
        possibles = value > 0 ? [] : [1,2,3,4,5,6,7,8,9],
        indexOfRow = indOfRow,
        indexOfCol = indOfCol,
        squareNumber;

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
            cellValue = possibles.splice(0, 1);
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
            possibles.splice(possibles.indexOf(val), 1);
        }
    };

    this.removePossibles = function(possiblesArr) {
        possiblesArr.forEach(possible => this.removePossible(possible));
    };

	this.clone = function(){
		return new SudokuCell(this.getValue(), this.getIndexOfRow(), this.getIndexOfCol());;
	};

	this.isEqualToCell = function(anotherCell) {
		var valuesAreEqual = this.getValue() == anotherCell.getValue(),
			thisPossies = this.getPossibles(),
			thatPossies = anotherCell.getPossibles(),
			possibilitiesAreEqual = thisPossies.length == thatPossies.length;
			thisPossies.forEach(value => {
				if (thatPossies.indexOf(value) == -1) {
					possibilitiesAreEqual = false;
				}
			});
		return valuesAreEqual && possibilitiesAreEqual;

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
        this.getColumnByNumber(colNumber).forEach(cell => cell.removePossible(val));
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
        for (var i = 1; i <= 9; i++) {
            var row = this.getRowByNumber(i);
            var output = row.sort((a, b) => a.getColumnNumber() - b.getColumnNumber()).map(cell => cell.getValue()).reduce((acc, val) => acc += val + " ", '');
            console.log(output);
        }
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
			copyOfCellsAsArray.push(newCell);
		}
		return new SudokuMatrix(copyOfCellsAsArray);
	};

	this.getCells = function() {
		var copyOfCells = [];
		cellsAsArray.forEach(cell => copyOfCells.push(cell.clone()));
		return copyOfCells;
	};

	this.isEqualToMatrix = function(anotherMatrix) {
		var thisCells = this.getCells(),
			thatCells = anotherMatrix.getCells(),
			lengthsAreEqual = thisCells.length == thatCells.length,
			result = true;
		if (lengthsAreEqual) {
			thisCells.forEach(cell => {
				var anotherCell = anotherMatrix.getCell(cell.getRowNumber(), cell.getColumnNumber());
				if( !(cell.isEqualToCell( anotherCell )) ) {
					result = false;
//					console.log("cells are not equal");
//					console.log("this cell, value ", cell.getValue(), " rowIndex ", cell.getIndexOfRow(), " col index ", cell.getIndexOfCol(), "possibles ", cell.getPossibles());
//					console.log("that cell, value ", anotherCell.getValue(), " rowIndex ", anotherCell.getIndexOfRow(), " col index ", anotherCell.getIndexOfCol(), "possibles ", anotherCell.getPossibles());

				}
			});
		}
		return result;
	};



}

function SudokuSolver(valuesMatrix) {
    var matrix = new SudokuMatrix(valuesMatrix);
	var result;
	var before = matrix.clone();

	(function(){
//		console.log("checking matrix");
		var hasChanges = true;
		for (var ii = 0; ii < 500; ii++) {
//			console.log(ii);
			var after = removeExistingValuesFromPossiblesCells(before.clone());
			after.updateAllCells();
			hasChanges = before.isEqualToMatrix(after);
			before = after.clone();
			if (!hasChanges) {
				console.log("no changes detected, stopping");
				result = after;
				break;
			} else if (i == 499) {
				console.log("too many iterations with no success, stopping");
			}
		}

	})();



//    matrix.getEmptyCellsFromMatrix().forEach(cell => console.log(cell.getPossibles()));



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

    return result;
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
    [6, 5, 0, 7, 3, 0, 0, 8, 0],
    [0, 0, 0, 4, 8, 0, 5, 3, 0],
    [8, 4, 0, 9, 2, 5, 0, 0, 0],
    [0, 9, 0, 8, 0, 0, 0, 0, 0],
    [5, 3, 0, 2, 0, 9, 6, 0, 0],
    [0, 0, 6, 0, 0, 0, 8, 0, 0],
    [0, 0, 9, 0, 0, 0, 0, 0, 6],
    [0, 0, 7, 0, 0, 0, 0, 5, 0],
    [1, 6, 5, 3, 9, 0, 4, 7, 0]
];

//solution = new SudokuSolver(toSolve2);
//solution.logValues();

//m1 = new SudokuMatrix(toSolve1);
//m1.logValues();
solved = new SudokuSolver(toSolve2);
solved.logValues();
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
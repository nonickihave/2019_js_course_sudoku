module.exports = function solveSudoku(matrix) {
  // your solution

	var solver = new SudokuSolver(matrix);
	return solver.solve().getSolution().toValuesArray();

};

function SudokuSolver(valuesMatrix) {
	var matrix = new SudokuMatrix(valuesMatrix);
	var solution;
	var util = new SolverUtil();

	this.getSolution = function() {
		return solution;
	};



	function hasValidEmptyCells(_matrix) {
		var cells = _matrix.getCells().filter(cell => cell.isEmpty() && (cell.getPossibles().length > 0));
		return cells.length > 0;
	}

	function hasInvalidEmptyCells(_matrix) {
		var cells = _matrix.getCells().filter(cell => cell.isEmpty() && (cell.getPossibles().length == 0));
		return (cells.length > 0);
	}



	function allCellsAreFilled (_matrix) {
		var cells = _matrix.getCells().filter(cell => cell.isEmpty());
		return cells.length == 0;
	}

	function solveRecursively (inputMtrx, asThis, level) {

		if (allCellsAreFilled(inputMtrx)){
			return inputMtrx;
		}

		if (hasInvalidEmptyCells(inputMtrx)) {
			return null;
		}

		var cloned = inputMtrx.clone();
		// because matrix is used by solveByLogc(), we must set it as current solution
		// it's cloned because matrix will be changed and we must go back to the previous version in case of failure

		var emptyCells = inputMtrx.getCells().filter(cell => cell.isEmpty()).sort((a, b) => (a.getPossibles().length - b.getPossibles().length) );


		for (var i = 0; i < emptyCells.length; i++) {
//			logIfLevelOne(level, "before iteration amount of empty cells is :" + emptyCells.length);

			var empty = emptyCells[i],
				row = empty.getRowNumber(),
				col = empty.getColumnNumber(),
				possibles = empty.getPossibles();


			for (var j = 0; j < possibles.length; j++) {
				var fuckingPossible = possibles[j];

				cloned = inputMtrx.clone();
				cloned._setCellValue(row, col, fuckingPossible);
				// solve by logic changes objects inside of the matrix
				// because we want to go back to prev value and try the other possibles, we clone it
				var solvedByLogic = asThis.solveByLogic(cloned.clone());
				var solvedRecursively = solveRecursively(solvedByLogic, asThis, (level + 1));

				if (solvedRecursively === undefined) {

					return null;
				} else
				if (solvedRecursively !== null) {
					return solvedRecursively;
				} else {
					if (level = 1) {
					}
					cloned._setCellValue(row, col, 0);
				}
			}


		}

		console.log("this string means that by mistake the value wasn't returned correctly at level " + level + ", returning null");
		return null;


	}

	this.solve = function () {
		solution = this.solveByLogic();
		var solved = allCellsAreFilled(solution);
		if (solved) {
		} else {
			/*
			 Идея. Перебирать возможные значения каждой пустой ячейки, при этом после вбивания значения применять обычные подходы
			 */
//            var beforeBruteforcing = this.getSolution().clone();
			var recursively = solveRecursively(solution, this, 1);
			if (recursively == null) {
				return solution;
			} else {
				solution = recursively;
			}

		}




		return this;
	};

	this.solveByLogic = function(mtrxx){
//		console.log("solving by logic. Input matrix is undefined: " + (mtrxx === undefined));
		var toReturn = (function(inputMatrixx){

			var hasChanges = true;
			var before = inputMatrixx.clone();
			var max = 500;
			for (var ii = 0; ii < max; ii++) {
				var after = before.clone();


				// find cells where amount of possibles left is 1
				util.setValuesInCellsHavingOnePossibleLeft(after);
				util.findOnlyOnePossibleAmongSome(after);
				util.analyzeLines(after);
//			console.log("possibles in column " + 4+ ":", after.getColumnByNumber(4).reduce((acc, cell)=> acc += cell.getPossibles() + "|||" , ""));




				var isEqual = before.isEqualToMatrix(after, "before", "after");
				hasChanges = !isEqual;
				before = after;
				if (!hasChanges) {
//                    console.log("could not solve by logic");
					return after;

				} else if (ii +1 == max) {
					console.log("too many iterations with no success, stopping at iteration " + ii, "after is instance of sudoku matrix: " + (after instanceof  SudokuMatrix));
					return after;

				}
			}

		})((mtrxx !== null && mtrxx !== undefined) ? mtrxx : matrix);
		return toReturn;
	};












//	console.log("SudokuSolver, before returning result. Result is instance of sudokuMatrix?", result instanceof  SudokuMatrix, result);
//    return resultingMatrix.toValuesArray();
	return this;
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


	this.updatePossiblesAccordingToCell = function (cell) {
		if (!cell.isEmpty()) {
			var value = cell.getValue(),
				rowNum = cell.getRowNumber(),
				colNum = cell.getColumnNumber(),
				squareNum = cell.getSquareNum(),
				row = this.getEmptyCellsFromRow(rowNum),
				column = this.getEmptyCellsFromColumn(colNum),
				square = this.getEmptyCellsFromSquare(squareNum);

			row.forEach(cell => cell.removePossible(value));
			column.forEach(cell => cell.removePossible(value));
			square.forEach(cell => cell.removePossible(value));
		}
	};


	this.setCellValue = function (cell, value) {
		cell.setValue(value);
		this.updatePossiblesAccordingToCell(cell);
	};

	this._setCellValue = function (rowNum, colNum, value) {
		var cell = this.getCell(rowNum, colNum);
		this.setCellValue(cell, value);
	};




	this.getEmptyCellsFromRow = function(rowNum) {
		return getEmptyCellsFromArr(this.getRowByNumber(rowNum));
	};

	this.getEmptyCellsFromColumn = function (colNum) {
		return getEmptyCellsFromArr(this.getColumnByNumber(colNum));
	};

	this.getEmptyCellsFromSquare = function (squareNum) {
		return getEmptyCellsFromArr(this.getCellsBySquareNumber(squareNum));
	};







	var getEmptyCellsFromArr = function (arr) {
		return arr.filter(cell => cell.isEmpty());
	};

	var getValuedCellsFromArr = function (arr) {
		return arr.filter(cell => !cell.isEmpty());
	};





	this.forEachRow = function (callback/*params to callback: row, number*/) {
		for (var i = 1; i <= 9; i++) {
			var row = this.getRowByNumber(i);
			callback.call(this, row, i);
		}
	};

	this.forEachColumn = function (callback/*params to callback: column, number*/) {
//		console.log("the fuck is that");
		for (var i = 1; i <= 9; i++) {
			var column = this.getColumnByNumber(i);
			callback.call(this, column, i);
		}
	};

	this.getCells = function () {
		return cellsAsArray;
	};

	this.hasEmptyCells = function () {
		var emptyCells = this.getCells().filter(cell => isEmpty());
		return emptyCells > 0;
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

			if (!thisCell.isEqualToCell(thatCell)) {
				result = false;

				break;
			}
		}

		return lengthsAreEqual && result;
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

	this.logLineValues = function (line/*row or column*/) {
		console.log( line.reduce((acc, cell) => acc += cell.getValue() + " ", '') );
	};

	this.logCellPossibles = function(rowNum, colNum) {
		console.log(this.getCell(rowNum, colNum).getPossibles());
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

	this.logPossibles = function () {
		this.forEachRow(row => {
			row.sort((a, b) => a.getColumnNumber() - b.getColumnNumber());
			var str = row.reduce((acc, cell) => {
				var ps = cell.getPossibles().length > 0 ? cell.getPossibles() : "-";
				var coordinates = "^"+ cell.getRowNumber() + "^" + cell.getColumnNumber() +"^: ";
				acc += coordinates + ps + "|\t\t\t\t\t\t";
				return acc;
			}, "");
			console.log(str);
		})
	};

	this.toValuesArray = function () {
		var result = [];
		for (var i = 1; i <= 9; i++) {
			var row = this.getRowByNumber(i);
			row.sort((a,b) => a.getColumnNumber() - b.getColumnNumber());
			var values = row.map(cell => cell.getValue());
			result.push(values);
		}
		return result;
	};


	var asThis = this;
	cellsAsArray.forEach(cell => asThis.updatePossiblesAccordingToCell(cell));

}


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
		return cellValue == 0 /*&& possibles.length > 0*/;
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

function SolverUtil  () {

	this.setValuesInCellsHavingOnePossibleLeft = function (mtrx) {
		mtrx.getCells().forEach(cell => {
			if (cell.getPossibles().length == 1) {
				var val = cell.getPossibles()[0];
				mtrx.setCellValue(cell, val);
			}
		})
	};

	this.findOnlyOnePossibleAmongSome = function (mtrx) {
		function findAndFill(line, possible) {
			var cellsHavingPossible = line.filter(cell => cell.hasPossible(possible)),
				emptyCellsAmount = line.filter(cell => cell.isEmpty()).length,
				amount = cellsHavingPossible.length;
			if (amount == 1 && emptyCellsAmount > 1) {

				var cell = cellsHavingPossible[0],
					rowNum = cell.getRowNumber(),
					columnNum = cell.getColumnNumber(),
					squareNum = cell.getSquareNum();

//				cellsHavingPossible[0].setValue(possible);
				mtrx.setCellValue(cell, possible);


			}
		}

		for (var possible = 1; possible <= 9; possible++) {

			mtrx.forEachRow(row => {findAndFill(row, possible)});

			mtrx.forEachColumn(col => {findAndFill(col, possible)});
		}
		return mtrx;
	};

	/**
	 * If in line there're some cells in which there's a possibility only in those cells
	 * and this part of line belongs to the same square, this possible must be removed from
	 * the rest cells of the square
	 * @param mtrx
	 */
	this.twoOrThreeCellsWithOnePossibleInLineBelongToTheSameSquare = function (mtrx) {
		mtrx.forEachRow((row, rowNum) => {

		});
	};

	function arrContainsCell(line, cell) {
		var contains = false;
		for (var i = 0, length = line.length; i < length; i++) {
			var singleCell = line[i];
			if (singleCell.isEqualToCell(cell)) {
				contains = true;
				break;
			}
		}
		return contains;
	}

	function excludeCellsFromArray(toExclude, arr ) {
		return arr.filter(singleCell => !arrContainsCell(toExclude, singleCell));
	}

	this.analyzeLines = function (mtrx) {
		for (var i = 1; i <=9; i++){
			var possible = i;
			var asThis = this;
			mtrx.forEachColumn(col => asThis.analyzeLine(mtrx, col, possible));
			mtrx.forEachRow(row => asThis.analyzeLine(mtrx, row, possible));
		}
	};

	this.analyzeLine = function (mtrx, line, possible) {
		var lineCellsWithPossible = line.filter(cell => cell.hasPossible(possible));
//		console.log("cells containing possible " + possible, "in line");
//		lineCellsWithPossible.forEach(cell => console.log(cell.getRowNumber()));
		if (lineCellsWithPossible.length > 0 && cellsBelongToTheSameSquare(lineCellsWithPossible)) {

			var squareNum = lineCellsWithPossible[0].getSquareNum();

			var squareCells = mtrx.getCellsBySquareNumber(squareNum);
			var cellsNotBelongingToLine = excludeCellsFromArray(lineCellsWithPossible, squareCells);
			cellsNotBelongingToLine.forEach(cell => cell.removePossible(possible));

		}
	};

	function cellsBelongToTheSameSquare(cells) {

		var belong = true,
			squareNum = cells[0].getSquareNum();
		cells.forEach(cell => {
			if (cell.getSquareNum() != squareNum) {belong = false}
		});
		return belong;
	}


};



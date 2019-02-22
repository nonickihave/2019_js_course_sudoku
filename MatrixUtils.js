/**
 * Created by Muzychkin_D on 21.02.2019.
 */

/**
 * The first index of the square matrix is a number of the row
 * @constructor
 */
function SudokuMatrixUtils(inputMatrix) {

    var matrixx = inputMatrix;


    this.getRowByIndex = function (/*matrix, */rowIndex) {
        return matrixx[rowIndex];
    };

    this.getColumnByIndex = function(/*matrix, */columnIndex){
        // go through the rows
        var column = [];
        for (var i in matrixx) {
            column.push(matrixx[i][columnIndex]);
        }
        return column;
    };

    this.getColumns = function() {
        var columns = [],
            length = this.size();
        for (var columnIndex = 0; columnIndex < length; columnIndex++) {
            var column = [];
            for (var rowIndex = 0; rowIndex < length; rowIndex++) {
                column.push(matrixx[rowIndex][columnIndex]);
            }
//            log(column);
            columns.push(column);
        }

        return columns;
    };

    this.size = function() {
        return matrixx.length;
    };

    this.rowsAmount = function() {
        return matrixx.length;
    };

}

log = (obj) => console.log(obj);
logMatrix = (matrixx) => {for (var i in matrixx){log(matrixx[i])}};


matrix = [
    [5, 3, 4, 6, 7, 8, 9, 0, 0],
    [6, 7, 2, 1, 9, 5, 0, 0, 0],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

util = new SudokuMatrixUtils(matrix);
columns = util.getColumns();

logMatrix(new SudokuMatrixUtils(columns).getColumns());
//util2 = new SudokuMatrixUtils(columns);
//util2.getColumns();

//log("Row at index 0: " + util.getRowByIndex(0));
//log("Column at index 0: " + util.getColumnByIndex(0));
//log("Columns: ");
//logMatrix(util2.getColumns());
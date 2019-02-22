module.exports = function solveSudoku(matrix) {
  // your solution
    var size = matrix.length;
    for (var i = 0; i < size; i++) {
        var row = checkTheOnlyMissingValue(matrix[i]);
        matrix[i] = row;
    }
    for (var i = 0; i < size; i++) {
        var column = retrieveColumn(matrix, i);
        column = checkTheOnlyMissingValue(column);
        setColumn(matrix, column, i);
    }
    return matrix;
}

/**
 * Creates an array respresenting a full row (that is, containing all values from 1 to max)
 * @param max max value
 * @returns {Array}
 */
function createFullRow(max) {
    var result = [];
    for (var i = 0; i < max; i++) {
        result.push(i+1);
    }
    return result;
}

/**
 * Checks if the only one value in row is missing.
 * @param row an array representing row (can be column) with values
 * @returns {*} reference to the same row
 */
function checkTheOnlyMissingValue(row) {
    var missing = 0,
        index = -1;
    for (var i = 0, length = row.length; i < length; i++) {
        if (row[i] == 0) {
            missing++;
            index = i;
        }
    }
    if (missing == 1) {
        console.log("missing at index " + index);
        for (var i = 0, length = row.length; i < length; i++) {
            if (row.indexOf(i+1) == -1) {
                row[index] = i +1;
                break;
            }
        }
    }
    return row;
}

function setColumn(matrix, arrAsColumn, colInd) {
    for (var i in arrAsColumn) {
        matrix[i][colInd] = arrAsColumn[i];
    }
    return matrix;
}

function retrieveColumn(matrix, ind) {
    /*
     Assuming matrix == {
     [],
     [],
     []
     } == true
     */
    var result = [];
    for (var i in matrix) {
        result.push(matrix[i][ind]);
    }

    return result;
}


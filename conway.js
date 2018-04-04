function CreateGrid(num_rows, num_cols) {

    let grid = [];

    const create_grid = function create_grid() {

        for(let row = 0; row < num_rows; row++) {
            grid.push([]); // add a row

            for(let col = 0; col < num_cols; col++) {
                grid[row].push(0);
            }
        }
        return grid;
    };

    const check_for_valid_index(row, col) {
        if(row >= num_rows || col >= num_cols) {
            throw Error(`Invalid row or column: ${row}, ${col}`);
        }
    };

    const set = function set(row, col, val) {
        check_for_valid_index(row, col);

        if(val !== 0 || val !== 1) {
            throw Error(`Invalid value for grid: ${val}`);
        }

        grid[row][col] = val;
    };

    const get = function get(row, col) {
        check_for_valid_index(row, col);
        return grid[row][col];
    };

    const toggle = function toggle(row, col) {

        let val = get(row, col);

        if(val === 1) {
            set(row, col, 0);
        }else{
            set(row, col, 1);
        }
    };


    const reset = function reset() {
        grid = [];
        create_grid();
    };

    return { toggle, set, reset };
}

function CreateGrid(num_rows, num_cols) {

    let grid = [];

    const create_grid = function create_grid() {

        for(let row = 0; row < num_rows; row++) {
            grid.push([]); // add a row

            for(let col = 0; col < num_cols; col++) {
                grid[row].push(0);
            }
        }
        grid.num_rows = num_rows;
        grid.num_cols = num_cols;

        return grid;
    };

    const check_for_valid_index = function check_for_valid_index(row, col) {
        if(row >= num_rows || col >= num_cols) {
            throw Error(`Invalid row or column: ${row}, ${col}`);
        }
    };

    const set = function set(row, col, val) {
        check_for_valid_index(row, col);

        if(val !== 0 && val !== 1) {
            throw Error(`Invalid value for grid: ${val}`);
        }

        grid[row][col] = val;
    };

    const get = function get(row, col) {
        check_for_valid_index(row, col);
        return grid[row][col];
    };

    const dump_grid = function dump_grid() {
        for(let row = 0; row < num_rows; row++) {
            let str = "";
            for(let col = 0; col < num_cols; col++) {
                str += grid[row][col] + "";
            }
            console.log(str);
        }
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

    const init = function init() {

        create_grid();
    };

    init();

    return {
        toggle,
        set,
        get,
        reset,
        grid, //should remove
        num_cols,
        num_rows,
        dump_grid, //debugging
    };
};

function StartGame(gameboard, interval) {

    let generation = 0;
    let gen_without_change = 0;
    let generation_stall = 5; // how many non-changing generations before
                              // quitting.

    let updateInterval = null;
    let is_stalled = false;
    
    const update_grid = function update_grid() {        
        generation++;

        // end the simulation if there haven't been any changes
        if(gen_without_change >= generation_stall) {
            console.log('No changes, ending.');            
            is_stalled = true;    
            return;
        }

        let changes = 0;

        for(let row = 0; row < gameboard.num_rows; row++) {
            
            for(let col = 0; col < gameboard.num_cols; col++) {
                let num_nbors = 0;
                let val = 0;
                // count number of neighbors

                //above (row - 1)
                if((row - 1) >= 0) {
                    val = gameboard.get(row - 1, col);
                    if(val === 1) num_nbors++;
                }

                //below (row + 1)
                if( (row + 1) < gameboard.num_rows) {
                    val = gameboard.get(row + 1, col);
                    if(val === 1) num_nbors++;
                }

                //left (col - 1)
                if( (col - 1) >= 0) {
                    val = gameboard.get(row, col - 1);
                    if(val === 1) num_nbors++;
                }

                //right (col + 1)
                if( (col + 1) < gameboard.num_cols) {
                    val = gameboard.get(row, col + 1);
                    if(val === 1) num_nbors++;
                }

                //top-left row - 1, col - 1
                if( (row - 1) >= 0 && (col - 1) >= 0) {
                    val = gameboard.get(row - 1, col - 1);
                    if(val === 1) num_nbors++;
                }

                //top-right row - 1, col + 1
                if( (row - 1) >= 0 && (col + 1) < gameboard.num_cols) {
                    val = gameboard.get(row - 1, col + 1);
                    if(val === 1) num_nbors++;
                }

                //bottom-left row + 1, col - 1
                if( (row + 1) < gameboard.num_rows && (col - 1) >= 0) {
                    val = gameboard.get(row + 1, col -1);
                    if(val === 1) num_nbors++;
                }

                //bottom-right row + 1, col + 1
                if( (row + 1) < gameboard.num_rows && (col + 1) <
                        gameboard.num_cols)
                {
                    val = gameboard.get(row + 1, col + 1);
                    if(val === 1) num_nbors++;
                }

                let current_cell = gameboard.get(row, col);

                if(current_cell === 1) {

                    // living cell
                    if(num_nbors < 2) {
                        // cell dies lonely
                        gameboard.set(row, col, 0);
                        changes++;
                    }else if(num_nbors > 3) {
                        // cell   dies overpopulation
                        gameboard.set(row, col, 0);
                        changes++;
                    }
                }else{

                    //dead cell
                    if(num_nbors === 3) {
                        gameboard.set(row, col, 1);
                        changes++;
                    }
                }
            }
            
            console.log(`Generation: ${generation}.`);
        };

        if(changes === 0) {
            gen_without_change++;
        }else{
            gen_without_change = 0;
        }
    };

    const next = function next() {
        update_grid();
        return generation;
    };

    const get_generation = function get_generation() {
        return generation;
    };   

    const get_is_stalled = function() {
        return is_stalled;
    };

    return {next, get_generation, get_is_stalled};

}

const game = (function() {
    let rows = 8;
    let cols = 8;

    console.log("Starting game.");
    let grid = CreateGrid(rows, cols);
    grid.set(0,0,1);    
    grid.set(0,1,1);
    grid.set(0,2,1);
    grid.set(0,3,1);
    grid.set(0,4,1);
    grid.set(1,0,1);
    grid.set(1,1,1);
    grid.set(1,2,1);
    grid.set(1,3,1);
    grid.set(1,4,1);
    grid.set(1,5,1);
    grid.set(1,6,1);
    grid.set(2,0,1);
    grid.set(2,1,1);
    grid.set(2,2,1);
    grid.set(2,4,1);
    grid.set(2,5,1);
    grid.set(2,6,1);
    grid.set(2,7,1);
    grid.set(2,3,1);


    const display = CreateGameDisplay("gameboard", rows, cols);
    const game = StartGame(grid, 0);

    let generation = 0;

    const start = function() {
        let timer = setInterval( function() {
            if(game.get_is_stalled() === true) {
                console.log('Game ending...');
                clearInterval(timer);
                return;
            }else{
                console.log(game.is_stalled);
            }
            // update display timer
            console.log('Updating display. Generation: ' + generation );
            for(let row = 0; row < grid.num_rows; row++) {
                for(let col = 0; col < grid.num_cols; col++) {
                    if(grid.get(row, col) === 1) {
                        display.set(row, col);
                    }else{
                        display.set(row, col, "#000");
                    }
                }
            }    

            generation = game.next();
        }, 1000);
    };

    return { start };
})();

document.getElementById('start-button').addEventListener('click',  function() {
    
    game.start();
});

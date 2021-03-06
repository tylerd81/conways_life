/**
 * Create the data structure that is used for the game
 */

function CreateGrid(num_rows, num_cols, start_grid) {

    let grid = [];    

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

    // Create the grid

    for(let row = 0; row < num_rows; row++) {
        grid.push([]); // add a row

        for(let col = 0; col < num_cols; col++) {
            grid[row].push(0);
        }
    }
    grid.num_rows = num_rows;
    grid.num_cols = num_cols;

    // start_grid is an array of (row, col) that will 
    // start out alive
    if(start_grid) {
        start_grid.forEach((p) => grid[p.row][p.col] = 1);
    }        

    return {
        toggle,
        set,
        get,
        num_cols,
        num_rows,
        dump_grid, //debugging
    };
};


function RunSimulation(gameboard) {

    let generation = 0;
    let gen_without_change = 0;
    let generation_stall = 5; // how many non-changing generations before
                              // quitting.
    
    let is_stalled = false;
    
    let births = 0;
    let deaths = 0;

    const update_grid = function update_grid() {        
        generation++;

        // end the simulation if there haven't been any changes
        if(gen_without_change >= generation_stall) {
            console.log('No changes, ending.');            
            is_stalled = true;    
            return;
        }

        let changes = 0;
    
        //create a list of changes, change everything at once

        for(let row = 0; row < gameboard.num_rows; row++) {
            let change_list = [];

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
                        //gameboard.set(row, col, 0);
                        change_list.push({row: row, col: col, val: 0});
                        //console.log(`Cell (${row}, ${col}) died.`);
                        changes++;
                        deaths++;
                    }else if(num_nbors > 3) {
                        // cell   dies overpopulation
                        //gameboard.set(row, col, 0);
                        change_list.push({row: row, col: col, val: 0});
                        //console.log(`Cell (${row}, ${col}) died.`);
                        changes++;
                        deaths++;
                    }
                }else{

                    //dead cell
                    if(num_nbors === 3) {
                        //cell is born
                        //console.log('Cell is born.');
                        //gameboard.set(row, col, 1);
                        change_list.push({row: row, col: col, val: 1});
                        changes++;
                        births++;
                    }
                }
            }           
            if(change_list.length != 0) {
                change_list.forEach( function(p) {
                    gameboard.set(p.row, p.col, p.val);
                });
            }
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

    const get_deaths = function() {
        return deaths;
    };

    const get_births = function() {
        return births;
    }

    const get_is_stalled = function() {
        return is_stalled;
    };

    return {next, get_generation, get_is_stalled, get_deaths, get_births};

}

const game = (function() {
    let start_num_rows = 30;
    let start_num_cols = 50;
    let display = null;
    let game = null;
    let grid = null;
    let game_interval = 100;
    console.log("Starting game.");   
   
    display = CreateGameDisplay("gameboard", start_num_rows, start_num_cols);
    
    const init = function init(points) {
        console.log('Initializing game.');
        grid = CreateGrid(start_num_rows, start_num_cols, points);
        //grid.set(0,0,1);
        game = RunSimulation(grid);
    }

    let generation = 0;

    const start = function() {
        let timer = setInterval( function() {
            if(game.get_is_stalled() === true) {
                console.log('Game ending...');
                clearInterval(timer);
                display.display_game_over();
                return;
            }
            // update display timer            
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

            display.set_generation_counter(game.get_generation());
            display.set_birth_counter(game.get_births());
            display.set_death_counter(game.get_deaths());
        }, game_interval);
    };

    document.getElementById('start-button').addEventListener('click',  function() {

        // loop through the html table and find the living cells to create
        // the point array.
        let points = [];
        let html_cells = document.querySelectorAll("td[data-cell_status = 'alive']");

        html_cells.forEach( function(cell) {
            let id = Number.parseInt(cell.id);
            let row = Math.floor(id / start_num_cols);
            let col = (id % start_num_cols);

            if(!(row < start_num_rows && col < start_num_cols)) {
                throw('Error grabbing cell data from html table.');
            }

            points.push({row: row, col: col});
        });

        if(points.length == 0) {
            points = null;
        }
        init(points);          
        start();
    });    
})();




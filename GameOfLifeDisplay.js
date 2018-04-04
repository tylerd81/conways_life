function CreateGameDisplay(table_id, num_rows, num_cols) {

    let table = document.getElementById(table_id);

    if(!table_id || table == null) {
        throw Error('Cannot get the table');
    }

    const cell_height = "10px";
    const cell_width = "10px";
    const cell_color = "#66ff33";

    const create_game_board = function create_game_board(table_id) {

        let id = 0;

        //create the actual table
        for(let row = 0; row < num_rows; row++) {

            let tr = document.createElement('tr');

            for(let col = 0; col < num_cols; col++) {

                let td = document.createElement('td');
                td.id = id++;
                td.width = cell_width;
                td.height = cell_height;
                td.dataset.cell_status = 'dead';

                td.addEventListener('click', function toggle_td_color() {
                    
                    if(td.dataset.cell_status === 'dead') {
                        td.dataset.cell_status = 'alive';
                        console.log('Cell is now ' + td.dataset.cell_status);
                        td.style.backgroundColor = cell_color;

                    }else{                        
                        td.dataset.cell_status = 'dead';
                        console.log('Cell is now ' + td.dataset.cell_status);
                        td.style.backgroundColor = '#000';
                    }
                });

                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    };

    const calc_id = function calc_id(row, col) {

        if(row > num_rows - 1 || col > num_cols - 1) {
            throw Error(`Invalid row or column value: ${row}, ${col}`);
        }

        return (row * num_cols) + col;
    };

    const get_td = function(row, col) {

        let id = calc_id(row, col);
        let td = document.getElementById(Number(id).toString());
        return td;
    };

    const set = function set(row, col, color) {

        if(!color) {
            color = cell_color;
        }

        let td = get_td(row, col);
        td.style.backgroundColor = color;
    };

    const clear = function clear() {

    };


    create_game_board(table_id);
    return { set, clear };
}
//const game_board = CreateGameBoard('gameboard', 30,30);

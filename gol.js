function create_game_board(table_id) {

    let table = document.getElementById(table_id);
    let num_rows = 10;
    let num_cols = 10;
    let id = 0;

    for(let row = 0; row < num_rows; row++) {

        let tr = document.createElement('tr');
        for(let col = 0; col < num_cols; col++) {

            let td = document.createElement('td');
            td.id = id++;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

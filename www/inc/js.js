function conexao(){
    var db = openDatabase('tarefas', '1.0', 'Tarefas', 2 * 1024 * 1024);
    return db;
}

function instalacao(){
    var db = conexao();
    db.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tarefas (id INTEGER PRIMARY KEY AUTOINCREMENT, tarefa)');
    });
}

function novo(){
    var tarefa = $('#tarefa').val();
    var db = conexao();
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO tarefas (tarefa) VALUES (?)', [tarefa]);
    });
    $('#msg').html('Tarefa '+tarefa+' adicionada!');
    $('#tarefa').val('');
    lista();
}

function excluir(id){
    var db = conexao();
    db.transaction(function (tx) {
      tx.executeSql('DELETE FROM tarefas WHERE id = ?', [id]);
    });
    $('#msg').html('Tarefa exclu&iacute;da!');
    lista();
}

function lista(cache){
    $('#resultados').html('');
    var db = conexao();
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM tarefas ORDER BY id DESC', [], function (tx, results) {
           var len = results.rows.length, i;
           msg = "<p style='display: none'>Found rows: " + len + "</p>";
            if(len == 0){
                $('#msg').html('Nenhuma tarefa no momento.');
            }else{
               document.querySelector('#resultados').innerHTML +=  msg;

               for (i = 0; i < len; i++){
                  msg = "<p>[ <a href='#' onclick='excluir("+results.rows.item(i).id+")'>x</a> ] <b>" + results.rows.item(i).tarefa + "</b></p>";
                  document.querySelector('#resultados').innerHTML +=  msg;
               }
            }
        }, null);
    });
}

// Wait for Cordova to load
document.addEventListener('deviceready', onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
    instalacao();
    lista();
}
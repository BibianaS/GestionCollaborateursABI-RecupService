function getUrlVars() {
   var vars = [], hash;   
   var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    
   for (var i = 0; i < hashes.length; i++)
   {
       hash = hashes[i].split('=');
       vars.push(hash[0]);
       vars[hash[0]] = hash[1];
   }
   return vars; 
};

var id = getUrlVars()["id"];
var db;

(function () {
    
    "use strict";
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);               
    };
    function onPause() {
        alert('pause');
    };

    function onResume() { };

    db = window.openDatabase("AnnuaireCollaborateurs", "1.0", "Liste Collaboateurs", 200000);
    //Insere un jeu d'essai et crée la table'
    db.transaction(getEmploye, transaction_error);
   
    function transaction_error(tx, error) {
        $('#busy').hide();
        console.log('Error creation et/ou ouverture de la Bdd : ' + error);
    };

    function getEmploye(tx) {
        $('#busy').show();
        var sql = `select * from  AnnuaireCollaborateurs e where e.Matricule = :id`;
        console.log(tx);
        tx.executeSql(sql, [id], getEmployes_Success);
    };


    function getEmployes_Success(tx, rs) {
        $('#busy').hide();
        $('#matricule').append(`${rs.rows[0].Matricule}`);
        $('#nom').append(`${rs.rows[0].Nom}`);
        $('#prenom').append(`${rs.rows[0].PrenomCollaborateur}`);
        $('#numeroSecu').append(`${rs.rows[0].NumeroSecu}`);     
    };

    

})();
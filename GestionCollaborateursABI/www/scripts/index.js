// Pour obtenir une présentation du modèle Vide, consultez la documentation suivante :
// http://go.microsoft.com/fwlink/?LinkID=397704
// Pour déboguer du code durant le chargement d'une page dans cordova-simulate ou sur les appareils/émulateurs Android, lancez votre application, définissez des points d'arrêt, 
// puis exécutez "window.location.reload()" dans la console JavaScript.
(function () {
    "use strict";

    var db;
    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Gérer les événements de suspension et de reprise Cordova
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        //Création et ouverture de la base des données
        db = window.openDatabase("AnnuaireCollaborateurs", "1.0", "Liste Collaboateurs", 200000);
        //Insere un jeu d'essai et crée la table'
        db.transaction(populateDB, transaction_error, populateDb_Succes);
    };

    
    function populateDB(tx) {

        $('#busy').show();
        tx.executeSql(`drop table if exists AnnuaireCollaborateurs`);
        var sql = `create table if not exists AnnuaireCollaborateurs (  Matricule key, 
                                                                        Nom VARCHAR(50),
                                                                        NumeroSecu INTEGER(3),
                                                                        PhotoCollaborateur VARCHAR(20),
                                                                        PrenomCollaborateur VARCHAR(50))`;
        tx.executeSql(sql);

        $.ajax({
            url: "http://bip10:10000/Service1.svc/Collaborateurs/",
            cahe: false,
            dataType: "json",
            success: function (data) {
                
                var tab = data["GetListCollResult"];
                
                for (var i = 0; i < tab.length; i++) {
                    (function () {
                        var sql = `INSERT into AnnuaireCollaborateurs (Matricule, Nom, NumeroSecu, PhotoCollaborateur, PrenomCollaborateur)
                                    VALUES('${tab[i].Matricule}','${tab[i].NomCollaborateur}', '${tab[i].NumeroSecu}', '${tab[i].PhotoCollaborateur}','${tab[i].PrenomCollaborateur}')`;
                       

                        db.transaction(function (tx) {
                            tx.executeSql(sql);
                        });
                    })();
                }
                
            },
            error: function (request, error) {
                alert("Erreur : " + error.toString());
            }
        });

    };

 
    function transaction_error(tx, error){
        $('#busy').hide();
        console.log('Error creation et/ou ouverture de la Bdd : '+ error);
    }

    function populateDb_Succes() {
        db.transaction(getEmployes, nouverror);
    }

    function nouverror(tx,error){
        console.log("nouverror:"+ error);
    }

    function getEmployes(tx, rs) {
        var sql = `select * from  AnnuaireCollaborateurs`;   
        tx.executeSql(sql, [], getEmployes_Success, errorSelect);
      };

      function errorSelect() {
          console.log("Error select");
      }

    function getEmployes_Success(tx, rs){
        $('#busy').hide();
        $('#wrapper').append(`<div class="row">
            <div class="col-xs-10 col-xs-offset-1" id="collaborateursListe">                
            </div>
        </div>`);

        for (let i = 0; i < rs.rows.length; i++) {
       
            $('#collaborateursListe').append(`<li class="list-group-item">
                                                 <a href="collaDetails.html?id=${rs.rows[i].Matricule}">
                                                ${rs.rows[i].Nom} ${rs.rows[i].PrenomCollaborateur}
                                                </a>
                                               </li>`
                                             );                                            
        }       
      };
    

    

    function onPause() {
        // TODO: cette application a été suspendue. Enregistrez l'état de l'application ici.
    };

    function onResume() {
        // TODO: cette application a été réactivée. Restaurez l'état de l'application ici.
    };
} )();
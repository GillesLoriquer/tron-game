/* ----------------------------------------------------------------------------- Déclarations */

// Constante qui définit la taille de la grille
const HEIGHT_WIDTH_GRID = 240;

// Constante qui définit le pas de la grille (distance entre deux lignes)
const STEP_GRID = 20;

// Constante qui définit la taille en pixel des lignes de la grille
const LINE_WIDTH_GRID = 1;

// Constante qui définit la taille en pixel de la ligne tracée par un joueur
const LINE_WIDTH = 5;

// Variable qui va contenir le canvas du dessin
var canvas;

// Variable qui va contenir le context
var ctx;

// Constante et variable liées au joueur 1
var joueur1;
const J1_COULEUR = "#E84855";

// Constante et variable liées au joueur 2
var joueur1;
const J2_COULEUR = "#1B998B";

// Variable qui garde le joueur qui doit jouer
var lastPlayer;

// Variable globale pour gérer l'afficage du joueur
var joueurToPlay;

// Variable globale qui permet de traçer s'il s'agit d'une première partie
var firstParty = true;

// Variable globale relative à l'élément HTML affichant le score
var score;

// Variable globale du span affichant le nom du joueur 1
var spanJoueur1;

// Variable globale du span affichant le nom du joueur 2
var spanJoueur2;

// On ajoute un listener pour la gestion du jeu avec les touches du clavier
document.addEventListener('keypress', (event) => {
  const nomTouche = event.key;

  if (nomTouche == 'q' && lastPlayer == joueur1) {
    play(document.getElementById("gauche"));
  } else if (nomTouche == 'z' && lastPlayer == joueur1) {
  	play(document.getElementById("haut"));
  } else if (nomTouche == 's' && lastPlayer == joueur1) {
  	play(document.getElementById("bas"));
  } else if (nomTouche == 'd' && lastPlayer == joueur1) {
  	play(document.getElementById("droite"));
  } else if (nomTouche == 'k' && lastPlayer == joueur2) {
  	play(document.getElementById("gauche"));
  } else if (nomTouche == 'o' && lastPlayer == joueur2) {
  	play(document.getElementById("haut"));
  } else if (nomTouche == 'l' && lastPlayer == joueur2) {
  	play(document.getElementById("bas"));
  } else if (nomTouche == 'm' && lastPlayer == joueur2) {
  	play(document.getElementById("droite"));
  }
}, false);

/* ----------------------------------------------------------------------------- Fonctions */

// Fonction d'initiation du jeu
var init = function() {
    // Initiation et dessin de la grille
    canvas = document.getElementById("grid");
    ctx = canvas.getContext('2d');
    drawGrid();

    if (firstParty) {
    	// Init des joueurs
    	joueur1 = createPlayer(1);
    	joueur2 = createPlayer(2);

    	// Init de l'affichage du score
			score = document.getElementById("score");
    	score.innerHTML = "0 - 0";

    	// Init de l'affichage du nom des joueurs
    	spanJoueur1 = document.getElementById("spanJoueur1");
    	spanJoueur2 = document.getElementById("spanJoueur2");
    	spanJoueur1.innerHTML = joueur1.nom;
    	spanJoueur2.innerHTML = joueur2.nom;
    } else {
    	joueur1.lastCoords = [0, HEIGHT_WIDTH_GRID / 2];
    	joueur2.lastCoords = [HEIGHT_WIDTH_GRID, HEIGHT_WIDTH_GRID / 2];
    	score.innerHTML = joueur1.score + " - " + joueur2.score;
    }

    // Tableau global qui gère les coordonnées déjà existantes
    dangerousCoords = [
        [joueur1.lastCoords[0], joueur1.lastCoords[1]],
        [joueur2.lastCoords[0], joueur2.lastCoords[1]]
    ];

    // Variable qui garde le joueur qui doit jouer
    lastPlayer = joueur1;

    // Variable globale pour gérer l'afficage du joueur
    joueurToPlay = document.getElementById("joueurName");

    // Ici on set l'affichage du joueur avec sa couleur
    joueurToPlay.style.color = lastPlayer.couleur;
    joueurToPlay.innerText = "Tour : " + lastPlayer.nom;
}

// Fonction appelée lorsqu'un joueur clique sur un bouton
var play = function(el) {
	// On garde en mémoire les coordonnées x et y du joueurs
	var x = lastPlayer.lastCoords[0];
  var y = lastPlayer.lastCoords[1];
  // On va stocker dans xx et yy les valeurs x et y de déplacement du joueur suite à sont monvement
  // On les initialise avec les valeurs de x et y car xx et yy ne sont jamais modifiés ensembles (déplacement vertical OU horizontal)
  var xx = x;
  var yy = y;

	// On vérifie quel bouton a été cliqué
	switch (el.id) {
		// Si c'est le bouton "haut"
    case "haut": {
        yy = lastPlayer.lastCoords[1] - STEP_GRID;
        lastPlayer.lastCoords[1] -= STEP_GRID;
        break;
    }
    // Si c'est le bouton "bas"
    case "bas": {
        yy = lastPlayer.lastCoords[1] + STEP_GRID;
        lastPlayer.lastCoords[1] += STEP_GRID;
        break;
    }
    // Si c'est le bouton "gauche"
    case "gauche": {
        xx = lastPlayer.lastCoords[0] - STEP_GRID;
        lastPlayer.lastCoords[0] -= STEP_GRID;
        break;
    }
    // Si c'est le bouton "droite"
    case "droite": {
        xx = lastPlayer.lastCoords[0] + STEP_GRID;
        lastPlayer.lastCoords[0] += STEP_GRID;
        break;
    }
  }

    // On appelle la fonction qui va désinner la ligne
    // x et y : position de départ
    // xx et yy : position d'arrivée
    drawLine(x, y, xx, yy);

    // On vérifie si le mouvement est valide à l'aide de la fonction checkValidMoove
    if (checkValidMove(xx, yy)) {
        // Si les coordonnées sont légales on sauvegarde les coordonnées jouées 
        dangerousCoords.push([xx, yy]);

        // On intervertit les joueurs
        if (lastPlayer.nom == joueur1.nom) lastPlayer = joueur2;
        else lastPlayer = joueur1;

        // On modifie le nom du joueur à jour et la couleur du texte
        joueurToPlay.style.color = lastPlayer.couleur;
        joueurToPlay.innerText = "Tour : " + lastPlayer.nom;
    // Sinon on affiche perdu et on appele la fonction init()
    } else {
        alert("Perdu " + lastPlayer.nom + " !");

        // Suivant le joueur qui a perdu, on ajoute 1 au score de son adversaire
        if (lastPlayer == joueur1) joueur2.score += 1;
        else joueur1.score += 1;

        // On rappelle la  fonction init() pour réinitialiser la grille
        init();
    }
}

// Fonction de création de joueur
var createPlayer = function(id) {
	var nomJoueur = window.prompt('Entrez le nom du joueur ' + id);
	var couleurJoueur = "";
	var coords = [];

	// En fonction de l'id (le numéro du joueur), on paramètre les attributs de l'objet à retourner
	switch (id) {
		case 1:
			couleurJoueur = J1_COULEUR;
			coords.push(0);
			coords.push(HEIGHT_WIDTH_GRID / 2);
			break;
		case 2:
			while (joueur1.nom == nomJoueur) {
				alert("Vous avez entré un nom identique au joueur 1 !");
				nomJoueur = window.prompt('Entrez le nom du joueur ' + id);
			}
			couleurJoueur = J2_COULEUR;
			coords.push(HEIGHT_WIDTH_GRID);
			coords.push(HEIGHT_WIDTH_GRID / 2);
			break;
	}

	// Les joueurs sont initialisés, on change donc la valeur de firstParty
	firstParty = false;

	// On retourne un objet de type joueur
	return {nom: nomJoueur, lastCoords: coords, couleur: couleurJoueur, score: 0};
}

// Fonction de création de la grille
var drawGrid = function() {
    ctx.beginPath();
    ctx.lineWidth = LINE_WIDTH_GRID;
    ctx.canvas.width  = HEIGHT_WIDTH_GRID;
    ctx.canvas.height = HEIGHT_WIDTH_GRID;

    for (var x = 0; x <= HEIGHT_WIDTH_GRID; x += STEP_GRID) {
        for (var y = 0; y <= HEIGHT_WIDTH_GRID; y += STEP_GRID) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, HEIGHT_WIDTH_GRID);        
            ctx.stroke();
            ctx.moveTo(0, y);
            ctx.lineTo(HEIGHT_WIDTH_GRID, y);
            ctx.stroke();
        }
    }
};

// Fonction de traçage d'une ligne
var drawLine = function(x, y, xx, yy) {
    // On dessine la ligne
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = lastPlayer.couleur;
    ctx.stroke();
}

// Fonction qui check si un mouvement est valide
var checkValidMove = function(x, y) {
		// Pour chaque élément du tableau des coordonnées interdites
    for (var i = 0; i < dangerousCoords.length; i++) {
        // SI x & y sont égales aux coordonnées du tableau des coordonnées interdites
        // OU que x et y sont inférieurs à 0
        // OU que x et y sont supérieurs à HEIGHT_WIDTH_GRID
        // ALORS retourne false
        // SINON retourne true
        if (x == dangerousCoords[i][0] 
            && y == dangerousCoords[i][1]
            || x < 0
            || y < 0
            || x > HEIGHT_WIDTH_GRID
            || y > HEIGHT_WIDTH_GRID) {
            return false;
        }
    }
    return true;
}

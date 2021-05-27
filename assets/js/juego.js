// Patron modulo
const miModulo = (() => {
    "use strict";

    let deck = [];
    const tipos = ["C", "D", "H", "S"],
          especiales = ["A", "J", "Q", "K"];

    // Medir Puntaje
    /* let puntosJugador = 0,
        puntosComputadora = 0; */
    let puntosJugadores = [];


    // REFERENCIAS AL HTML
    const btnPedir = document.querySelector("#btnPedir"),
          btnDetener = document.querySelector("#btnDetener"),
          btnNuevo = document.querySelector("#btnNuevo");

    const puntosHTML = document.querySelectorAll("small"),
        divCartasJugadores = document.querySelectorAll('.divCartas');



    // Función para iniciar juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let index = 0; index < numJugadores; index++) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerText = 0)
        divCartasJugadores.forEach(elem => elem.innerHTML = '');
        btnDetener.disabled = false;
        btnPedir.disabled = false;

    };


    // Funcion para crear un nuevo deck
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }

        // Libreria Underscore
        return _.shuffle(deck);;
    }


    const pedirCarta = () => {
        if (deck.length === 0) {
            throw "No hay cartas en el deck";
        }
        return deck.pop();
    }

    /* 
     ** Funcion que obtiene el valor de una carta
     ** @isNaN intenta convertir el parámetro pasado a un número. 
        Si el parámetro no se puede convertir, devuelve true; 
        en caso contrario, devuelve false.
     */
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return isNaN(valor) ? (valor === 'A') ? 11 : 10 : valor * 1;
    }


    // Turno: 0 = primer jugador y el último será la computadora 
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement("img");
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add("carta");
        divCartasJugadores[turno].append(imgCarta);

    }

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                alert("Nadie gana");
            } else if (puntosMinimos > 21) {
                alert("Computadora gana!");
            } else if (puntosComputadora > 21) {
                alert("Jugador gana!");
            } else {
                alert("Computadora gana");
            }
        }, 20);
    }


    // Logica de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;

        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

        } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

        determinarGanador();
    };

    // EVENTOS

    // Callback = una funcion que se esta mandando como argumento
    btnPedir.addEventListener("click", () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn("Ya perdiste");
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            console.log("21, genial!");
            btnDetener.disabled = true;
            btnPedir.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener("click", () => {
        btnDetener.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener("click", () => {

        inicializarJuego();

    });

    // Retornar los elementos visibles fuera del modulo 
    return {
        nuevoJuego: inicializarJuego
    };
})();
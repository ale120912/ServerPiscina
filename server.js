const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let trattamenti = [];

server.on('connection', socket => {
    console.log("Nuovo dispositivo connesso!");

    // Invia la lista attuale al nuovo dispositivo
    socket.send(JSON.stringify({ type: "sync", data: trattamenti }));

    socket.on('message', message => {
        const msg = JSON.parse(message);

        if (msg.type === "aggiungi") {
            trattamenti.push(msg.data);
        } else if (msg.type === "modifica") {
            trattamenti[msg.index] = msg.data;
        } else if (msg.type === "elimina") {
            trattamenti.splice(msg.index, 1);
        }

        // Invia aggiornamento a tutti i dispositivi connessi
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "sync", data: trattamenti }));
            }
        });
    });
});

console.log("Server WebSocket in ascolto sulla porta 8080");

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cheerio = require("cheerio");
require("dotenv").config();

const app = express();
const expressWs = require("express-ws")(app);
const options = {
    cameras: process.env.CAM_URLS.split(" ")
}
const game = {
    guard: null,
    remote: null,
    attacker: null,
    spectators: [],
    attacker_num: null,
    repaired: true
};

app.set("view engine", "ejs");
app.enable("strict routing");

app.use(cors({
    origin: ["http://localhost", "http://10.13.138.161"],
    optionsSuccessStatus: 200
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))
app.use("/", express.static("public"))

app.get("/guard", async (req, res) => {
    res.status(200).render("pages/guard", {opt: options});
});

app.get("/spectator", async (req, res) => {
    res.status(200).render("pages/spectator");
});

app.get("/remote", async (req, res) => {
    res.status(200).render("pages/remote");
});

app.get("/attack/:number", async (req, res) => {    
    let number = parseInt(req.params.number);

    if (number == game.attacker_num) {
        res.status(200).render("pages/attack_success", { attack_time: process.env.ATTACK_TIME });
        game.attacker_num = null;
        game.spectators.forEach((socket) => {
            socket.send(JSON.stringify(["attack_success"]));
        });

        setTimeout(() => {
            game.guard?.send(JSON.stringify(["coming"]));
        }, process.env.SCAN_ALERT_TIME * 1000);

        setTimeout(() => {
            generate_attacker_num();
        }, process.env.ATTACK_TIME * 1000);
    }
    else {
        res.status(200).render("pages/attack_fail");
        game.spectators.forEach((socket) => {
            socket.send(JSON.stringify(["attack_fail"]));
        });
    }
});

app.ws("/game", (socket, req) => {
    socket.on("close", () => {
        if (game.spectators.includes(socket)) {
            game.spectators.splice(game.spectators.indexOf(socket), 1);
        }
    });

    socket.on("message", (msg) => {
        msg = JSON.parse(msg);
        let data = "";

        switch (msg[0]) {
            case "guard":
                game.guard = socket;
                game.repaired = false;
                break;
            case "remote":
                game.remote = socket;
                break;
            case "spectator":
                game.spectators.push(socket);
                break;
        }

        if (socket == game.guard) {
            switch (msg[0]) {
                case "needs_repair":
                    data = JSON.stringify(["needs_repair"]);
                    game.repaired = false;
                    game.spectators.forEach((socket) => {
                        socket.send(data);
                    });
                    break;
                case "downloading":
                    data = JSON.stringify(["downloading"]);
                    game.spectators.forEach((socket) => {
                        socket.send(data);
                    });
                    break;
                case "running":
                    data = JSON.stringify(["running"]);
                    game.spectators.forEach((socket) => {
                        socket.send(data);
                    });
                    break;
                case "uploading":
                    data = JSON.stringify(["uploading"]);
                    game.spectators.forEach((socket) => {
                        socket.send(data);
                    });
                    break;
                case "complete":
                    data = JSON.stringify(["complete"]);
                    game.spectators.forEach((socket) => {
                        socket.send(data);
                    });
                    break;
            }
        }

        if (socket == game.remote) {
            switch (msg[0]) {
                case "repairing":
                    data = JSON.stringify(["repairing"]);
                    game.guard?.send(data);
                    break;
                case "repaired":
                    data = JSON.stringify(["repaired"]);
                    game.repaired = true;
                    socket.send(data);
                    game.guard?.send(data);
                    game.spectators.forEach((socket) => {
                        socket.send(data);
                    });
                    break;
                case "attack":
                    data = JSON.stringify(["attacked"]);
                    socket.send(data);
                    game.guard?.send(data);
                    game.spectators.forEach((socket) => {
                        socket.send(data);
                    });
                    break;
            }
        }
    });
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`+-----------------------------+
| Five Nights at Freddy's IRL |
|                             |
|  Server running on port ${process.env.SERVER_PORT}  |
+-----------------------------+`);
});

function generate_attacker_num() {
    let previous_num = game.attacker_num;
    let new_num = Math.floor(Math.random() * process.env.QR_CODES) + 1;
    
    if (new_num != previous_num) game.attacker_num = new_num;
}

generate_attacker_num();
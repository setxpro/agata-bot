import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import socket from "socket.io";
import { Client, LocalAuth } from "whatsapp-web.js";
import crypto from "crypto";
import qrcode from "qrcode";
import delay from "./functions/delay";
import fs from "fs";
import { initialDialog, secondDialog } from "./dialog";

const app = express();

// SERVIÇO EXPRESS
app.use(express.json());
app.use(cors());
app.use("/", express.static(__dirname + "/"));

// CONTROLADORES DO BOT ON E OFF
const dirBot = "../bot";
// const tempoBot = 20000; //milisegundos

if (!fs.existsSync(dirBot)) {
    fs.mkdirSync(dirBot);
}

// Create Server
export const server = http.createServer(app);

// Socket
const io = new socket.Server(server, {
    path: "/socket.io",
    cors: {
        origin: "*",
    },
});

// Talk
// PARÂMETROS DO CLIENT DO WPP
const client = new Client({
    authStrategy: new LocalAuth({ clientId: crypto.randomUUID() }),
    puppeteer: {
        headless: true,
        // CAMINHO DO CHROME PARA WINDOWS (DESCOMENTAR ABAIXO) Para envio de vídeos
        //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu",
        ],
    },
});

// INITIALIZE DO CLIENT DO WPP
client.initialize();

// EVENTOS DE CONEXÃO EXPORTADOS PARA O INDEX.HTML VIA SOCKET
io.on("connection", (socket) => {
    socket.emit("message", "Aguarde só um momento, que eu estou chegando!! ❤️");
    socket.emit(
        "qr",
        "https://cdn-icons-png.flaticon.com/512/4712/4712126.png"
    );

    client.on("qr", (qr) => {
        console.log("QR RECEIVED", qr);
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit("qr", url);
            socket.emit(
                "message",
                "Ágata - Qrcode recebido, aponte a câmera  seu celular!"
            );
        });
    });

    client.on("ready", () => {
        socket.emit("message", "Ágata - Dispositivo pronto!");
        socket.emit(
            "qr",
            "https://cdn-icons-png.flaticon.com/512/4944/4944377.png"
        );
    });

    client.on("authenticated", () => {
        socket.emit("message", "© Ahgata Autenticado!");
        console.log("© Ahgata Autenticado");
    });

    client.on("auth_failure", function () {
        socket.emit("message", "Ágata - Falha na autenticação, reiniciando...");
        console.error("Falha na autenticação com a Ágata");
    });

    client.on("disconnected", (reason) => {
        socket.emit("message", "Ágata - desconectada!");
        console.log("Ágata - desconectada", reason);
        client.initialize();
    });
});

// EVENTO DE ESCUTA/ENVIO DE MENSAGENS RECEBIDAS PELA API
client.on("message", async (msg) => {
    // PARAMETROS CRIAÇÃO DO CONTROLADOR
    const jid = msg.from;
    const dirFrom = "../bot/" + jid.replace(/\D/g, "");
    const from = jid.replace(/\D/g, "");

    // FUNÇÃO DE LEITURA/ESCRITA DO STATUS
    async function readWriteFileJson(botStatus: any) {
        let dataFile: any = [];
        fs.writeFileSync(
            "../bot/" + from + "/bot.json",
            JSON.stringify(dataFile)
        );
        var data = fs.readFileSync("../bot/" + from + "/bot.json");
        var myObject = JSON.parse(`${data}`);
        let newData = {
            status: botStatus,
        };
        await myObject.push(newData);
        fs.writeFileSync(
            "../bot/" + from + "/bot.json",
            JSON.stringify(myObject)
        );
    }

    // CRIAÇÃO DA PASTA DE CONTROLE
    if (!fs.existsSync(dirFrom)) {
        fs.mkdirSync(dirFrom);
        await readWriteFileJson("on");
    }

    // LEITURA DO STATUS ATUAL
    const status = fs
        .readFileSync("../bot/" + from + "/bot.json", "utf8")
        .split(":")[1]
        .replace(/\W/g, "");

    // Se a mensagem não for null e o numero deve ser diferente de 5521...@g.us (numeros de grupo) -- deve ser igual a 5521...@c.us
    if (msg.body !== null && !msg.from.includes("@g.us"))
    
    // Se for igual a status retorna como null
        if (
            msg.from === "status@broadcast" ||
            msg.type.toLocaleLowerCase() === "broadcast_notification"
        ) {
            // Conditions...
            //or
            return null;
        }

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase();
    }

    let oi = "oi";

    // Religa o BOT
    /**
     * Se a mensagem for igual a 4 ou "oi" || "Oi"
     * Ativa o atendimento
     */
    if (
        msg.body === "4" ||
        msg.body === oi  ||
        (msg.body === capitalize(oi) && status === "off")
    ) {
        await readWriteFileJson("on");
        const chat = await msg.getChat();
        await chat.sendStateTyping();
        delay(5000).then(async function () {
            await client.sendMessage(msg.from, "Olá de novo!! 😊");
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            delay(2000).then(async function () {
                await client.sendMessage(
                    msg.from,
                    "Por favor, selecione uma opção para darmos início ao atendimento. 🔥"
                );
                const chat = await msg.getChat();
                await chat.sendStateTyping();
                delay(2000).then(async function () {
                    await client.sendMessage(msg.from, secondDialog);
                });
            });
        });
    }

    // LÓGICA PARA LIGAR E DESLIGAR
    if (status === "off") {
        return;
    }

    /**
     * Se mensagem for diferente de null, vazio retorna 
     */

    if (msg.body !== null || msg.body !== "") {
        if (status === "on" && msg.body !== "1" && msg.body !== "3" && msg.body !== "2")
            msg.reply(initialDialog); // OBS
        if (status === "off") return;
    }

    if (msg.body === "1" && status === "on") {
        await readWriteFileJson("off");

        const chat = await msg.getChat();
        await chat.sendStateTyping();
        delay(3000).then(async function () {
            await client.sendMessage(
                msg.from,
                'Ótimo, estou transferindo o seu atendimanto para um de nossos atendentes, mas se precisar retornar ao menu de opções, basta inserir o numero "4"'
            );
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            delay(2000).then(async () => {
                await client.sendMessage(
                    msg.from,
                    "Lembrando que nossos horário de atendimento é de Segunda a Sexta-feira das 08:00h às 22:00."
                );
                msg.reply("Por gentileza, aguarde um instante.");
            });
        });

        // Lógica para passar o atendimento para um atendente
    }

    if (msg.body === "2" && status === "on") {
        msg.reply(
            "Atendimento Financeiro.\n Poderia nos informar do que se trata o atendimento, para que possamos ir adiantando o nosso atendimento.\n\n Por gentileza, se for aluno nos informe: \n *Nome completo* e *CPF*\n"
        );
        const chat = await msg.getChat();
        await chat.sendStateTyping();
        await readWriteFileJson("off");
        delay(2000).then(async function () {
            msg.reply("Por gentileza, aguarde um instante.");
            await client.sendMessage(
                msg.from,
                'Caso queira iniciar um novo atendimento, basta inserir o numero "4"'
            );
        });
    }

    if (msg.body === "3" && status === "on") {
        await readWriteFileJson("off");
        const chat = await msg.getChat();
        await chat.sendStateTyping();
        delay(2000).then(async function () 
        {
            await client.sendMessage(
                msg.from,
                "Seu atendimento foi finalizado."
            );
            await client.sendMessage(
                msg.from,
                'Caso queira iniciar um novo atendimento, basta inserir o numero "4"'
            );
        });
    }
});

// Scheduler

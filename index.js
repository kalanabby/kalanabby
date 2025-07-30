const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function startBot() {
  // Step 1: Set up authentication state
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

  // Step 2: Create the socket
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: "silent" }),
  });

  // Step 3: Save updated credentials
  sock.ev.on("creds.update", saveCreds);

  // Step 4: Wait for connection open
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ Bot connected successfully!");
      console.log("📱 Your Session ID (JID):", sock.user.id); // This is your sessionId
    } else if (connection === "close") {
      console.log("❌ Connection closed. Trying to reconnect...");
      startBot(); // Restart on disconnect
    }
  });
}

startBot();

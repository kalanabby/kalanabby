const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    // Removed printQRInTerminal
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;

    if (qr) {
      console.log("📱 Scan this QR code with your WhatsApp app:");
      console.log(qr); // You can use a QR code generator here to display it nicely
    }

    if (connection === "open") {
      console.log("✅ Connected to WhatsApp!");
    } else if (connection === "close") {
      console.log("❌ Connection closed. Reconnecting...");
      startSock(); // reconnect
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

startSock();

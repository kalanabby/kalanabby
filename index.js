const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');
const ytdl = require('ytdl-core');
const { Boom } = require('@hapi/boom');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const { version, isLatest } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    if (text?.startsWith("!song ")) {
      const query = text.slice(6).trim();
      
      await sock.sendMessage(msg.key.remoteJid, { text: `🔍 Searching song for: *${query}*\n(Feature under development...)` });

      // You will add song search and download here later
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

startBot();

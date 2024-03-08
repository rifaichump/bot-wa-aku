const {
  downloadMediaMessage,
  PHONENUMBER_MCC, 
  makeCacheableSignalKeyStore, 
  useMultiFileAuthState, 
  DisconnectReason, 
  fetchLatestBaileysVersion, 
  generateForwardMessageContent, 
  prepareWAMessageMedia, 
  generateWAMessageFromContent, 
  generateMessageID, 
  downloadContentFromMessage,
  makeInMemoryStore, 
  jidDecode, 
  proto,
  generateWAMessage,
  WA_DEFAULT_EPHEMERAL,
  BufferJSON,
  generateWAMessageContent,
  areJidsSameUser,
  getContentType
} = require('@adiwajshing/baileys');
const makeWASocket = require('@adiwajshing/baileys').default;
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif } = require('./lib/exif.js');
const os = require('os')
const fs = require('fs')
const fsx = require('fs-extra')
const path = require('path')
const util = require('util')
const moment = require('moment-timezone')
const speed = require('performance-now')
const ms = toMs = require('ms')
const axios = require('axios')
//const fetch = require('node-fetch')
const { exec, spawn, execSync } = require("child_process")
const { performance } = require('perf_hooks')
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)
const { smsg, getGroupAdmins, formatp, jam, formatDate, getTime, isUrl, await, sleep, clockString, msToDate, sort, toNumber, enumGetKey, runtime, fetchJson, getBuffer, json, delay, format, logic, generateProfilePicture, parseMention, getRandom, pickRandom, reSize } = require('./lib/myfunc')
const pino = require('pino');
const NodeCache = require("node-cache");
const ffmpeg = require('fluent-ffmpeg');

const pairing = process.argv.includes("--pairing");

let creds;
try {
  creds = JSON.parse(fs.readFileSync('./sessions/creds.json'));
} catch (e) {
  creds = null;
}
let browser;
    if(!creds) {
      browser = pairing ? ["Chrome (Linux)","",""] : ["Rifai","Bot","1.0.0"];
    } else {
      if(!creds.pairingCode || pairingCode === "") {
        browser = ["Rifai","Bot","1.0.0"];
      } else {
        browser = ["Chrome (Linux)","",""];
      }
    }
    
async function rifaiConnect() {
   const auth = await useMultiFileAuthState("auth");
  const rifai = makeWASocket({
    printQRInTerminal: !pairing,
    browser: browser,
    auth: auth.state,
    logger: pino({ level: "silent"})
  });
  if (pairing && !rifai.authState.creds.registered) {
    const question = pertanyaan => 
      new Promise(resolve => {
      const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
      readline.question(pertanyaan, answer => {
       resolve(answer);
       readline.close();
      });
    });
    const nomorWa = await question("Masukan nomor whatsapp anda: +")
    await console.log("Memuat code....")
    setTimeout(async function () {
      const pairingCode = await rifai.requestPairingCode(nomorWa);
      console.log('Pairing Code Anda : ', pairingCode)
    }, 5000);
  };
  rifai.ev.on("creds.update", auth.saveCreds);
  rifai.ev.on("connection.update", ({ connection }) => {
    if(connection === 'connecting') console.log('Sedang menyambungkan ke nomor')
    if(connection === 'open') console.log('Terhubung ✓')
    if(connection === 'close') connectToWhatsapp();
  });
  rifai.ev.on('messages.upsert', async ({ messages }) => {
    try {
    const msg = messages[0];
    const m = messages[0]
    console.log(messages)
    let id = msg.key.remoteJid
    const isGroup = m.key.remoteJid.endsWith('@g.us')
    function reply(text) {
      rifai.sendMessage(
      msg.key.remoteJid, 
      {text: text},
      {quoted: msg}
      );
    };
    
    if(!msg.message) return;
    const msgType = Object.keys(msg.message)[0];
    const msgText = msgType === "conversation" ? msg.message.conversation : msgType === "extendedTextMessage" ? msg.message.extendedTextMessage.text : msgType === "imageMessage" ? msg.message.imageMessage.caption : msgType === "videoMessage" ? msg.message.videoMessage.caption : "";
    let M = proto.WebMessageInfo
    console.log(M)
    const isFoto = (msgType === "imageMessage")
    const isVideo = (msgType === "videoMessage")
    const isText = (msgType === "conversation")
    console.log('\x1b[33m','\n\nMessage Type: ', '\x1b[92m',`${msgType}`,'\x1b[33m', '\nCommand: ','\x1b[35m',`${msgText} `,'\x1b[33m','\nFrom: ','\x1b[36m',`${msg.pushName}`,'\x1b[0m');
    
    if (!msgText.startsWith(".")) return;
    const command = msgText.replace(/^./g,"").toLowerCase();
    const full_args = msgText.replace(command, '').slice(1).trim()
    
              switch (command) {
                case 's':
                case 'stiker':
                case 'sticker':
                  if (!(isVideo || isFoto) && isText) return reply('Gunakan gambar dengan caption .stiker')
                  const buffer = await downloadMediaMessage(
                    msg,
                    "buffer",
                    {},
                    { logger: pino }
                    )
                  const size = await reSize(buffer, 512, 512)
                  if (isVideo) {
                    sticker = await videoToWebp(buffer)
                  } else if (isFoto) {
                    sticker = await imageToWebp(size)
                  }
                  rifai.sendMessage(m.key.remoteJid, { sticker: sticker}, {quoted: msg})
                break
                case 'rif':
                  rifai.sendMessage(m.chat, {text: 'iajajajajaja'})
                break
              }
            } catch (err) {
            console.log(err)
        }
  });
    rifai.ev.on('group-participants.update', async (anu) => {
      console.log(anu)
      let metadata = await rifai.groupMetadata(anu.id)
      let participants = anu.participants
      for (let num of participants) {
      try {
          ppuser = await rifai.profilePictureUrl(num, 'image')
        } catch (err) {
          ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
        }
        try {
          ppgroup = await rifai.profilePictureUrl(anu.id, 'image')
        } catch (err) {
          ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
        }
        if(anu.action === 'add') {
          rifai.sendMessage(anu.id, {text: 'Selamat Datang', contextInfo: { externalAdReply: { mediaType: 1, title: '', body: '', thumbnailUrl: ppuser, renderLargerThumbnail: false, showAdAttributipn: true }}},{quoted: null})
        } else if (anu.action === 'remove') {
          rifai.sendMessage(anu.id, {text: 'Keluar', contextInfo: { externalAdReply: { mediaType: 1, title: '', body: '', thumbnailUrl: ppuser, renderLargerThumbnail: false, showAdAttributipn: true }}},{quoted: null})
        } else if (anu.action === 'promote') {
          rifai.sendMessage(anu.id, { text: `@${numsg.split('@')[0]} sekarang admin`, contextInfo: { mentionedJid: [num]}},{quoted: null})
        } else if (anu.action === 'demote') {
          rifai.sendMessage(anu.id, { text: `@${numsg.split('@')[0]} sekarang sudah tidak lagi menjadi admin`, contextInfo: { mentionedJid: [num]}},{quoted: null})
        }
      }
  });
};
rifaiConnect();
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(`Update ${__filename}`)
    delete require.cache[file]
    require(file)
});
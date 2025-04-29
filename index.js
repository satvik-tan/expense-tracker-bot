// Import required modules 
const { Client, GatewayIntentBits, Partials } = require('discord.js'); 
require('dotenv').config(); 
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('./credentials.json');

// Create a new Discord client with appropriate intents
const client = new Client({ 
  intents: [ 
      GatewayIntentBits.Guilds,  
      GatewayIntentBits.GuildMessages,  
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel]
}); 

// Extract the actual spreadsheet ID from the URL or use the ID directly
const getSpreadsheetId = (urlOrId) => {
  if (urlOrId.includes('spreadsheets/d/')) {
    const match = urlOrId.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : urlOrId;
  }
  return urlOrId;
};

const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });



const spreadsheetId = getSpreadsheetId(process.env.SHEET_ID);
const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth );

async function addExpense(message){
    const text = message.content.trim().slice('!addExpense'.length).trim(); // Removes !addExpense from the start of the message

    const [amountStr, category, ...descriptionParts] = text.split(' ');
    const amount = parseFloat(amountStr);

    if(isNaN(amount) || !category || descriptionParts.length === 0){
       return message.reply('Invalid format. Please use: !addExpense <amount> <category> <description>');
        
    }

    const description = descriptionParts.join(' ');
    const date = new Date().toLocaleDateString('en-IN');

    try {
       
        
        
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // First sheet

        //checking if header is there or not

        try {
            await sheet.loadHeaderRow();
        } catch (err) {
            if (err.message.includes('No values in the header row')) {
                console.log("No header row found, setting one now...");
                await sheet.setHeaderRow(['Date', 'Amount', 'Category', 'Description']);
            } else {
                throw err; // other unexpected error
            }
        }
        

        await sheet.addRow({ Date: date, Amount: amount, Category: category, Description: description });
        return message.reply(`✅ Expense saved: ₹${amount} on ${category} (${description})`);
    } catch (error) {
        console.error('Google Sheets error:', error);
        throw error;
    }
}

// Bot is ready 
client.once('ready', () => { 
    console.log(`🤖 Logged in as ${client.user.tag}`); 
}); 

// Listen and respond to messages 
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
 
    if (message.content.startsWith('!addExpense')) {
        console.log('Expense command detected');  // Debug log
        try {
            await addExpense(message);
        } catch (err) {
            console.error(err);
            message.reply("Something went wrong while adding the expense :(");
        }
    }
});

client.login(process.env.DISCORD_TOKEN)
  .catch(error => {
    console.error('Failed to log in:', error.message);
    if (error.message.includes('disallowed intents')) {
      console.error('\nMESSAGE CONTENT INTENT ERROR: You need to enable the Message Content Intent in the Discord Developer Portal.');
    }
  });

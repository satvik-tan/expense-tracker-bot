# 💸 Expense Tracker Discord Bot

This is a simple Discord bot that allows users to log their expenses directly into a Google Spreadsheet using a `!addExpense` command.

## ✨ Features

- Record expenses with amount, category, and description.
- Automatically logs the date.
- Stores data in Google Sheets via Google Sheets API.
- Easy-to-use command format on Discord.

## 🚀 Usage

Inside any Discord channel where the bot is active:

Example: !addExpense <amount> <category> <description>
         !addExpense 500 Food Lunch at cafe

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/satvik-tan/expense-tracker-bot.git
    cd expense-tracker
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Set up your Google Sheets API credentials:
    - Go to [Google Developers Console](https://console.developers.google.com/).
    - Create a project and enable the Google Sheets API.
    - Create service account credentials and download the JSON file.
    - Rename the file to `credentials.json` and place it in the project directory.

4. Set up the environment variables:
    - Create a `.env` file in the root of the project.
    - Add the following lines to the `.env` file:
      ```bash
      DISCORD_TOKEN=your-discord-bot-token
      SHEET_ID=your-google-sheet-id
      ```
    - Replace `your-discord-bot-token` with your Discord bot token and `your-google-sheet-id` with the ID of your Google Sheet.

## License

This project is licensed under the MIT License
   

## Setup

### Requirements
NodeJs installed

### Install Instructions

1. Install dependencies using `npm install`
	1. You might need to run `npm install discord.js` too
	2. (UNIX) Puppeteer.js may need additional setup
		`sudo apt-get install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm1`
2. Copy `auth.json.dist` and remove the `.dist`.
3. Add your bot token and api keys to `auth.json`.
4. (Optional) Configure any properties in `config.json`.

### Start the Bot

Windows
`node app.js`

### Stop the Bot

Windows
`CTRL + C`
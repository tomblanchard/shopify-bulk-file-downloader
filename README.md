# Shopify Bulk File Downloader

## Requirements

* Node.js (Download and run the installer from [nodejs.org](http://nodejs.org))

## Usage

1. Download or clone this repo
2. Open Terminal and navigate to the appropriate directory, run the command `cd shopify-bulk-file-downloader`
3. Run the command `npm i`
4. Open Chrome and navigate to `https://shop.myshopify.com/admin/settings/files`
5. Open the file `./client.min.js` and copy the code into the Chrome Developer Tools console and press the Enter key, paste results copied to your clipboard into the file `./file-urls.json`
6. Go back to the Terminal and run the command `node server`, files will start downloading into `./files/` directory, you'll see a "Success!" message when it's finished
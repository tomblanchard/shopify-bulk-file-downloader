var Downloader = require('nodejs-file-downloader');

var fileUrls = require('./file-urls');

var currentFile = 0;

var totalSuccessCount = 0;

downloadFile(fileUrls[currentFile]);

async function downloadFile(fileUrl) {
  var downloader = new Downloader({
    url: fileUrl,
    directory: './files',
    cloneFiles: false,
    maxAttempts: 5,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12.6; rv:105.0) Gecko/20100101 Firefox/105.0'
    }
  });

  try {
    (async () => {
      var { filePath } = await downloader.download();

      currentFile++;
      totalSuccessCount++;

      console.log(`Success - File number: ${currentFile} - File name: ${filePath.replace('./files/', '')}`);
      console.log(`Total success count: ${totalSuccessCount}`);

      if (currentFile >= fileUrls.length) {
        return;
      }

      downloadFile(fileUrls[currentFile]);
    })();
  } catch (error) {
    console.log('Error', error);
  }
};

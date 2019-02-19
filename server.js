var fs = require("fs");
var fetch = require("node-fetch");

var file_urls = require("./file-urls");

if (!fs.existsSync("./files")) fs.mkdirSync("./files");

var promises = file_urls.map((file_url) => {
  return fetch(file_url)
    .then((res) => {
      var file_name = res.url.split("/").pop().split("?")[0];
      var dest = fs.createWriteStream(`./files/${file_name}`);
      res.body.pipe(dest);
    })
    .catch((err) => {
      console.log(err);
    });
});

Promise.all(promises)
  .then(() => {
    console.log("Success!")
  })
  .catch((err) => {
    console.log("Error!")
  });

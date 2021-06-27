var copy_to_clipboard = copy;

var LIMIT = 250;

var all_file_urls = [];

var current_page = 0;

get_file_urls();

function get_file_urls(cursor = '') {
  fetch(`/admin/settings/files?limit=${LIMIT}&after=${cursor}`, {
    credentials: 'same-origin'
  })
    .then((res) => res.text())
    .then((res) => {
      var res_document = new DOMParser().parseFromString(res, 'text/html');

      var json_element = res_document.querySelector('[data-serialized-id="apollo"]');
      var json = JSON.parse(json_element.innerHTML);

      var keys = Object.keys(json).filter((key) => {
        return key.startsWith('Image:gid:') || key.startsWith('GenericFile:gid:');
      });

      var objects = keys.map((key) => json[key]);

      var urls = objects.map((object) => {
        return object.originalSrc || object.url;
      });

      var root_query_files_objects = Object.keys(json).reduce((acc, key) => {
        if (json[key].cursor) {
          acc = acc.concat(json[key]);
        }

        return acc;
      }, []);

      var root_query_files_objects_last = root_query_files_objects.slice(-1)[0];

      all_file_urls = all_file_urls.concat(urls);

      current_page += 1;

      console.log(`Still working - currently on page ${current_page}`);

      if (!root_query_files_objects_last) {
        copy_to_clipboard(all_file_urls);
        alert('File URLS have been copied to your clipboard!');
        return;
      }

      get_file_urls(root_query_files_objects_last.cursor);
    })
    .catch((err) => {
      console.log(err);
    });
};

var copy_to_clipboard = copy;

var LIMIT = 250;

get_pages_count()
  .then((pages_count) => {
    var promises = Array.from({ length: pages_count }, (_, index) => {
      return () => $.get(`/admin/settings/files?limit=${LIMIT}&page=${(index + 1)}`)
        .then((res) => {
          var div = document.createElement("div");

          div.innerHTML = res;

          var file_inputs = div.querySelectorAll("tbody .next-input");
          var file_inputs_urls = Array.from(file_inputs).map((input) => input.value);

          return file_inputs_urls;
        });
    });

    var promise = Promise_sequential(promises);

    promise
      .then((res) => {
        res = res
          .reduce((acc, item) => {
            acc = acc.concat(item);
            return acc;
          }, [])
          .filter((item, index, array) => {
            return array.indexOf(item) === index;
          });

        copy_to_clipboard(res);
        alert("File URLS have been copied to your clipboard!");
      })
      .catch((err) => {
        console.log(err);
      });
  });

function get_pages_count() {
  return new Promise((resolve, reject) => {
    var pages_count = 1;

    poll();

    async function poll() {
      var res = await $.get(`/admin/settings/files?limit=${LIMIT}&page=${pages_count}`);

      var div = document.createElement("div");

      div.innerHTML = res;

      var tbody = div.querySelector("tbody");

      if (tbody) {
        pages_count += 1;
      } else {
        return resolve((pages_count - 1));
      }

      return poll();
    };
  });
};

function Promise_sequential(r) {
  if(!Array.isArray(r))throw new Error("First argument need to be an array of Promises");let e=0,n=[];return r.concat(()=>Promise.resolve()).reduce((r,o)=>r.then(function(r){return 0!=e++&&n.push(r),o(r,n,e)}),Promise.resolve(!1)).then(()=>n)
};

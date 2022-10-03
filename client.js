var copyToClipboard = copy;

var LIMIT = 250;

var allFileUrls = [];

var currentPage = 0;

var csrfToken = JSON.parse(
  document.querySelector('[data-serialized-id="csrf-token"]').innerHTML
);

var query = `
  query FilesManagerFiles($first: Int, $after: String, $sortKey: FileSortKeys, $reverse: Boolean, $query: String) {
    files(
      first: $first
      after: $after
      sortKey: $sortKey
      reverse: $reverse
      query: $query
    ) {
      edges {
        cursor
        node {
          ... on GenericFile {
            url
          }
          ... on MediaImage {
            image {
              url
            }
          }
          ... on Video {
            originalSource {
              url
            }
          }
        }
      }
    }
  }
`;

getFileUrls();

function getFileUrls(cursor = null) {
  var body = {
    operationName: 'FilesManagerFiles',
    query: query,
    variables: {
      first: LIMIT,
      after: cursor,
      sortKey: 'CREATED_AT',
      reverse: true,
      query: 'status:ready'
    }
  };

  fetch('/admin/internal/web/graphql/core?operation=FilesManagerFiles&type=query', {
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-csrf-token': csrfToken
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);

      var fileUrls = res.data.files.edges
        .map((edge) => {
          return (
            edge.node.url ||
            (edge.node.image && edge.node.image.url) ||
            (edge.node.originalSource && edge.node.originalSource.url)
          );
        });

        var fileLastCursor = (
          res.data.files.edges.length ? res.data.files.edges.slice(-1)[0].cursor : null
        );

        allFileUrls = allFileUrls.concat(fileUrls);

        currentPage += 1;

        console.log(`Still working - currently on page ${currentPage}`);

        if (!fileLastCursor) {
          copyToClipboard(allFileUrls);
          alert('File URLS have been copied to your clipboard!');
          return;
        }

        getFileUrls(fileLastCursor);
    })
    .catch((err) => {
      console.log(err)
    });
};

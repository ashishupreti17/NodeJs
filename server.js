const http = require("http");
const { todo } = require("node:test");

const todos = [
  { id: 1, name: "abc" },
  { id: 2, name: "xyz" },
  { id: 3, name: "pqr" },
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  let status = 400;
  const response = {
    success: false,
    data: null,
  };

  let body = [];
  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      // console.log(body)

      if (method === "GET" && url === "/products") {
        status = 200;
        response.success = true;
        response.data = todos;
      } else if (method === "POST" && url === "/products") {
        const { id, name } = JSON.parse(body);

        if (!id || !name) {
          status = 400;
        } else {
          status = 201;
          todos.push({ id, name });
          response.success = true;
          response.data = todos;
        }
      }

      res.writeHead(status, {
        "Content-Type": "application/json",
        "X-Powered-By": "Node Server",
      });

      res.end(JSON.stringify(response));
    });
});

const PORT = 5000;

server.listen(PORT, () =>
  console.log(`Server is up and running at port ${PORT}`)
);

const io = require("socket.io")();
const port = process.env.PORT || 5000;
const path = require("path");
require("dotenv").config({
  path: path.join(process.cwd(), "/config/.env"),
});

io.on("connection", (client) => {
  client.emit("init", { data: "hello mehdi" });
  console.log(client);
});
io.listen(port)

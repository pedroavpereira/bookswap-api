require("dotenv").config();
const server = require("./websocket");

const PORT = process.env.PORT || 3001;

console.log("TESTING");

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

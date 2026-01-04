
require("dotenv").config();
const axios = require("axios");

const rpcUrl = `http://${process.env.RPC_HOST}:${process.env.RPC_PORT}`;

const rpcClient = axios.create({
  baseURL: rpcUrl,
  auth: {
    username: process.env.RPC_USER,
    password: process.env.RPC_PASSWORD,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

let idCounter = 0;

async function callRpc(method, params = []) {
  const response = await rpcClient.post("/", {
    jsonrpc: "1.0",
    id: idCounter++,
    method,
    params,
  });

  if (response.data.error) {
    throw new Error(response.data.error.message);
  }

  return response.data.result;
}

module.exports = {
  callRpc,
};

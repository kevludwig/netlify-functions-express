import serverless from "serverless-http";
import expressApp from "./app";

const functionName = "express";
const app = expressApp(functionName);
exports.handler = serverless(app);

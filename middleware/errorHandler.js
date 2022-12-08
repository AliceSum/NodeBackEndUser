import { logEvents } from "./logEvents.js";

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, `errLog.txt`);
  //console.error(err.stack);  uncomment it for debugging
  res.status(500).send(err.message);
};

export default errorHandler;

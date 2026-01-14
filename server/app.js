import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createTables } from "./utils/createTable.js";

const app = express();
config()
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
  })
);

createTables()

export default app;

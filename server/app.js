import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createTables } from "./utils/createTable.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import productRoute from './routes/productRoutes.js';

const app = express();
config({
  path: "./config/.env"
})
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


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', productRoute)

app.use(errorMiddleware)
export default app;

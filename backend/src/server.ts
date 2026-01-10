import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import routes from "./routes";

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?appName=${process.env.APP_NAME}`;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

app.use("/api", routes);

mongoose
	.connect(DB_URI as string)
	.then(() => {
		console.log("✅ Connected to the database");
		app.listen(3000);
	})
	.catch((error) => {
		console.log("error", error);
	});

import express from "express";
import passport from "./utils/passportConfig";
import cors from "cors";
import authRouter from "./routes/authRouter";

const app = express();
const port = 3000;

app.use(cors());
app.use(passport.initialize());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

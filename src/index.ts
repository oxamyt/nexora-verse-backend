import express from "express";
import passport from "./utils/passportConfig";
import cors from "cors";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import session from "express-session";
import "dotenv/config";

const SESSION_SECRET = process.env.SESSION_SECRET as string;

const app = express();
const port = 3000;

app.use(cors());
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(express.json());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

import express from "express";
import passport from "./utils/passportConfig";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import postRouter from "./routes/postRouter";
import likeRouter from "./routes/likeRouter";
import followRouter from "./routes/followRouter";
import messageRouter from "./routes/messageRouter";
import commentRouter from "./routes/commentRouter";
import { setupSocketHandlers } from "./socketHandlers/socketHandlers";
import session from "express-session";
import "dotenv/config";

const SESSION_SECRET = process.env.SESSION_SECRET as string;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
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
app.use("/posts", postRouter);
app.use("/likes", likeRouter);
app.use("/comments", commentRouter);
app.use("/follows", followRouter);
app.use("/messages", messageRouter(io));
setupSocketHandlers(io);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

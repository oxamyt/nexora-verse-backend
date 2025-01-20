import jwt from "jsonwebtoken";
import "dotenv/config";
const jwtSecret = process.env.PASSPORT_SECRET as string;

function signToken({ userId }: { userId: number }) {
  return jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "3h" });
}

export default signToken;

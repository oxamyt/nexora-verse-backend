import "dotenv/config";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";

const jwtSecret = process.env.PASSPORT_SECRET as string;
const githubClientId = process.env.GITHUB_CLIENT_ID as string;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET as string;
const githubCallbackUrl = process.env.GITHUB_CALLBACK_URL as string;

const prisma = new PrismaClient();

const opts = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.sub },
      });
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: githubCallbackUrl,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: Function
    ) => {
      try {
        const avatarUrl =
          profile.photos && profile.photos.length > 0
            ? profile.photos[0].value
            : "";

        const user = await prisma.user.findUnique({
          where: {
            githubId: profile.id,
          },
        });
        if (!user) {
          const user = await prisma.user.create({
            data: {
              githubId: profile.id,
              username: profile.username || "Unknown",
              avatarUrl: avatarUrl,
            },
          });
          return done(null, user);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;

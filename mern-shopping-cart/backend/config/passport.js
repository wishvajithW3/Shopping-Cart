import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";

const createOrFindOAuthUser = async ({ name, email, provider, providerId }) => {
  const finalEmail =
    email && email.trim() !== ""
      ? email.toLowerCase()
      : `${providerId}@${provider}.local`;

  let user = await User.findOne({ email: finalEmail });

  if (!user) {
    user = await User.create({
      name: name || `${provider} User`,
      email: finalEmail,
      provider,
      providerId,
      password: undefined,
      role: "user",
      passkeys: [],
    });
  } else {
    user.provider = user.provider || provider;
    user.providerId = user.providerId || providerId;
    await user.save();
  }

  return user;
};

export const setupPassport = () => {
  const serverUrl = process.env.SERVER_URL || "http://localhost:5001";

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      "google",
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${serverUrl}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;

            const user = await createOrFindOAuthUser({
              name: profile.displayName || "Google User",
              email,
              provider: "google",
              providerId: profile.id,
            });

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    console.log("Google OAuth strategy loaded");
  } else {
    console.log("Google OAuth strategy NOT loaded");
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      "facebook",
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: `${serverUrl}/api/auth/facebook/callback`,
          profileFields: ["id", "displayName"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await createOrFindOAuthUser({
              name: profile.displayName || "Facebook User",
              email: `${profile.id}@facebook.local`,
              provider: "facebook",
              providerId: profile.id,
            });

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    console.log("Facebook OAuth strategy loaded");
  } else {
    console.log("Facebook OAuth strategy NOT loaded");
  }

  return passport;
};

export default passport;
import express from "express";
import passport from "passport";

import {
  register,
  login,
  profile,
  passkeyRegisterOptions,
  passkeyRegisterVerify,
  passkeyLoginOptions,
  passkeyLoginVerify,
  oauthSuccess,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);

router.post("/passkey/register-options", passkeyRegisterOptions);
router.post("/passkey/register-verify", passkeyRegisterVerify);
router.post("/passkey/login-options", passkeyLoginOptions);
router.post("/passkey/login-verify", passkeyLoginVerify);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login`,
    session: false,
  }),
  oauthSuccess
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    session: false,
  })
);

router.get("/facebook/callback", (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Facebook OAuth Error:", err.message);

      return res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=facebook_login_failed`
      );
    }

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=facebook_login_cancelled`
      );
    }

    req.user = user;
    return oauthSuccess(req, res);
  })(req, res, next);
});

export default router;
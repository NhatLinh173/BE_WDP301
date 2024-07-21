const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const FacebookTokenStrategy = require("passport-facebook-token");
const config = require("../utils/config");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

// Local strategy for username/password authentication
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Generate JWT token
exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: "1d" });
};

// JWT strategy for token-based authentication
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretKey,
};

passport.use(
  new JwtStrategy(jwtOpts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Facebook token strategy for Facebook OAuth authentication
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ facebookId: profile.id });
        if (user) {
          return done(null, user);
        }
        const newUser = new User({
          username: profile.displayName,
          facebookId: profile.id,
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Middleware to verify JWT token
exports.verifyUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to verify admin role
exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  }
  const err = new Error("You are not authorized to perform this operation!");
  err.status = 403;
  return next(err);
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3005/api/user/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const GooglePlusTokenStrategy = require("passport-google-plus-token");

const mongoose = require("mongoose");
const keys = require("../config/keys");
const User = mongoose.model("User");

const opts = {};
// take bearer from the Authorization Header in request
// we are setting this for axios
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.JWT_SECRET;

passport.use(
  "jwt",
  new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log(jwt_payload);
    User.findById(jwt_payload.id)
      .then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
  })
);

passport.use(
  "googleToken",
  new GooglePlusTokenStrategy(
    {
      clientID: keys.GOOGLE_CLIENT_ID,
      clientSecret: keys.GOOGLE_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      // Should have full user profile over here
      console.log("profile", profile);
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      // User.findOrCreate({'google.id': profile.id}, function(error, user) {
      //     return next(error, user);
      // });
    }
  )
);

// module.exports = passport => {
//   passport.use(
//     new JwtStrategy(opts, (jwt_payload, done) => {
//       // console.log(jwt_payload);
//       User.findById(jwt_payload.id)
//         .then(user => {
//           if (user) {
//             return done(null, user);
//           }
//           return done(null, false);
//         })
//         .catch(err => console.log(err));
//     })
//   );
// };

import passport from 'passport';
import Google from 'passport-google-oauth20';
import keys from '../../config/keys';
import mongoose from 'mongoose';
const GoogleStrategy = Google.Strategy;

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
}, (accessToken, refreshToken, profile, done) => {
    User.findOne( { googleId: profile.id })
        .then((existingUser) => {
            console.log(existingUser);
            if (existingUser) {
                // We already have a record with the given profile Id
                console.log('User already exists');
                done(null, existingUser);
            } else {
                new User({ googleId: profile.id })
                    .save()
                    .then(user => done(null, user));
            }
        });
    }
)
);
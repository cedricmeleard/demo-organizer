/**
 * Created by cedric on 09/05/16.
 */
function route(app) {
    const session = require('express-session');
    const passport = require('passport');
    // API Access link for creating client ID and secret:
    app.use(session({ secret: 'keyboard cat' }));
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    //load configuration client_Id and client_Secret
    const config = require('./config').googleAuth;
    const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    passport.use(new GoogleStrategy({
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL : config.GOOGLE_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
                return done(null, profile);
            });
        }
    ));
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    app.get('/login', (req, res, next) => {
        res.sendFile(__dirname + '/views/login.html');
    });

    app.get('/auth/google', passport.authenticate('google',
        { scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'] }),
        (req, res) => {
        } // this never gets called
    );

    app.get('/oauth2callback', passport.authenticate('google',
        {successRedirect: '/home', failureRedirect: '/login'}
    ));

    app.engine('html', require('ejs').renderFile);

    function publicViewable(req, res, next) {
        return next();
    }
    app.use('/print', publicViewable);
    app.get('/print', (req, res) => {
        res.render(__dirname + '/views/print.html');
    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }

    app.use('/home', ensureAuthenticated);
    //serve user view, this will display quiz
    app.get('/home', (req, res) => {
        res.render(__dirname + '/views/index.html', { user : JSON.stringify( new User(req.user) ) } );
    });

    app.use('/create', ensureAuthenticated);
    app.get('/create', (req, res) => {
        res.render(__dirname + '/views/create.html', { user : JSON.stringify( new User(req.user) ) } );
    });

    app.use('/users', ensureAuthenticated);
    app.get('/users', (req, res) => {
        res.render(__dirname + '/views/users.html', { user : JSON.stringify( new User(req.user) ) } );
    });

    app.use('/archive', ensureAuthenticated);
    app.get('/archive', (req, res) => {
        res.render(__dirname + '/views/archive.html', {user: JSON.stringify(new User(req.user))});
    });

    app.use('*', (req, res) => {
        res.redirect('/home');
    });

    function User(user) {
        return {
            id :    user.id,
            name :  user.displayName,
            photo : user.photos[0].value
        };
    }
}

module.exports = route;

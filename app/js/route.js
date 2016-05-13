/**
 * Created by cedric on 09/05/16.
 */
function route(app) {
    var session = require('express-session');
    var passport = require('passport');
    // API Access link for creating client ID and secret:
    app.use(session({ secret: 'keyboard cat' }));
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());


    var config = {
        GOOGLE_CLIENT_ID: "--client-id--",
        GOOGLE_CLIENT_SECRET: "--client secret--",
        GOOGLE_CALLBACK_URL: "http://localhost:81/oauth2callback"
    };
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    passport.use(new GoogleStrategy({
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL : config.GOOGLE_CALLBACK_URL,
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                return done(null, profile);
            });
        }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    app.get('/login', function(req, res, next) {
        res.sendFile(__dirname + '/views/login.html');
    });

    app.get('/auth/google', passport.authenticate('google',
        { scope: ['https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'] }),
        function(req, res){} // this never gets called
    );

    app.get('/oauth2callback', passport.authenticate('google',
        {successRedirect: '/home', failureRedirect: '/login'}
    ));

    app.engine('html', require('ejs').renderFile);

    function publicViewable(req, res, next) {
        return next();
    }

    app.use('/print', publicViewable);
    app.get('/print', function (req, res) {
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
    app.get('/home', function (req, res) {
        res.render(__dirname + '/views/index.html', { user : JSON.stringify( new User(req.user) ) } );
    });

    app.use('/create', ensureAuthenticated);
    app.get('/create', function (req, res) {
        res.render(__dirname + '/views/create.html', { user : JSON.stringify( new User(req.user) ) } );
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

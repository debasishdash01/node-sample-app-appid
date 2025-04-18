const express = require('express'); 								// https://www.npmjs.com/package/express
const session = require('express-session');							// https://www.npmjs.com/package/express-session
const passport = require('passport');								// https://www.npmjs.com/package/passport
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;	// https://www.npmjs.com/package/ibmcloud-appid
const CALLBACK_URL = "/ibm/cloud/appid/callback";

const app = express();

// Warning The default server-side session storage implementation, MemoryStore, 
// is purposely not designed for a production environment. It will 
// leak memory under most conditions, it does not scale past a single process, 
// and is meant for debugging and developing.
// For a list of stores, see compatible session stores below
// https://www.npmjs.com/package/express-session#compatible-session-stores
app.use(session({
	secret: "123456",
	resave: true,
	saveUninitialized: true
 }));
 app.use(passport.initialize());
 app.use(passport.session());

// Fetch the credentials from the IBM Cloud App ID Instance and paste below 
passport.use(new WebAppStrategy({
	tenantId: "",
	clientId: "",
	secret: "",
	oauthServerUrl: "",
	redirectUri: "http://localhost:3000" + CALLBACK_URL
}));

passport.serializeUser(function(user, cb) {
	cb(null, user);
	});
 passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
	});

// Handle callback
app.get(CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME));

//Protected Endpoints
// Handle Login
app.get('/appid/login', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
	successRedirect: '/',
	forceLogin: true
}));

// Handle logout
app.get('/appid/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            // Pass any errors to the error-handling middleware
            return next(err);
        }
        // Optionally clear session data (e.g., App ID-specific context)
        delete req.session['appid-auth-context']; // Adjust key if needed
        // Redirect the user after logout
        res.redirect('/');
    });
});

// Protect the whole app
// app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));

// Make sure only requests from an authenticated browser session can reach /api
app.use('/api', (req, res, next) => {
	if (req.user){
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
});

// The /api/user API used to retrieve name of a currently logged in user
app.get('/api/user', (req, res) => {
	// console.log(req.session[WebAppStrategy.AUTH_CONTEXT]);
	res.json({
		user: {
			name: req.user.name
		}
	});
});

// Serve static resources
app.use(express.static('./public'));

// Start server
app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});
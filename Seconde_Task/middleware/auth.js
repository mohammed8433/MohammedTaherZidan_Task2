// middleware/auth.js (Create this new file/folder)
const protect = (req, res, next) => {
  if (req.session.userId) {
    next(); // User is authenticated, proceed
  } else {
    // User is not logged in, redirect to login page
    res.redirect('/auth/login?redirect=' + req.originalUrl);
  }
};

module.exports = { protect };
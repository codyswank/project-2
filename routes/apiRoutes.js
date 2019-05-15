var db = require("../models");

module.exports = function(app, passport) {
  app.post(
    "/register",
    passport.authenticate("local-signup", {
      successRedirect: "/",
      failureRedirect: "/register"
    })
  );

  app.post(
    "/signin",
    passport.authenticate("local-signin", {
      successRedirect: "/",
      failureRedirect: "/signin"
    })
  );
  //WATCHEDLIST

  //Get all examples
  app.get("/api/watchedlist", skipIfNotLoggedIn, function(req, res) {
    db.WatchedList.findAll({
      where: { UserId: req.session.passport.user }
    }).then(function(dbWatchedList) {
      res.json(dbWatchedList);
    });
  });

  // Create a new example
  app.post("/api/watchedList", skipIfNotLoggedIn, function(req, res) {
    db.WatchedList.findOrCreate({
      where: {
        UserId: req.session.passport.user,
        apiId: req.body.id
      },
      defaults: {
        UserId: req.session.passport.user,
        apiId: req.body.id
      }
    }).then(function(dbWatchedList) {
      res.json(dbWatchedList);
    });
  });

  // Delete an example by id
  app.delete("/api/watchedList/:id", skipIfNotLoggedIn, function(req, res) {
    db.WatchedList.destroy({
      where: {
        id: req.params.id,
        userId: req.session.passport.user
      }
    }).then(function(dbWatchedList) {
      res.json(dbWatchedList);
    });
  });

  //WISHLIST

  //Get all examples
  app.get("/api/wishlist", skipIfNotLoggedIn, function(req, res) {
    db.WishList.findAll({}).then(function(dbWishList) {
      res.json(dbWishList);
    });
  });

  // Create a new example
  app.post("/api/wishList", skipIfNotLoggedIn, function(req, res) {
    console.log("hit wishlist", req.session);
    db.WishList.create({
      userId: req.session.passport.user,
      apiId: req.body.apiId
    }).then(function(dbWishList) {
      res.json(dbWishList);
    });
  });

  // Delete an example by id
  app.delete("/api/wishList/:id", skipIfNotLoggedIn, function(req, res) {
    db.WishList.destroy({
      where: {
        id: req.params.id,
        userId: req.session.passport.user
      }
    }).then(function(dbWishList) {
      res.json(dbWishList);
    });
  });
};

function skipIfNotLoggedIn(req, res, next) {
  console.log("func to skip");
  if (req.isAuthenticated()) {
    console.log("not skipped");
    next();
    //return;
  } else {
    console.log("skipped");
    res.json({ loggedIn: false });
  }
}

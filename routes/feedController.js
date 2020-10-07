const Feeds = require("../model/feed");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const config = require("../config/db");
const nodemailer = require("nodemailer");

module.exports = (router) => {
  router.post("/feed", (req, res) => {
    if (!req.body.body) {
      res.json({ success: false, message: "Feed is required!" });
    } else {
      if (!req.body.createdBy) {
        res.json({ success: false, message: "Who crested the feed?" });
      } else {
        const feed = new Feeds({
          body: req.body.body, // Body field
          createdBy: req.body.createdBy, // CreatedBy field
        });
        // Save blog into database
        feed.save((err) => {
          if (err) {
            if (err.errors) {
              if (err.errors.body) {
                res.json({ success: false, message: err.errors.body.message });
              }
            } else {
              res.json({ success: false, message: err });
            }
          } else {
            res.json({ success: true, message: "Feed saved! successfully" });
          }
        });
      }
    }
  });

  /* ===============================================================
     GET ALL BLOGS
  =============================================================== */
  router.get("/allFeeds", (req, res) => {
    // Search database for all blog posts
    Feeds.find({}, (err, feeds) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!feeds) {
          res.json({ success: false, message: "No Feeds found." }); // Return error of no blogs found
        } else {
          res.json({ success: true, feeds: feeds }); // Return success and blogs array
        }
      }
    }).sort({ _id: -1 }); // Sort blogs from newest to oldest
  });

  router.get("/getFeed/:id", (req, res) => {
    if (!req.params.id) {
      res.json({ success: false, message: "No Feed ID was found!" });
    } else {
      Feeds.findOne({ _id: req.params.id }, (err, feed) => {
        if (err) {
          res.json({ success: false, message: "ID not valid", err });
        } else if (!feed) {
          res.json({ success: false, message: "No Feeds found." });
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err });
            } else if (!user) {
              res.json({
                success: false,
                message: "Unable to Authenticate User...",
              });
            } else if (user.username !== feed.createdBy) {
              res.json({
                success: false,
                message: "You are not Authorise to edit this Feed",
              });
            } else {
              res.json({ success: true, feed: feed });
            }
          });
        }
      });
    }
  });

  router.put("/edit-feed", (req, res) => {
    if (!req.body._id) {
      res.json({ success: false, message: "No Feed ID was Provided!" });
    } else {
      Feeds.findOne({ _id: req.body._id }, (err, feed) => {
        if (err) {
          res.json({ success: false, message: "Not a Valid Blog ID" });
        } else if (!feed) {
          res.json({
            success: false,
            message: "No Feed Was Found with such ID",
          });
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err });
            } else if (!user) {
              res.json({
                success: false,
                message: "Unable to Authenticate User...",
              });
            } else if (user.username !== feed.createdBy) {
              res.json({
                success: false,
                message: "You are not Authorise to edit this Feed",
              });
            } else {
              feed.body = req.body.body;
              feed.save((err) => {
                if (err) {
                  res.json({ success: false, message: err });
                } else {
                  res.json({
                    success: true,
                    message: "Feed Updated! Successfully",
                  });
                }
              });
            }
          });
        }
      });
    }
  });

  router.delete("/deleteFeed/:id", (req, res) => {
    if (!req.params.id) {
      res.json({
        success: false,
        message: "No Feed Was Found with such ID",
      });
    } else {
      Feeds.findOne({ _id: req.params.id }, (err, feed) => {
        if (err) {
          res.json({
            success: false,
            message: "Invalid ID",
          });
        } else if (!feed) {
          res.json({
            success: false,
            message: "Feed Not Found",
          });
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
              res.json({
                success: false,
                message: err,
              });
            } else if (!user) {
              res.json({
                success: false,
                message: "Unable to Authenticate User...",
              });
            } else if (user.username !== feed.createdBy) {
              res.json({
                success: false,
                message: "You are not Authorise to Delete this Feed",
              });
            } else {
              feed.remove((err) => {
                if (err) {
                  res.json({
                    success: false,
                    message: err,
                  });
                } else {
                  res.json({
                    success: true,
                    message: "Feed Deleted! Successfully",
                  });
                }
              });
            }
          });
        }
      });
    }
  });

  router.put("/likeFeed", (req, res) => {
    if (!req.body.id) {
      res.json({
        success: false,
        message: "No Feed Was Found with such ID",
      });
    } else {
      Feeds.findOne({ _id: req.body.id }, (err, feed) => {
        if (err) {
          res.json({
            success: false,
            message: "Invalid ID",
          });
        } else if (!feed) {
          res.json({
            success: false,
            message: "Feed Was not Found ",
          });
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
              res.json({
                success: false,
                message: "Something went wrong!",
              });
            } else if (!user) {
              res.json({
                success: false,
                message: "You are not authorised to make comment",
              });
            } else {
              if (feed.likedBy.includes(user.username)) {
                res.json({
                  success: false,
                  message: "You already liked this feed",
                });
              } else {
                if (feed.dislikedBy.includes(user.username)) {
                  feed.dislikes--;
                  const arrayIndex = feed.dislikedBy.indexOf(user.username);
                  feed.dislikedBy.splice(arrayIndex, 1);
                  feed.likes++;
                  feed.likedBy.push(user.username);
                  feed.save((err) => {
                    if (err) {
                      res.json({
                        success: false,
                        message: "Something went wrong!",
                      });
                    } else {
                      res.json({
                        success: true,
                        message: "You Liked! this feed",
                      });
                    }
                  });
                } else {
                  feed.likes++;
                  feed.likedBy.push(user.username);
                  feed.save((err) => {
                    if (err) {
                      res.json({
                        success: false,
                        message: "Something went wrong!",
                      });
                    } else {
                      res.json({
                        success: true,
                        message: "You Liked! this feed",
                      });
                    }
                  });
                }
              }
            }
          });
        }
      });
    }
  });

  router.put("/dislikeFeed", (req, res) => {
    if (!req.body.id) {
      res.json({
        success: false,
        message: "No Feed Was Found with such ID",
      });
    } else {
      Feeds.findOne({ _id: req.body.id }, (err, feed) => {
        if (err) {
          res.json({
            success: false,
            message: "Invalid ID",
          });
        } else if (!feed) {
          res.json({
            success: false,
            message: "Feed Was not Found ",
          });
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
              res.json({
                success: false,
                message: "Something went wrong!",
              });
            } else if (!user) {
              res.json({
                success: false,
                message: "You are not authorised to make comment",
              });
            } else {
              if (feed.dislikedBy.includes(user.username)) {
                res.json({
                  success: false,
                  message: "You already disliked this feed",
                });
              } else {
                if (feed.likedBy.includes(user.username)) {
                  feed.likes--;
                  const arrayIndex = feed.likedBy.indexOf(user.username);
                  feed.likedBy.splice(arrayIndex, 1);
                  feed.dislikes++;
                  feed.dislikedBy.push(user.username);
                  feed.save((err) => {
                    if (err) {
                      res.json({
                        success: false,
                        message: "Something went wrong!",
                      });
                    } else {
                      res.json({
                        success: true,
                        message: "You Disliked! this feed",
                      });
                    }
                  });
                } else {
                  feed.dislikes++;
                  feed.dislikedBy.push(user.username);
                  feed.save((err) => {
                    if (err) {
                      res.json({
                        success: false,
                        message: "Something went wrong!",
                      });
                    } else {
                      res.json({
                        success: true,
                        message: "You disliked! this feed",
                      });
                    }
                  });
                }
              }
            }
          });
        }
      });
    }
  });

  router.post("/comment", (req, res) => {
    if (!req.body.comment) {
      res.json({ success: false, message: "No comment Was Provided" });
    } else if (!req.body.id) {
      res.json({ success: false, message: "No id Was Provided" });
    } else {
      Feeds.findOne({ _id: req.body.id }, (err, feed) => {
        if (err) {
          res.json({ success: false, message: "invalid Feed Id" });
        } else if (!feed) {
          res.json({ success: false, message: "Comment Was Not Found" });
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if (err) {
              res.json({ success: false, message: "Something Went Wrong" });
            } else if (!user) {
              res.json({ success: false, message: "User Not Found" });
            } else {
              feed.comments.push({
                comment: req.body.comment,
                commentator: user.username,
              });
              feed.save((err) => {
                if (err) {
                  res.json({
                    success: false,
                    message: "Something went wrong.",
                  }); // Return error message
                } else {
                  res.json({ success: true, message: "Comment saved" }); // Return success message
                }
              });
            }
          });
        }
      });
    }
  });

  return router;
};

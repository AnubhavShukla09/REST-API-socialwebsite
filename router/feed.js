const express = require("express");
const { body } = require("express-validator/check");

const router = express.Router();

const postController = require("../controller/feed");
const isAuth = require("../middleware/is-auth");

router.get("/posts", isAuth, postController.getPosts);

router.get("/post/:postId", isAuth, postController.getPost);

router.post(
  "/post",
  isAuth,
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
  postController.createPosts
);

router.put(
  "/post/:postId",
  isAuth,
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
  postController.updatePosts
);

router.delete("/post/:postId", isAuth, postController.deletePost);

module.exports = router;

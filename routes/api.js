const express = require('express');
const router = express.Router();

// import database
const BlogData = require('../data/db');

// import routes
// posts
const postsRoute = require('./posts-route');
router.use('/posts', postsRoute);
// post comments
const commentsRoute = require('./comments-route');
router.use('/posts', commentsRoute);

module.exports = router;
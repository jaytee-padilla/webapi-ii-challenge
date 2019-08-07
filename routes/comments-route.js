const express = require('express');
const router = express.Router();

// import database
const BlogData = require('../data/db');

// GET comments of specific post
router.get('/:id/comments', (req, res) => {
	const postId = req.params.id;

	BlogData.findCommentById(postId)
		.then(comments => {
			if(comments.length === 0) {
				return res.status(404).json({message: "The post with the specified ID does not exist."});
			}

			res.status(200).json(comments);
		})
		.catch(error => {
			res.status(500).json({error: "The comments information could not be retrieved."});
		});
});

module.exports = router;
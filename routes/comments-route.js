const express = require('express');
const router = express.Router();

// import database
const BlogData = require('../data/db');

// GET comments of specific post
router.get('/:id/comments', (req, res) => {
	const postId = req.params.id;

	BlogData.findPostComments(postId)
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

router.post('/:id/comments', (req, res) => {
	let commentText = req.body;
	commentText.post_id = postId;
	const postId = req.params.id;

	// if text doesn't exist within request header, return error
	if(!commentText) {
		return res.status(400).json({errorMessage: "Please provide text for the comment"});
	} else {
		commentText.text = commentText.text.trim();
	}

	// checks to see if the post_id provided by request header exists
	// if it doesn't, return a 404 (not found) error
	BlogData.findById(postId)
		.then(post => {
			if(post.length === 0) {
				return res.status(404).json({message: "The post with the specified ID does not exist."});
			}

			// Add comment to post
			BlogData.insertComment(commentText)
				.then(comment => {
					res.status(201).json({comment})
				})
				.catch(error => {
					res.status(500).json({error: "There was an error while saving the comment to the database"});
				});
		})
		.catch(error => {
			// this catch applies to the findById()
			return res.status(500).json({error: "The post information could not be retrieved."});
		});
});

module.exports = router;
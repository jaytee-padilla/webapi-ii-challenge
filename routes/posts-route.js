const express = require('express');
const router = express.Router();

// import database
const BlogData = require('../data/db');

// GET list of posts
router.get('/', (req, res) => {
	BlogData.find()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(error => {
			res.status(500).json({error: "The posts information could not be retrieved."});
		});
});

// GET specific post via post ID
router.get('/:id', (req, res) => {
	const postId = req.params.id;

	BlogData.findById(postId)
		.then(post => {
			if(post.length === 0) {
				return res.status(404).json({message: "The post with the specified ID does not exist."});
			}

			res.status(200).json(post);
		})
		.catch(error => {
			res.status(500).json({error: "The post information could not be retrieved."});
		});
});

// POST to /api/posts
router.post('/', (req, res) => {
	const postData = req.body;
	// if title or contents is missing from the api POST request, return error
	// otherwise, trim the whitespace from the beginning and ends of the data
	if(!postData.title || !postData.contents) {
		return res.status(400).json({errorMessage: "Please provide title and contents for the post."});
	} else {
		postData.title = postData.title.trim();
		postData.contents = postData.contents.trim();
	}

	BlogData.insert(postData)
		.then(post => {
			res.status(201).json(post);
		})
		.catch(error => {
			res.status(500).json({error: "There was an error while saving the post to the database"});
		});
});

module.exports = router;
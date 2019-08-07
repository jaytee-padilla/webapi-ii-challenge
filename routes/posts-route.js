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

// DELETE specific post
router.delete('/:id', (req, res) => {
	BlogData.findById(req.params.id)
		.then(post => {
			if(post.length === 0){
				return res.status(404).json({message: "The post with the specified ID does not exist"});
			}

			BlogData.remove(req.params.id)
				.then(post => {
					return res.status(202).json({message: "Specified post successfully deleted"});
				})
				.catch(error => {
					return res.status(500).json({error: "The post could not be removed"});
				});
		})
		.catch(error => {
			return res.status(500).json({error: "The post information could not be retrieved."});
		});
});

// PUT (update) specific post
router.put('/:id', (req, res) => {
	if(!req.body.title || !req.body.contents) {
		return res.status(400).json({errorMessage: "Please provide title and contents for the post"});
	}

	BlogData.findById(req.params.id)
		.then(post => {
			if(post.length === 0){
				return res.status(404).json({message: "The post with the specified ID does not exist"});
			}

			BlogData.update(req.params.id, req.body)
				.then(updatedPost => {
					return res.status(200).json({message: "Specified post successfully updated"});
				})
				.catch(error => {
					return res.status(500).json({errorMessage: "The post information could not be modified"});
				})
		})
		.catch(error => {
			return res.status(500).json({error: "The post information could not be retrieved."});
		});
});

module.exports = router;
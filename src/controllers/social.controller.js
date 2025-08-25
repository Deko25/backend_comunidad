const Post = require('../models/post.model');
const Comment = require('../models/comment.model'); 
const Reaction = require('../models/reaction.model'); 
const Profile = require('../models/profile.model'); 
const User = require('../models/user.model'); 

exports.createPost = async (req, res) => {
    const profile_id = req.user.profile_id;
    const {text_content, image_url, code_url, file_url, privacy} = req.body;
    try {
        const newPost = await Post.create({
            profile_id: profile_id,
            text_content,
            image_url,
            code_url,
            file_url,
            privacy
        });

        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error creating Post'});
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Profile, 
                    attributes: ['profile_id', 'bio', 'skills', 'experience', 'projects'],
                    include: [{model: User, attributes: ['first_name', 'last_name', 'email']}] 
                },
                {
                    model: Comment, 
                    attributes: ['comment_id', 'post_id', 'profile_id', 'text_content', 'created_at'],
                    include: [{ model: Profile, attributes: ['profile_id', 'bio'],}] 
                },
                {
                    model: Reaction, 
                    attributes: ['reaction_id', 'post_id', 'profile_id', 'type'],
                    include: [{ model: Profile, attributes: ['profile_id', 'bio'],}] 
                }
            ],
        });

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error getting posts'});
    }
};

exports.updatePost = async (req, res) => {
    const { postId } = req.params;
    const { text_content, image_url, code_url, file_url, privacy } = req.body;

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.profile_id !== req.user.profile_id) {
            return res.status(403).json({ error: 'You do not have permission to update this post' });
        }

        await post.update({
            text_content,
            image_url,
            code_url,
            file_url,
            privacy
        });

        res.json({message: 'Post updated successfully', post});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating post' });
    }
};

exports.deletePost = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.profile_id !== req.user.profile_id) {
            return res.status(403).json({ error: 'You do not have permission to delete this post' });
        }

        await post.destroy();
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting post' });
    }
};

exports.createComment = async (req, res) => {
    const {post_id} = req.params;
    const profile_id = req.user.profile_id;
    const {content} = req.body;
    try {
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }
        const newComment = await Comment.create({
            post_id,
            profile_id,
            content
        });

        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error creating comment'});
    }
};

exports.createReaction = async (req, res) => {
    const {post_id} = req.params;
    const profile_id = req.user.profile_id;
    const {reaction_type} = req.body;
    try {
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({error: 'Post not found'});
        }
        const newReaction = await Reaction.create({
            post_id,
            profile_id,
            reaction_type
        });

        res.status(201).json(newReaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Error creating reaction'});
    }
};
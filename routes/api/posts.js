const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check')
const auth = require('../../middlleware/auth')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

// @route     POST api/posts
// @desc      Create post
// @access   Private - you have to login until you can create post
router.post('/', [auth, [
  check('text', 'Text is requierd').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    // until we get the name of the user and the avatar
    const user = await User.findById(req.user.id).select('-password')

    const newPost = new Post({
      // the text will come from the body
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      // the user will come from user.id
      user: req.user.id
    })

    const post = await newPost.save()

    res.json(post)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :(')
  }
});

// @route     GET api/posts
// @desc      Get all posts
// @access   Public
router.get('/', async (req, res) => {
  try {

    // arrange the posts (the recent is the first one)
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :(')
  }
})

// @route     GET api / posts /: user_id
// @desc      Get the user's posts
// @access   Private
// router.get('/userp/:user_id', auth, async (req, res) => {
//   try {

//     // arrange the posts (the recent is the first one)
//     const post = await Post.find()
//     // console.log(post)
//     // console.log(req.user.id)
//     const posts = await Post.find({ user: req.user.id }).sort({ date: -1 })
//     res.json(posts)

//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send('Server Error :(')
//   }
// })

// @route     GET api/posts/:id
// @desc      Get single post by id
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if there any post with this id
    if (!post) {
      return res.status(404).json({ msg: 'Post not found ' })
    }

    res.json(post)

  } catch (err) {
    console.error(err.message)

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found ' })
    }
    res.status(500).send('Server Error :(')
  }
})

// @route     DELETE api/posts/:id
// @desc      delete post by id
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if the post exist
    if (!post) {
      return res.status(404).json({ msg: 'Post not found ' })
    }

    // check if the user own the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    await post.remove()

    res.json({ msg: 'Post removed' })

  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found ' })
    }
    res.status(500).send('Server Error :(')
  }
})

// @route     PUT api/posts/like/id
// @desc      like a post
// @access   Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if the post has already liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' })
    }

    post.likes.unshift({ user: req.user.id })

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :(')
  }
})

// @route     PUT api/posts/unLike/id
// @desc      like a post
// @access   Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if the post has already liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not liked yet' })
    }

    // get romove index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :(')
  }
})

// @route     POST api/posts/comment/:id
// @desc      comment on the post
// @access   Private 
router.post('/comment/:id', [auth, [
  check('text', 'Text is requierd').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    // until we get the name of the user and the avatar
    const user = await User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.id)

    const newComment = ({
      // the text will come from the body
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      // the user will come from user.id
      user: req.user.id
    })

    post.comment.unshift(newComment)

    await post.save()

    res.json(post.comment)
  } catch (err) {
    console.error(post.comment)
    res.status(500).send('Server Error :(')
  }
});

// @route     DELETE api/posts/comment/:id/comment_id
// @desc      delete comment
// @access   Private 
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // pull out the comment from the post 
    const comment = post.comment.find(comment => comment.id === req.params.comment_id)

    // ckeck if the comment exist
    if (!comment) {
      return res.status(404).json({ msg: 'Commen does not exist' })
    }

    // check if the user who make the comment he same who eant to delete the comment 
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authrized' })
    }

    // get romove index
    const removeIndex = post.comment.map(comment => comment.user.toString()).indexOf(req.user.id)

    post.comment.splice(removeIndex, 1)

    await post.save()

    res.json(post.comment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :(')
  }
})
module.exports = router;

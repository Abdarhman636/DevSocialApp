const express = require('express');
const router = express.Router();
const auth = require('../../middlleware/auth')
const { check, validationResult } = require('express-validator/check')
const request = require('request')
const config = require('config')

const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route     GET api/profile/me
// @desc      Get current user profile (my profile)
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }

    res.json(profile)


  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :( ')
  }
});


// @route     POST api/profile
// @desc      Create or update user profile
// @access   Private
router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is requierd').not().isEmpty(),
]], async (req, res) => {
  const errors = validationResult(req)

  // if there is errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  // pull the information from the body
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body

  // build profile object 
  const profileFields = {}
  profileFields.user = req.user.id

  // cheack the fields if it fill
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = company
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }

  // bulid social object 
  profileFields.social = {}

  if (youtube) profileFields.social.youtubel = youtube
  if (facebook) profileFields.social.facebook = facebook
  if (twitter) profileFields.social.twitter = twitter
  if (instagram) profileFields.social.instagram = instagram
  if (linkedin) profileFields.social.linkedin = linkedin


  try {
    let profile = await Profile.findOne({ user: req.user.id })

    // if there profile update it
    if (profile) {
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })

      return res.json(profile)
    }


    // if no profile then create 
    profile = new Profile(profileFields)

    await profile.save()
    res.json(profile)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :( ')
  }
})

// @route     GET api/profile
// @desc      Get all profiles 
// @access   Public
router.get('/', async (req, res) => {
  try {

    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :(')
  }
})

// @route     GET api/profile/user/:user_id
// @desc      Get all profiles 
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {

    // the user id will come from the URL so we use Paeams
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

    // check if this user have profile
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' })
    }

    res.json(profile)

  } catch (err) {
    console.error(err.message)

    // علشان لو ال id بتاع المستخدم كان ناقص رقم مثلا 
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }

    res.status(500).send('Server Error :(')
  }
})

// @route     Delete api/profile/
// @desc      Delete profile, user & post
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {

    // @todo - remove users posts

    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id })
    // remove user
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'User deleted' })

  } catch (err) {
    console.error(err.message)

    // علشان لو ال id بتاع المستخدم كان ناقص رقم مثلا 
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }

    res.status(500).send('Server Error :(')
  }
})

// @route     PUT api/profile/experience
// @desc      Add profile experience
// @access   Private
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
]], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body

  const newExp = {
    title: title,
    company: company,
    location: location,
    from: from,
    to: to,
    current: current,
    description: description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // unshift like push but unshift arrange the array the last is first
    profile.experience.unshift(newExp)
    await profile.save()

    res.json(profile)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :( ')
  }
})

// @route     DELTE api/profile/experience/:exp_id
// @desc      Delete experience from profile
// @access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // get the remove index 
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)


  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :( ')
  }
})

// @route     PUT api/profile/education
// @desc      Add profile education
// @access   Private
router.put('/education', [auth, [
  check('school', 'school is required').not().isEmpty(),
  check('degree', 'degree is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
  check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
]], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body

  const newEdu = {
    school: school,
    degree: degree,
    fieldofstudy: fieldofstudy,
    from: from,
    to: to,
    current: current,
    description: description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // unshift like push but unshift arrange the array the last is first
    profile.education.unshift(newEdu)
    await profile.save()

    res.json(profile)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :( ')
  }
})

// @route     DELTE api/profile/education/:edu_id
// @desc      Delete education from profile
// @access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // get the remove index 
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)


  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :( ')
  }
})

// @route     GET api/profile/github/:username
// @desc      Get user repos from github
// @access   Public
router.get('/github/:username', (req, res) => {
  try {
    const option = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(option, (error, response, body) => {
      if (error) console.error(error)

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found! ' })
      }

      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :( ')
  }
})

module.exports = router;

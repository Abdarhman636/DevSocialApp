import axios from 'axios'
import { setAlert } from './alert'

import {
   GET_PROFILE,
   PROFILE_ERROR,
   UPDATE_PROFILE,
   DELETE_ACCOUNT,
   CLEAR_PROFILE,
   GET_PROFILES,
   GET_REPOSE,
} from './Type'

// get the current user profile 
export const getCurrentProfile = () => async dispatch => {
   try {
      const res = await axios.get('/api/profile/me')

      dispatch({
         type: GET_PROFILE,
         payload: res.data
      })
   } catch (err) {
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, statuse: err.response.statuse }
      })
   }
}

// get all profiles
export const getProfiles = () => async dispatch => {
   // to clear the current profile state
   dispatch({ type: CLEAR_PROFILE })

   try {
      const res = await axios.get('/api/profile')

      dispatch({
         type: GET_PROFILES,
         payload: res.data
      })
   } catch (err) {
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, statuse: err.response.statuse }
      })
   }
}

// get all profiles by ID
export const getProfileById = userId => async dispatch => {
   try {
      const res = await axios.get(`/api/profile/user/${userId}`)

      dispatch({
         type: GET_PROFILE,
         payload: res.data
      })
   } catch (err) {
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, statuse: err.response.statuse }
      })
   }
}

// get github repose
export const getGithubRepose = userName => async dispatch => {

   try {
      const res = await axios.get(`/api/profile/github/${userName}`)

      dispatch({
         type: GET_REPOSE,
         payload: res.data
      })
   } catch (err) {
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, statuse: err.response.statuse }
      })
   }
}

// create or update profile 
export const createProfile = (formData, history, edit = false) => async dispatch => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/json'
         }
      }

      const res = await axios.post('/api/profile', formData, config)


      dispatch({
         type: GET_PROFILE,
         payload: res.data
      })


      dispatch(setAlert(edit ? 'profile Updated' : 'Profile created', 'success'))

      // direct
      if (!edit) {
         history.push('/dashboard')
      }
   } catch (err) {
      const errors = err.response.data.errors

      if (errors) {
         errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 5000)))
      }

      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, statuse: err.response.statuse }
      })
   }
}

// add experience
export const addExperience = (formData, history) => async dispatch => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/json'
         }
      }

      const res = await axios.put('/api/profile/experience', formData, config)


      dispatch({
         type: UPDATE_PROFILE,
         payload: res.data
      })


      dispatch(setAlert('Experience Added', 'success'))

      // redirect

      history.push('/dashboard')

   } catch (err) {
      const errors = err.response.data.errors

      if (errors) {
         errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 5000)))
      }

      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, statuse: err.response.statuse }
      })
   }
}

// add education
export const addEducation = (formData, history) => async dispatch => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/json'
         }
      }

      const res = await axios.put('/api/profile/education', formData, config)


      dispatch({
         type: UPDATE_PROFILE,
         payload: res.data
      })


      dispatch(setAlert('Education Added', 'success'))

      // redirect

      history.push('/dashboard')

   } catch (err) {
      const errors = err.response.data.errors

      if (errors) {
         errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 5000)))
      }

      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, statuse: err.response.statuse }
      })
   }
}

// delete experience
export const deleteExperience = id => async dispatch => {
   try {
      const res = await axios.delete(`/api/profile/experience/${id}`)

      dispatch({
         type: UPDATE_PROFILE,
         payload: res.data
      })

      dispatch(setAlert('Experience Removed', 'success', 5000))
   } catch (err) {
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, statuse: err.response.statuse }
      })
   }
}

// delete education
export const deletEeducation = id => async dispatch => {
   try {
      const res = await axios.delete(`/api/profile/education/${id}`)

      dispatch({
         type: UPDATE_PROFILE,
         payload: res.data
      })

      dispatch(setAlert('Eeducation Removed', 'success', 5000))
   } catch (err) {
      dispatch({
         type: PROFILE_ERROR,
         payload: { msg: err.response.statusText, statuse: err.response.statuse }
      })
   }
}

// delete account & profile 
export const deletAccount = () => async dispatch => {
   if (window.confirm('Are you sure? This can not be undone! ')) {
      try {
         await axios.delete('/api/profile')

         dispatch({ type: CLEAR_PROFILE })
         dispatch({ type: DELETE_ACCOUNT })

         dispatch(setAlert('The acount has been removed', 5000))
      } catch (err) {
         dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, statuse: err.response.statuse }
         })
      }
   }
}
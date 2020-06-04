import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import NavBar from './Components/layout/NavBar';
import Landing from './Components/layout/Landing';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import Alert from './Components/layout/Alert'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'
import Dashboard from './Components/dashboard/Dashboard'
import PraivateRoute from './Components/routing/PraivateRoute'
import CreateProfile from './Components/profileForms/CreateProfile'
import EditProfile from './Components/profileForms/EditProfile'
import AddExperience from './Components/profileForms/AddExperience'
import AddEducation from './Components/profileForms/AddEducation'
import Profile from './Components/profiles/Profile'
import SingleProfile from './Components/Profile/SingleProfile'
import Posts from './Components/posts/Posts'
import Post from './Components/post/Post'
// Redux
import { Provider } from 'react-redux'
import store from './store'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router >
        <Fragment className="App">
          <NavBar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profiles' component={Profile} />
              <Route exact path='/profile/user/:id' component={SingleProfile} />
              <Route exact path='/posts' component={Posts} />
              <Route exact path='/posts/:id' component={Post} />
              <PraivateRoute exact path='/dashboard' component={Dashboard} />
              <PraivateRoute exact path='/create-profile' component={CreateProfile} />
              <PraivateRoute exact path='/edit-profile' component={EditProfile} />
              <PraivateRoute exact path='/add-experience' component={AddExperience} />
              <PraivateRoute exact path='/add-education' component={AddEducation} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App;

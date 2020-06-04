import React, { useEffect, Fragment } from 'react'
import Spinner from '../layout/Spinner'
import { connect } from 'react-redux'
import { getProfiles } from '../../actions/profile'
import ProfileItem from './ProfileItem'

export const Profile = ({ getProfiles, profile: { profiles, loading } }) => {

   useEffect(() => {
      getProfiles()
   }, [getProfiles])

   return (
      <Fragment>
         {loading ? <Spinner /> :
            <Fragment>
               <h1 className='large text-primary'>Developers</h1>
               <p className='lead'>
                  <i className='fab fa-connectdevelop' /> Browse and connect with developers
               </p>
               <div className='profiles'>
                  {profiles.length > 0 ? (
                     profiles.map(profile => (
                        <ProfileItem key={profile._id} profile={profile} />
                     ))
                  ) : <h4>No Profiles found :(</h4>}
               </div>
            </Fragment>}
      </Fragment>
   )
}

const mapStateToProps = state => ({
   profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profile)
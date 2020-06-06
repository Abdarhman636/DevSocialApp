import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import PropTypes from 'prop-types'
import { addLike, removeLike, deletePost } from '../../actions/post'

export const PostItem = ({ addLike, removeLike, deletePost, auth, post: { _id, text, name, avatar, user, likes, comment, date }, showAction }) => {
   return (
      <div class="post bg-white p-1 my-1">
         <div>
            <Link to={`/profile/user/${user}`}>
               <img
                  class="round-img"
                  src={avatar}
                  alt=""
               />
               <h4>{name}</h4>
            </Link>
         </div>
         <div>
            <p class="my-1">{text}</p>
            <p class="post-date">Posted on <Moment format='YYYY/MM/DD'>{date}</Moment></p>

            {showAction &&
               (<Fragment>
                  <button onClick={e => addLike(_id)} type="button" class="btn btn-light">
                     <i class="fas fa-thumbs-up">{' '}</i> {likes.length > 0 && (<span>{likes.length}</span>)} </button>
                  <button onClick={e => removeLike(_id)} type="button" class="btn btn-light">
                     <i class="fas fa-thumbs-down"></i>
                  </button>
                  <Link to={`/posts/${_id}`} class="btn btn-primary">
                     Discussion {comment.length > 0 && (<span class='comment-count'>{comment.length}</span>)}
                  </Link>
                  {/* compare the post user and the login user */}
                  {!auth.loading && user === auth.user._id && (
                     <button onClick={e => deletePost(_id)} type="button" class="btn btn-danger">
                        <i class="fas fa-times"></i>
                     </button>
                  )}
               </Fragment>)}
         </div>
      </div>
   )
}

PostItem.defaultProps = {
   showAction: true
}

const mapStateToProps = state => ({
   auth: state.auth
})

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem)
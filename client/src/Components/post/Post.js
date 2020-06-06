import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Spinner from '../layout/Spinner'
import { getPost, getPosts } from '../../actions/post'
import PostItem from '../posts/PostItem'
import AddCommentForm from './AddCommentForm'
import CommentItem from './CommentItem'

export const Post = ({ getPost, post: { post, loading }, match }) => {

   useEffect(() => {
      getPost(match.params.id)
   }, [getPost])

   return (
      loading || post === null ? <Spinner /> :
         <Fragment>
            <Link to='/posts' className='btn'>Back To Posts</Link>
            <PostItem post={post} showAction={false} />
            <AddCommentForm postid={post._id} />
            <div className="comments">
               {post.comment.map(comment => (
                  <CommentItem key={comment._id} comment={comment} postId={post._id} />
               ))}
            </div>
         </Fragment>
   )
}

const mapStateToProps = state => ({
   post: state.post
})

export default connect(mapStateToProps, { getPost })(Post)

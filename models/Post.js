const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostShema = new Schema({
   // until we conect the post with the user 
   user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
   },
   text: {
      type: String,
      required: true
   },
   // name of the user
   name: {
      type: String,
   },
   avatar: {
      type: String
   },
   likes: [
      {
         // to know who put the like ( which user )
         user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
         }
      }
   ],
   comment: [
      {
         user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
         },
         text: {
            type: String,
            required: true,
         },
         name: {
            type: String,
         },
         avatar: {
            type: String
         },
         // date for the comment
         date: {
            type: Date,
            default: Date.now
         }
      }
   ],
   date: {
      type: Date,
      default: Date.now
   }
})

module.exports = Post = mongoose.model('post', PostShema)
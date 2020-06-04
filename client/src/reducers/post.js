import {
   GET_POSTS,
   GET_POST,
   POST_ERROR,
   UPDATE_LIKES,
   DELETE_POST,
   ADD_POST,
   ADD_COMMENT,
   REMOVE_COMMENT
} from '../actions/Type'

const initialState = {
   posts: [],
   post: null,
   loading: true,
   error: {}
}

export default function (state = initialState, action) {
   const { type, payload } = action

   switch (type) {
      case GET_POSTS:
         return {
            ...state,
            posts: payload,
            loading: false
         }
      case GET_POST:
         return {
            ...state,
            post: payload,
            loading: false
         }
      case ADD_POST:
         return {
            ...state,
            // نضيف البوستات الي موجودة وبعدها نضيف البوست الجديد الي جاي من الاكشن 
            // الترتيب بيفرق
            posts: [payload, ...state.posts],
            loading: false
         }
      case UPDATE_LIKES:
         return {
            ...state,
            // نتأكد ان ال اي دي الي ارسلناه مطابق للايدي تبع البوست علشان نتأكد ان احنا بنعمل او بنشيل لايك من البوست الصحيح
            posts: state.posts.map(post => post._id === payload.id ? { ...post, likes: payload.likes } : post),
            loading: false
         }
      case DELETE_POST:
         return {
            ...state,
            posts: state.posts.filter(post => post._id !== payload),
            loading: false
         }
      case POST_ERROR:
         return {
            ...state,
            error: payload,
            loading: false
         }
      case ADD_COMMENT:
         return {
            ...state,
            post: { ...state.post, comments: payload },
            loading: false
         }
      case REMOVE_COMMENT:
         return {
            ...state,
            post: {
               ...state,
               comments: state.post.comments.filter(commet => commet._id !== payload),
               loading: false
            }
         }
      default:
         return state
   }
}
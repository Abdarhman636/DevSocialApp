import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk' // middleWare
// 
import rootReducer from './reducers' // اسم الملف المفروض ادكس بس بدام اسمه اندكس ممكن نسميه reducers عادي


const initialState = {}

const middleware = [thunk]

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))


export default store
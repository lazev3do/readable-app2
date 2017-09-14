import {ADD_RECIPE,REMOVE_FROM_CALENDAR,RECEIVE_FOOD,FETCHING_CATEGORIES,RECEIVED_CATEGORIES,RECEIVED_POSTS,
  FETCHING_POSTS,VOTING,VOTED,RECEIVED_COMMENTS,ORDER_BY,ORDER_BY_COMMENTS,EDIT_MODE,SAVING_POST,SAVED_POST,
SAVING_COMMENT,SAVED_COMMENT,DELETED_POST,JUST_SAVED_FALSE} from '../actions'
import {combineReducers} from 'redux';

const initialCalendarState = {
  sunday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  monday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  tuesday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  wednesday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  thursday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  friday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  saturday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
}
const food = (state = {},action) => {
  switch(action.type)
  {
    case ADD_RECIPE:
      return {
        ...state,
        [action.recipe.label]:action.recipe
      }
      case RECEIVE_FOOD:
        return {
          ...state,
          food:action.food
        }
    default:
      return state;
  }
}

const calendar = (state = initialCalendarState,action)=>{
  const {day,recipe,meal} = action;
  switch (action.type) {
    case ADD_RECIPE:
      return {
        ...state,
        [day]:{
          ...state[day],
          [meal]:recipe.label
        }
      }
    case REMOVE_FROM_CALENDAR:
      return {
        ...state,
        [day]:{
          ...state[day],
          [meal]:null
        }
      }
    default:
      return state;
  }
}

const categories = (state = {isFetchingCategories:false,entries:[],selected_category:''},action) =>{
  switch (action.type){
    case FETCHING_CATEGORIES:
      return {
        ...state,
        isFetchingCategories:true
      }
      break;
    case RECEIVED_CATEGORIES:
      return {
        ...state,
        isFetchingCategories:false,
        entries:action.entries.concat([{path:'',name:'All'}])
      }
    default:
      return state;
  }
}

const posts = (state = {posts : []},action) => {
  switch (action.type) {
    case FETCHING_POSTS:
      return {
        ...state,
        isFetchingPosts:true
      }
      break;
    case RECEIVED_POSTS:
      return {
        ...state,
        isFetchingPosts:false,
        posts:action.posts
      }
    case VOTING:
      return{
        ...state,
        isVoting:true
      }
    case VOTED:
      return {
        ...state,
        posts:state.posts.map((elem)=>action.post && action.post.id == elem.id ? action.post:elem),
        isVoting:false
      }
    case ORDER_BY:
      return {
        ...state,
        orderBy:action.orderBy
      }
      case ORDER_BY_COMMENTS:
      return {
        ...state,
        orderByComments:action.orderBy
      }
      case EDIT_MODE:
        return {
          ...state,
          editMode:action.editMode
        }
    case SAVING_POST:
      return {
        ...state,
        savingPost:true
      }
    case SAVING_COMMENT:
      return {
        ...state,
        savingComment:true
      }
      case JUST_SAVED_FALSE:
        return {
          ...state,
          justSavedPost:null
        }
      case SAVED_POST:
      let statePosts = state.posts;
      statePosts.forEach((elem,index)=>{
        if(elem.id==action.post.id)
        {
          statePosts.splice(index);
          return false;
        }
      });
      statePosts=statePosts.concat(action.post);
        return {
          ...state,
          savingPost:false,
          editMode:false,
          posts:statePosts,
          justSavedPost:action.post
        };
        case DELETED_POST:
          return {
            ...state,
            savingPost:false,
            editMode:false,
            posts:state.posts.map(element=>element.id==action.postId?{...element,deleted:true}:element),
          };
    case SAVED_COMMENT:
      let statePostComments = (state.comments && state.comments[action.comment.parentId]) || [];
      statePostComments.forEach((elem,index)=>{
        if(elem.id==action.comment.id)
        {
          statePostComments.splice(index);
          return false;
        }
      });
      statePostComments = statePostComments.concat(action.comment);
      return {
        ...state,
        savingComment:false,
        comments:{
          ...state.comments,
          [action.comment.parentId]:statePostComments
        }

      }

    case RECEIVED_COMMENTS:
      const commentsByPostID = action.comments.reduce((holder,element)=>(
        {
          [element.parentId]:holder[element.parentId]?holder[element.parentId].concat(element):[element]
        }
      ),{});
      return {
        ...state,
        comments:{
          ...state.comments,
          ...commentsByPostID
        }
      }
    default:
      return state;
  }
}

export default combineReducers({
  calendar,
  food,
  categories,
  posts
}
);

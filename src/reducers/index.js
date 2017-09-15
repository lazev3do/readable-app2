import {FETCHING_CATEGORIES,RECEIVED_CATEGORIES,RECEIVED_POSTS,
  FETCHING_POSTS,VOTING,VOTED,RECEIVED_COMMENTS,ORDER_BY,ORDER_BY_COMMENTS,EDIT_MODE,SAVING_POST,SAVED_POST,
SAVING_COMMENT,SAVED_COMMENT,DELETED_POST,JUST_SAVED_FALSE,EDIT_COMMENT,DELETED_COMMENT} from '../actions'
import {combineReducers} from 'redux';

const categories = (state = {isFetchingCategories:false,entries:[],selected_category:''},action) =>{
  switch (action.type){
    case FETCHING_CATEGORIES:
      return {
        ...state,
        isFetchingCategories:true
      }
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
      return action.dataType==="posts"?{
        ...state,
        posts:state.posts.map((elem)=>action.postOrComment && action.postOrComment.id === elem.id ? action.postOrComment:elem),
        isVoting:false
      }:{
        ...state,
        comments:{
          ...state.comments,
          [action.postOrComment.parentId]:
            state.comments[action.postOrComment.parentId].map(element=>element.id===action.postOrComment.id?action.postOrComment:element)
        },
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
        commentsOrderBy:action.orderBy
      }
      case EDIT_MODE:
        return {
          ...state,
          editMode:action.editMode
        }
    case EDIT_COMMENT:
    return {
      ...state,
      commentToEdit:action.id
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
        case DELETED_COMMENT:
        {
          return {
            ...state,
            comments:{
              ...state.comments,
              [action.commentInfo.parentId]:
                state.comments[action.commentInfo.parentId].map(element=>element.id===action.commentInfo.id?{...element,deleted:true}:element)
            }
          }
      }
      case SAVED_POST:
      let statePosts = state.posts;
      statePosts.forEach((elem,index)=>{
        if(elem.id===action.post.id)
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
            posts:state.posts.map(element=>element.id===action.postId?{...element,deleted:true}:element),
          };
    case SAVED_COMMENT:
      let statePostComments = (state.comments && state.comments[action.comment.parentId]) || [];
      statePostComments=statePostComments.filter((elem,index)=>(
        elem.id!=action.comment.id
      ));
      statePostComments = statePostComments.concat(action.comment);
      return {
        ...state,
        savingComment:false,
        commentToEdit:null,
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
  categories,
  posts
}
);

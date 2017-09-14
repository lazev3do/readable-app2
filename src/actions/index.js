import {getCategories,getPosts,postVote,getComments,serverSavePost,serverSaveComment} from '../utils/api'
export const ADD_RECIPE = 'ADD_RECIPE'
export const REMOVE_FROM_CALENDAR = 'REMOVE_FROM_CALENDAR'
export const RECEIVE_FOOD = 'RECEIVE_FOOD'
export const RECEIVED_CATEGORIES = 'RECEIVED_CATEGORIES'
export const FETCHING_CATEGORIES = 'FETCHING_CATEGORIES';
export const FETCHING_POSTS = 'FETCHING_POSTS';
export const RECEIVED_POSTS = 'RECEIVED_POSTS';
export const VOTING = 'VOTING';
export const VOTED = 'VOTED';
export const RECEIVED_COMMENTS = 'RECEIVED_COMMENTS';
export const ORDER_BY = "ORDER_BY";
export const ORDER_BY_COMMENTS = "ORDER_BY_COMMENTS";
export const EDIT_MODE = "EDIT_MODE";
export const SAVING_POST = "SAVING_POST"
export const SAVED_POST = "SAVED_POST";
export const SAVING_COMMENT = "SAVING_COMMENT";
export const SAVED_COMMENT = "SAVED_COMMENT";
export const DELETED_POST = "DELETED_POST";
export const JUST_SAVED_FALSE = "JUST_SAVED_FALSE";






export function addRecipe ({ day, recipe, meal }) {
  return {
    type: ADD_RECIPE,
    recipe,
    day,
    meal,
  }
}

export function removeFromCalendar ({ day, meal }) {
  return {
    type: REMOVE_FROM_CALENDAR,
    day,
    meal,
  }
}

export const savingPost = () => ({
  type:SAVING_POST
})

const savedPost = (post) => ({
  type:SAVED_POST,
  post
})

const deletedPost = (postId) => ({
  type:DELETED_POST,
  postId
})

export const savePost = (values) => dispatch => {
    dispatch(savingPost());
    serverSavePost(values).then(
      (post)=>{
        if(values.action=="deleteAction")
          dispatch(deletedPost(post.id));
        else
          dispatch(savedPost(post));
        })
}

const savingComment = () => ({
  type: SAVING_COMMENT
})

const savedComment = (comment) => ({
  type: SAVED_COMMENT,
  comment
})

export const saveComment = (values) => dispatch => {
    dispatch(savingComment());
    serverSaveComment(values).then((comment)=>dispatch(savedComment(comment)));
}

export const receiveFood = food => ({
  type: RECEIVE_FOOD,
  food
});

export const fetchingCategories = () => ({
  type: FETCHING_CATEGORIES
});

export const receivedCategories = (entries) => ({
  type:RECEIVED_CATEGORIES,
  entries
});

export const fetchingPosts = () => ({
  type:FETCHING_POSTS
})

export const justSavedFalse = () => ({
  type:JUST_SAVED_FALSE
});

export const receivedPosts = (posts) => ({
  type:RECEIVED_POSTS,
  posts
});

export const fetchCategories = () => dispatch => {
  dispatch(fetchingCategories());
  return getCategories().then(entries=>dispatch(receivedCategories(entries)));
}

export const fetchPosts = (category) => dispatch => {
  dispatch(fetchingPosts());
  getPosts(category).then(posts=>dispatch(receivedPosts(posts)));
}


export const receivedComments = (comments) => ({
  type:RECEIVED_COMMENTS,
  comments
})

export const fetchComments = (postId) => dispatch => {
  getComments(postId).then(comments=>dispatch(receivedComments(comments)));
}

export const voting = () => (
  {
    type: VOTING
  }
)

export const voted = (post) => ({
  type: VOTED,
  post
})

export const orderBy = (orderBy) => ({
  type: ORDER_BY,
  orderBy
})

export const orderByComments = (orderBy) => ({
  type: ORDER_BY_COMMENTS,
  orderBy
})

export const editMode = (editMode) => {
  return {
  type: EDIT_MODE,
  editMode}
}

export const vote = (postId,voteDirection) => dispatch => {
  dispatch(voting());
  postVote(postId,voteDirection).then((post)=>dispatch(voted(post)))
}

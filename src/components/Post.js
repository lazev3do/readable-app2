import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'
import Voting from './Voting'
import {fetchComments} from '../actions'
import CommentsList from './CommentsList'
import CommentForm from './CommentForm'
import serializeForm from 'form-serialize'
import {editMode,fetchCategories,savePost,justSavedFalse} from '../actions'
import {guid} from '../utils/helper'
import { Route, withRouter } from 'react-router-dom';

/*
**
 title, author, number of comments, current score, and a voting mechanism to upvote or downvote the post. Posts should have buttons or links for editing or deleting that post.
*/
class Post extends Component {

  componentDidMount () {
    if(this.props.post_id && this.props.post_id=="new_post")
      this.editModeTrue();
    else if(this.props.post!== undefined)
      this.props.dispatch(fetchComments(this.props.post.id));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const values = serializeForm(e.target,{hash:true});
    values.existing_post = values.id!==undefined;
    if(!values.existing_post)
    {
      values.id = guid();
    }
    this.props.dispatch(savePost(values));
  }

  componentWillReceiveProps(newProps) {
    if(newProps.justSavedPost && this.props.post_id && this.props.post_id=="new_post")
    {
      this.props.history.push(`/${newProps.justSavedPost.category}/${newProps.justSavedPost.id}`);
      this.props.dispatch(justSavedFalse());
    }
    if(this.props.post==undefined && newProps.post!==undefined)
      this.props.dispatch(fetchComments(newProps.post.id));
  }

  editModeTrue = () => {
    this.props.dispatch(fetchCategories());
    this.props.dispatch(editMode(true));
  }

  render () {
    const {post,showlistview,comments,editMode,categories,dispatch,savingPost,post_id,isFetchingPosts,link_category} = this.props;
    console.log("Post:");
    console.log(post);
    return (
      <div>
        {editMode && (post === undefined || !post.deleted) ?
          <div>
            <form noValidate onSubmit={this.handleSubmit}>
              <input type="text" required name="title" placeholder="Title" defaultValue={(post && post.title)|| ""} />
              <textarea defaultValue={(post && post.body)|| ""} name="body" required placeholder="body"></textarea>
              <input type="text" required name="author" defaultValue={(post && post.author)|| ""} placeholder="author" />
              <select defaultValue={post && post.category || ""} required name="category">
                {categories && categories.map(element=>
                  element.name!=="All" &&
                  <option key={element.path} value={element.path}>{element.name}</option>
                )}
              </select>
              {post && post.id ? <input type="hidden" defaultValue={post.id} name="id" />:""}
              {savingPost?
                <Loading delay={200} type='spin' color='#222' className='loading' />
                :
                <div>
                  <input type="hidden" defaultValue="saveAction" name="action" ref={(input)=>this.actionInput=input} />
                  <input formNoValidate type="Submit" defaultValue="Save" onClick={()=>{this.actionInput.value="saveAction";return true;}} />
                  {post !== undefined && <input formNoValidate type="Submit" defaultValue="Delete" onClick={()=>{this.actionInput.value="deleteAction";return true;}} />}
                </div>
              }
            </form>
          </div>
          :

      post !== undefined && !post.deleted ?
       showlistview &&
        <div>
          <Link to={`/${post.category}/${post.id}`}><p>{post.title}</p></Link>
          {comments && comments[post.id] ?
          <span>{comments[post.id].length} comments</span>
          :<span>0 comments</span>
          }
      </div>
      ||
      /** post view **/
      <div>
        <Link to={`/${post.category}`}>{post.category}</Link>
        <span>{post.title}</span><Link to={`/${post.category}/${post.id}?edit=true`}>Edit</Link>
        <Voting post = {post} />
        <CommentForm postId={post.id}/>
        {comments && comments[post.id] &&
        <div className="comments-list">
          <span>{comments[post.id].length} comments</span>
          <CommentsList postId={post.id}/>
        </div>
        }
      </div>
      : (isFetchingPosts ? <Loading delay={200} type='spin' color='#222' className='loading' />:
      <span>Post not found or deleted <Link to={`/${link_category}`}>go back</Link></span>)
      }
      </div>
    )
  }
}

function mapStateToProps({posts,categories,savingPost=false},ownProps){
  const post = posts.posts.filter(elem=>elem.id==ownProps.post_id);
  const editMode = (ownProps.location.search && ownProps.location.search.indexOf("edit=true")>-1) || ownProps.post_id=="new_post";
  if(post.length>0)
    return {post:post[0],comments:posts.comments,categories:categories.entries,editMode,savingPost,justSavedPost:posts.justSavedPost};
  return {editMode:posts.editMode,categories:categories.entries,savingPost,justSavedPost:posts.justSavedPost,isFetchingPosts:posts.isFetchingPosts};
}

export default withRouter(connect(mapStateToProps)(Post));

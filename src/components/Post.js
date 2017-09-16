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
import MdEdit from 'react-icons/lib/md/edit'

/*
**
 title, author, number of comments, current score, and a voting mechanism to upvote or downvote the post. Posts should have buttons or links for editing or deleting that post.
*/
class Post extends Component {

  componentDidMount () {
    this.props.dispatch(fetchCategories());
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
    e.target.reset();
  }

  componentWillReceiveProps(newProps) {
    if(this.props.post_id && this.props.post_id=="new_post")
      this.editModeTrue();
    if(newProps.justSavedPost)
    {
      this.props.history.push(`/${newProps.justSavedPost.category}/${newProps.justSavedPost.id}`);
      this.props.dispatch(justSavedFalse());
    }
    if(this.props.post==undefined && newProps.post!==undefined)
      this.props.dispatch(fetchComments(newProps.post.id));
  }

  editModeTrue = () => {
    this.props.dispatch(editMode(true));
  }

  render () {
    const {post,showlistview,comments,editMode,categories,dispatch,savingPost,post_id,isFetchingPosts,link_category} = this.props;
    return (
      <div>
        {editMode && (post === undefined || !post.deleted) ?
          <div className="post-form">
            <h3>Edit Post</h3>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text" className="form-control" id="title" required name="title" placeholder="Title" defaultValue={(post && post.title)|| ""} />
              </div>
              <div className="form-group">
                <label htmlFor="post_body">Post:</label>
                <textarea className="form-control" id="post_body" defaultValue={(post && post.body)|| ""} name="body" required placeholder="body"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="post_author">Author</label>
                <input className="form-control" id="post_author" type="text" required name="author" defaultValue={(post && post.author)|| ""} placeholder="author" />
              </div>
              <div className="form-group">
                <label htmlFor="post_category">Category:</label>
                <select className="form-control" id="post_category" defaultValue={post && post.category || ""} required name="category">
                  {categories && categories.map(element=>
                    element.name!=="All" &&
                    <option key={element.path} value={element.path}>{element.name}</option>
                  )}
                </select>
              </div>
              {post && post.id ? <input type="hidden" defaultValue={post.id} name="id" />:""}
              {savingPost?
                <Loading delay={200} type='spin' color='#222' className='loading' />
                :
                <div>
                  <input type="hidden" defaultValue="saveAction" name="action" ref={(input)=>this.actionInput=input} />
                  <input type="Submit" className="btn btn-primary btn-small" defaultValue="Save" onClick={()=>{this.actionInput.value="saveAction";return true;}} />
                  {post !== undefined && <input className="btn btn-danger btn-small" formNoValidate type="Submit" defaultValue="Delete" onClick={()=>{this.actionInput.value="deleteAction";return true;}} />}
                  <Link to={post?`/${post.category}/${post.id}`:"/"}>Cancel</Link>
                </div>
              }
            </form>
          </div>
          :

      post !== undefined && !post.deleted ?
       showlistview &&
        <div className="row">
          <div className="col">
            <Link to={`/${post.category}/${post.id}`}><h4 style={{display:"inline-block"}}>{post.title}</h4></Link> by <span>{`${post.author}`}</span><br/>
            {comments && comments[post.id] ?
            <span>{comments[post.id].reduce((counter,elem)=>counter+=!elem.deleted,0)} comments</span>
            :<span>0 comments</span>
            }
            <div className="row align-items-center">
              <div className="col">
              <Voting postOrComment = {post} type="posts" />
              </div>
              <div className="col">
              <Link className="pull-right" to={`/${post.category}/${post.id}?edit=true`}><MdEdit />Edit</Link>
              </div>
            </div>
          </div>
      </div>
      ||
      /** post view **/
      <div>
        <Link to={`/${post.category}`}>{post.category}</Link><br/>
        <h4 style={{display:"inline-block",marginRight:"10px"}}>{post.title}</h4><Link to={`/${post.category}/${post.id}?edit=true`}><MdEdit />Edit</Link>
        <blockquote className="blockquote">
          <p className="mb-0">{post.body}</p>
        </blockquote>
        <p>{post.author}</p>
        <Voting postOrComment = {post} type="posts" />
        <CommentForm postId={post.id}/>
        {comments && comments[post.id] ?
        <div>
          <span>{comments[post.id].reduce((counter,elem)=>counter+=!elem.deleted,0)} comments</span>
          <div className="comments-list">
            <CommentsList postId={post.id}/>
          </div>
        </div>
        :<span>0 comments</span>
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

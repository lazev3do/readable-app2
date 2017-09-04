import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'
import Voting from './Voting'
import {fetchComments} from '../actions'
import CommentsList from './CommentsList'
import serializeForm from 'form-serialize'
import {editMode,fetchCategories,savePost} from '../actions'
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
      this.props.history.push(`/${newProps.justSavedPost.category}/${newProps.justSavedPost.id}`);
    if(this.props.post==undefined && newProps.post!==undefined)
      this.props.dispatch(fetchComments(newProps.post.id));
  }

  editModeTrue = () => {
    this.props.dispatch(fetchCategories());
    this.props.dispatch(editMode(true));
  }

  render () {
    const {post,showlistview,comments,editMode,categories,dispatch,savingPost} = this.props;
    console.log("EditMode: "+editMode)
    return (
      <div>
        {editMode ?
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
                :  <input formNoValidate type="Submit" defaultValue="Save" />
              }
            </form>
          </div>
          :

      post !== undefined ?
       showlistview &&
        <div>
          <Link to={`/${post.category}/${post.id}`}><p>{post.title}</p></Link>
          {comments && comments[post.id] &&
          <span>{comments[post.id].length} comments</span>
          }
      </div>
      ||
      <div>
        <Link to={`/${post.category}`}>{post.category}</Link>
        <span>{post.title}</span><Link onClick={this.editModeTrue} to={`/${post.category}/${post.id}`}>Edit</Link>
        <Voting post = {post} />
        {comments && comments[post.id] &&
        <div>
          <span>{comments[post.id].length} comments</span>
          <CommentsList postId={post.id}/>
        </div>
        }
      </div>
      : <Loading delay={200} type='spin' color='#222' className='loading' />
      }
      </div>
    )
  }
}

function mapStateToProps({posts,categories,savingPost=false},ownProps){
  const post = posts.posts.filter(elem=>elem.id==ownProps.post_id);
  if(post.length>0)
    return {post:post[0],comments:posts.comments,categories:categories.entries,editMode:posts.editMode,savingPost,justSavedPost:posts.justSavedPost};
  return {editMode:posts.editMode,categories:categories.entries,savingPost,justSavedPost:posts.justSavedPost};
}

export default withRouter(connect(mapStateToProps)(Post));

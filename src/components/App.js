import React, { Component } from 'react';
import '../App.css';
import '../index.css'
import {connect} from 'react-redux';
import CategoriesList from './CategoriesList'
import PostList from './PostList'
import Post from './Post'
import { Route, withRouter } from 'react-router-dom';
import {fetchPosts} from '../actions'



class App extends Component {

  getCategoryFromPath(path=this.props.location.pathname){
    const splited = path.split("/");
    return splited[1] || "";
  }

  componentDidMount(){
    const {dispatch,selected_category} = this.props;
    dispatch(fetchPosts(this.getCategoryFromPath()));
  }

  componentWillReceiveProps(newProps){
    const newPath = this.getCategoryFromPath(newProps.location.pathname);
    const oldPath = this.getCategoryFromPath();
    if(newPath!==oldPath)
    {
      this.props.dispatch(fetchPosts(newPath));
    }
  }

  render() {
    return (
    <div>
      <Route exact path="/:category?" render={({match})=>(
          <div>
            <CategoriesList selectedCategory={match.params.category || ""}/>
            <PostList selectedCategory={match.params.category || ""}/>
          </div>
        )}/>
      <Route exact path="/:category/:post_id" render={({match})=>(
          <Post post_id={match.params.post_id} link_category={match.params.category}/>
      )}/>
  </div>
    );
  }
}

const mapStateToProps = ({categories}) => ({
  selected_category: categories.selected_category
});

export default withRouter(connect(mapStateToProps)(App));

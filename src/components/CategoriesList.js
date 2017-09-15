import React, {Component} from 'react';
import {fetchCategories} from '../actions'
import {connect} from 'react-redux';
import Loading from 'react-loading'
import {Link} from 'react-router-dom'

class CategoriesList extends Component {

  componentDidMount () {
    const { dispatch } = this.props
    dispatch(fetchCategories());
  }

  render () {
    const {isFetchingCategories,entries,selectedCategory} = this.props;
    return (
      <div>
        <h3>Categories:</h3>
      {isFetchingCategories === true
           ? <Loading delay={200} type='spin' color='#222' className='loading' />
         :
          <ul className="nav">
            {entries.map((entry,index)=>(
              <li className="nav-item" key={`link_${index}`}>
                <Link className={"nav-link"+(entry.path===selectedCategory?" active":"")} to={`/${entry.path}`}>{entry.name}</Link>
              </li>
            ))}
          </ul>
     }
   </div>
    )
  }
}

function mapStateToProps ({categories}) {
  const {isFetchingCategories,entries} = categories;
  return {isFetchingCategories,entries};
}

export default connect(mapStateToProps)(CategoriesList);

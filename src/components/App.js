import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import '../index.css'
import  {addRecipe,removeFromCalendar,searchFood} from '../actions';
import {connect} from 'react-redux';
import {capitalize} from '../utils/helper'
import CalendarIcon from 'react-icons/lib/fa/calendar-plus-o'
import Modal from 'react-modal'
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right'
import Loading from 'react-loading'
import {fetchRecipes} from '../utils/api'
import FoodList from './FoodList'
import ShoppingList from './ShoppingList'

class App extends Component {

  state = {
    foodModalOpen:false,
    meal: null,
    day: null,
    food: null,
    loadingFood: false,
    ingredientsModalOpen:false
  };

  openFoodModal = ({meal,day}) => {
    this.setState({
      foodModalOpen : true,
      meal,
      day
    });
  };

  openIngredientsModal = () => {this.setState({ingredientsModalOpen:true})};
  closeIngredientsModal = () => {this.setState({ingredientsModalOpen:false})};

  generateShoppingList = () => {
    return this.props.calendar.reduce((result,{meals})=>{
      meals.breakfast && result.push(meals.breakfast);
      meals.lunch && result.push(meals.lunch);
      meals.dinner && result.push(meals.dinner);
      return result;
    },[]).reduce((ingredients,{ingredientLines} ) => (
      ingredients.concat(ingredientLines)
    ),[]);
  }

  closeFoodModal = ()=>{
    this.setState({
      foodModalOpen:false,
      meal:null,
      day:null,
      food:null
    });
  };

  store = null;

  constructor(props){
    super(props);
    this.store = this.props.store;
  }

  submitFood = () => {
    this.store.dispatch(addRecipe(
      {
        day: 'monday',
        meal: 'breakfast',
        recipe:{
          label:this.input.value
        }
      }
    ));
    this.input.value='';
  };

  render() {
    const {loadingFood,food,foodModalOpen,ingredientsModalOpen} = this.state;
    const {calendar,remove,selectRecipe,searchFoodTrigger} = this.props;
    const mealOrder = ['breakfast', 'lunch', 'dinner'];
    return (
      <div className='container'>
        <div className='nav'>
           <h1 className='header'>UdaciMeals</h1>
           <button
            className='shopping-list'
            onClick={this.openIngredientsModal}>
              Shopping List
          </button>
        </div>
        <ul className='meal-types'>
          {mealOrder.map((mealType) => (
            <li key={mealType} className='subheader'>
              {capitalize(mealType)}
            </li>
          ))}
        </ul>

        <div className='calendar'>
          <div className='days'>
            {calendar.map(({ day }) => <h3 key={day} className='subheader'>{capitalize(day)}</h3>)}
          </div>
          <div className='icon-grid'>
            {calendar.map(({ day, meals }) => (
              <ul key={day}>
                {mealOrder.map((meal) => (
                  <li key={meal} className='meal'>
                    {meals[meal]
                      ? <div className='food-item'>
                          <img src={meals[meal].image} alt={meals[meal].label}/>
                          <button onClick={() => remove({meal, day})}>Clear</button>
                        </div>
                      : <button className='icon-btn'>
                          <CalendarIcon onClick={()=>this.openFoodModal({meal,day})} size={30}/>
                        </button>}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={foodModalOpen}
          onRequestClose={this.closeFoodModal}
          contentLabel='Modal'
        >
          <div>
            {loadingFood === true
              ? <Loading delay={200} type='spin' color='#222' className='loading' />
              : <div className='search-container'>
                  <h3 className='subheader'>
                    Find a meal for {capitalize(this.state.day)} {this.state.meal}.
                  </h3>
                  <div className='search'>
                    <input
                      className='food-input'
                      type='text'
                      placeholder='Search Foods'
                      ref={(input) => this.input = input}
                    />
                    <button
                      className='icon-btn'
                      onClick={(event)=>searchFoodTrigger(event,this.input)}>
                        <ArrowRightIcon size={30}/>
                    </button>
                  </div>
                  {food !== null && (
                    <FoodList
                      food={food}
                      onSelect={(recipe) => {
                        selectRecipe({ recipe, day: this.state.day, meal: this.state.meal })
                        this.closeFoodModal()
                      }}
                    />)}
                </div>}
          </div>
        </Modal>
        <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={ingredientsModalOpen}
          onRequestClose={this.closeIngredientsModal}
          contentLabel='Modal'
        >
          {ingredientsModalOpen && <ShoppingList list={this.generateShoppingList()}/>}
         </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({calendar,food},ownProps) => {
    const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    return {
      calendar: dayOrder.map((day)=>(
        {
          day,
          meals: Object.keys(calendar[day]).reduce((meals,meal)=>{
            meals[meal] = calendar[day][meal]?food[calendar[day][meal]]:null;
            return meals;
          },{})
        }
      )),
      food
    }
};

function mapDispatchToProps (dispatch) {
  return {
    selectRecipe: (data) => dispatch(addRecipe(data)),
    remove: (data) => dispatch(removeFromCalendar(data)),
    searchFoodTrigger: (data) => dispatch(searchFood(data))
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(App);

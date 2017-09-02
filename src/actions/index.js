import {fetchRecipes} from '../utils/api'
export const ADD_RECIPE = 'ADD_RECIPE'
export const REMOVE_FROM_CALENDAR = 'REMOVE_FROM_CALENDAR'
export const RECEIVE_FOOD = 'RECEIVE_FOOD'



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

export const receiveFood = food => ({
  type: RECEIVE_FOOD,
  food
});

export const searchFood = (e,input) => {
  console.log(input);
  return (dispatch)=>{
    e.preventDefault();
    fetchRecipes(e.target.value)
      .then((food)=>{
        dispatch(receiveFood(food));
        })
  }

}

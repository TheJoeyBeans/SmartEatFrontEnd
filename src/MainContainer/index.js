import React, { Component } from 'react';
import MealSearch from '../MealSearch';
import MakeMealForm from '../MakeMealForm';
import EditMealForm from '../EditMealForm';
import MealList from '../MealList';
import MainHeader from '../MainHeader';
import { Grid, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class MainContainer extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			meals: [],
			dateToday: '',
			foodItems:[],
			mealToEdit: {
				id: '',
				meal_type: '',
				calories: ''
			},
			sessId: sessionStorage.getItem('sessionUserId'),
			foodItemsToEdit: [],
			showMakeMealModal: false,
			showEditMealModal: false
		}
	}
	componentDidMount(){
		this.getMeals();
		this.getFoodItems();
		this.getDate();
	}
	//Gets current date and sets it in state.
	getDate(){
		let newDate = new Date();
		let date = newDate.getDate();
		let month = newDate.getMonth() + 1;
		let year = newDate.getFullYear();
		const fullDate = `${month}/${date}/${year}`;
		this.setState({
			dateToday: fullDate
		});
	}
	//Get meal data, state will only be set with the meals with creator ids that match the current logged
	//in user ID.
	getMeals = async () => {
		try {
			const meals = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/v1/meals/', {
				credentials: 'include',
				method: 'GET'
			});
			const parsedMeals = await meals.json();
			const parsedMealsList = [];
			for(let i = 0; i < parsedMeals.data.length; i++){
				if(this.state.sessId === parsedMeals.data[i].creator.id.toString()){
					parsedMealsList.push(parsedMeals.data[i]);
				}
			}
			this.setState({meals: parsedMealsList});
		} catch(err){
			console.log(err);
		}
	}
	//Gets food items, just like with meals the only food items that are set to state are those with creator ids
	//that match the current logged in user. 
	getFoodItems = async () => {
		try {
			const foodItems = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/v1/foodItems/', {
				credentials: 'include', 
				method: 'GET'
			});
			const parsedFoodItems = await foodItems.json();
			const parsedFoodItemsList = [];
			console.log(parsedFoodItems.data, "this is parsed foodItems")
			for(let i = 0; i < parsedFoodItems.data.length; i++){
				if(this.state.sessId === parsedFoodItems.data[i].creator.id.toString()){
					parsedFoodItemsList.push(parsedFoodItems.data[i]);
				}
			}
			console.log(parsedFoodItemsList, "this is the parsed food items list")
			this.setState({foodItems: parsedFoodItemsList});
		} catch(err){
			console.log(err);
		}
	}
	//Make Meal modal is displayed 
	openAndCreate = () =>{
		this.setState({
			showMakeMealModal: true
		})
	}
	//Edit meal modal is displayed, the meal and food items from the selected meal are set in state as 
	//mealToEdit and foodItemToEdit
	openAndEdit = (mealFromTheList, foodItems) => {
		this.setState({
			mealToEdit: {
				id: mealFromTheList.id,
				meal_type: mealFromTheList.meal_type,
				calories: mealFromTheList.calories
			}, 
			showEditMealModal: true
		});
		this.setState({foodItemsToEdit: foodItems.filter((foodItem) => foodItem.meal.id === mealFromTheList.id)})
	}
	//MakeMealModal is closed and the POST route for meals is called to create a new meal and store it to the database.
	closeModalAndMakeMeal = async (e, meal) =>{
		const mealKind = meal.meal_type;
		let mealList = meal.food;
		let totalCal = 0;
		let mealId = ''
		for(let i = 0; i < meal.food.length; i++){
			totalCal += meal.food[i].foodCalories
		}
		//The meal is set with a date_create which will reflect the current date as set by the state upon mounting
		//the app components
		const mealBody = {
			'meal_type' : mealKind,
			'calories' : totalCal,
			'date_created' : this.state.dateToday
		}
		e.preventDefault();
		try {
			const createdMealResponse = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/v1/meals/', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(mealBody),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const parsedResponse = await createdMealResponse.json();
			mealId = parsedResponse.data.id;
			if (parsedResponse.status.code === 201) {
				this.setState({meals: [...this.state.meals, parsedResponse.data]})
			} else {
				alert(parsedResponse.status.message);
			}
		} catch(err){
			console.log('error')
			console.log(err)
		}
		//MakeMealModal is no longer displayed after the meal is created. 
		this.setState({
			showMakeMealModal: false
		})
		this.createFoodItem(mealId, mealList);
	}
	//After a meal is created, the createFoodItem method is called, which will create food_items from within the 
	//created meal and store them to their own table in the database
	createFoodItem = async (mealId, mealList) => {

		try {
			for(let i = 0; i < mealList.length; i++){
				const foodBody = {
					'food_name': mealList[i].foodName ,
					'food_calories': mealList[i].foodCalories,
					'food_unique_id': mealList[i].foodId,
					'meal': mealId
				}
				const createdFoodItemResponse = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/v1/foodItems/', {
					method: 'POST', 
					credentials: 'include',
					body: JSON.stringify(foodBody),
					headers: {
						'Content-Type' : 'application/json'
					}
				});
				const parsedResponse = await createdFoodItemResponse.json();
				if (parsedResponse.status.code === 201) {
					this.setState({foodItems: [...this.state.foodItems, parsedResponse.data]})
				} else {
					alert(parsedResponse.status.message);
				}
			} 
			} catch(err){
				console.log('error')
				console.log(err)
		}

	}
	//The editMealModal is closed and edits are made to the apporpriate meal. 
	closeModalAndEditMeal = async (e, meal) => {
		const mealKind = meal.meal_type;
		let mealList = meal.food;
		let totalCal = 0;
		let mealId = '';
		for(let i = 0; i < meal.food.length; i++){
			totalCal += meal.food[i].food_calories
		}
		const mealBody = {
			'meal_type' : mealKind,
			'calories' : totalCal
		}
		e.preventDefault();

		try{
			const editMealUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/meals/${meal.mealId}/`
			const editResponse = await fetch(editMealUrl, {
				method: 'PUT',
				credentials: 'include',
				body: JSON.stringify(mealBody),
				headers: {
					'Content-Type' : 'application/json'
				}
			});
			const editResponseParsed = await editResponse.json();
			mealId = editResponseParsed.data.id;
			//A new meal list is created which contains the edited meal. 
			const newMealsListWithEdit = this.state.meals.map((meal) =>{
				if(meal.id === mealId){
					meal = editResponseParsed.data
				}

				return meal
			});
			//The above created meal list is set to state and mealToEdit is reset to blank values. 
			//The editMealModal is also closed.
			this.setState({
				showEditMealModal: false,
				meals: newMealsListWithEdit,
				mealToEdit: {
					id: '',
					meal_type: '',
					calories: ''
				}
			});
		} catch(err){
			console.log(err)
		}
		//After the meal is edited, this method is called to edit food items. 
		this.editFoodItem(e, mealId, mealList);
	}
	editFoodItem = async (e, mealId, mealList) => {
		//Since it is possible the user has created new food_items while editing their meals. 
		//Only fooditems that previously existed before the edit will be sent through the PUT route
		//Any newly created foodItems will need to go through the POST route. 
		try {
			for(let i = 0; i < mealList.length; i++){
				const foodBody = {
					'food_name': mealList[i].food_name ,
					'food_calories': mealList[i].food_calories,
					'food_unique_id': mealList[i].food_unique_id,
					'meal': mealId,
					'creator': mealList[i].creator
				}
					const foodItemId = mealList[i].id
				//Checks to make sure if food Items have previously existed, and that if the user made no changes
				//the item is not put through the PUT route. 
				if(foodItemId != null && foodBody.food_unique_id != mealList[i].food_unique_id){
					const editFoodItemUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/foodItems/${foodItemId}/`;
					const editResponse = await fetch(editFoodItemUrl, {
						method: 'PUT',
						credentials: 'include',
						body: JSON.stringify(foodBody),
						headers: {
							'Content-Type' : 'application/json'
						}
					});
					const editResponseParsed = await editResponse.json();
					const newFoodItemsListWithEdit = this.state.foodItems.map((foodItem) =>{
						if(foodItem.id === editResponseParsed.data.id){
							foodItem = editResponseParsed.data
						}
						return foodItem
					});
					//State is set with the foodItems incluing the newly edited items. 
					this.setState({
						foodItems: newFoodItemsListWithEdit
					});
					//If new food items are created during the edit, they won't have a foodItemId so they will be 
					//sent through the following POST route. 
				} else if(foodItemId == null) {
					const NewFoodBody = {
						'food_name': mealList[i].food_name ,
						'food_calories': mealList[i].food_calories,
						'food_unique_id': mealList[i].food_unique_id,
						'meal': mealId,
						'creator': mealList[i].creator
					}
					const createdFoodItemResponse = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/v1/foodItems/', {
						method: 'POST', 
						credentials: 'include',
						body: JSON.stringify(NewFoodBody),
						headers: {
							'Content-Type' : 'application/json'
						}
					});
					const parsedResponse = await createdFoodItemResponse.json();
					if (parsedResponse.status.code === 201) {
						this.setState({
							foodItems: [...this.state.foodItems, parsedResponse.data]
						})
					} else {
						alert(parsedResponse.status.message);
					}
				}
			} 

			} catch(err){
				console.log('error')
				console.log(err)
		}
		//Reset the foodItemsToEdit in state
		this.setState({
			foodItemsToEdit: []
		})
	}
	//In case a user decideds to make no changes after clicking edit/make this method is called so that the user can 
	//exit out of the edit/make modal without having any data save.
	closeModal = () =>{
		this.setState({
			showMakeMealModal: false, 
			showEditMealModal: false,
			mealToEdit: {
				id: '',
				meal_type: '',
				calories: ''
			},
			foodItemsToEdit: []
		})
	}
	//Deletes selected meals, also loops through foodItems associated with the meal to delete them as well. 
	deleteMeal = async (id, foodItems) => {
		const deleteMealResponse = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/v1/meals/' + id +'/', {
			method: 'DELETE',
			credentials: 'include'
		});
		const deleteMealParsed = await deleteMealResponse.json();
		if (deleteMealParsed.status.code === 200){
			this.setState({meals: this.state.meals.filter((meal) => meal.id !== id)})
		} else {
			alert(deleteMealParsed.status.message);
		}
	//Loops through food items and deletes any that share the same MealId as the above deleted meal.
		for(let i = 0; i < foodItems.length; i++){
			if(foodItems[i].meal.id === id){
				const deleteFoodItemResponse = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/v1/foodItems/' + foodItems[i].id + '/', {
					method: 'DELETE',
					credentials: 'include'
				});
				const deleteFoodItemParsed = await deleteFoodItemResponse.json();
				if (deleteFoodItemParsed.status.code === 200){
					this.setState({foodItems: this.state.foodItems.filter((foodItem) => foodItem.id !== foodItems[i].id)})
				} else {
					alert(deleteFoodItemParsed.status.message);
				}
			}
		}
	}
	//If a user edits a meal and needs to delete a food item, this is the method that will be called to delete the foodItem
	deleteFoodItem = async (foodItems) =>{
		for(let i = 0; i < foodItems.length; i++){
				const deleteFoodItemResponse = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/v1/foodItems/' + foodItems[i].id + '/', {
					method: 'DELETE',
					credentials: 'include'
				});
				const deleteFoodItemParsed = await deleteFoodItemResponse.json();
				if (deleteFoodItemParsed.status.code === 200){
					this.setState({foodItems: this.state.foodItems.filter((foodItem) => foodItem.id !== foodItems[i].id)})
				} else {
					alert(deleteFoodItemParsed.status.message);
			}
			//foodItemsToEdit are reset
			this.setState({
				foodItemsToEdit: []
			});
		}	
	}
	//clears sessionStorage and returns the user to login page. 
	handleLogout = (e) => {
		sessionStorage.clear();
		this.props.history.push('/login');
	}
	render(){
		return(
			<div>
				<MainHeader date={this.state.dateToday} meals={this.state.meals} openAndCreate={this.openAndCreate} logOut={this.handleLogout}/>
				<Grid className='mealList' columns={3} divided textAlign='center' verticalAlign='top'>	
					<Grid.Row>
						<MealList date={this.state.dateToday} meals={this.state.meals} foodItems={this.state.foodItems} openAndEdit={this.openAndEdit} deleteMeal={this.deleteMeal}/>
					</Grid.Row>
				</Grid>
					<MakeMealForm open={this.state.showMakeMealModal} close={this.closeModalAndMakeMeal} closeNoEdit={this.closeModal}/>
					<EditMealForm delete={this.deleteFoodItem} meal={this.state.mealToEdit} foodItems={this.state.foodItemsToEdit} open={this.state.showEditMealModal} close={this.closeModalAndEditMeal} closeNoEdit={this.closeModal}/>
			</div>
		)
	}

}

export default MainContainer

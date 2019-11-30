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
	getMeals = async () => {
		try {
			const meals = await fetch(process.env.REACT_APP_API_URL + '/api/v1/meals/', {
				credentials: 'include',
				method: 'GET'
			});
			const parsedMeals = await meals.json();
			const parsedMealsList = [];
			console.log(parsedMeals.data, 'this is parsedMeals')
			for(let i = 0; i < parsedMeals.data.length; i++){
				if(this.state.sessId === parsedMeals.data[i].creator.id.toString()){
					parsedMealsList.push(parsedMeals.data[i]);
				}
			}
			console.log(parsedMealsList, "this is the parsed meals list")
			this.setState({meals: parsedMealsList});
		} catch(err){
			console.log(err);
		}
	}
	getFoodItems = async () => {
		try {
			const foodItems = await fetch(process.env.REACT_APP_API_URL + '/api/v1/foodItems/', {
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
	openAndCreate = () =>{
		this.setState({
			showMakeMealModal: true
		})
	}
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
	closeModalAndMakeMeal = async (e, meal) =>{
		const mealKind = meal.meal_type;
		let mealList = meal.food;
		let totalCal = 0;
		let mealId = ''
		for(let i = 0; i < meal.food.length; i++){
			totalCal += meal.food[i].foodCalories
		}
		const mealBody = {
			'meal_type' : mealKind,
			'calories' : totalCal,
			'date_created' : this.state.dateToday
		}
		console.log(mealBody, "this is mealBody");
		e.preventDefault();
		try {
			const createdMealResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/meals/', {
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
		this.setState({
			showMakeMealModal: false
		})
		this.createFoodItem(mealId, mealList);
	}
	createFoodItem = async (mealId, mealList) => {

		try {
			for(let i = 0; i < mealList.length; i++){
				const foodBody = {
					'food_name': mealList[i].foodName ,
					'food_calories': mealList[i].foodCalories,
					'food_unique_id': mealList[i].foodId,
					'meal': mealId
				}
				const createdFoodItemResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/foodItems/', {
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
	closeModalAndEditMeal = async (e, meal) => {
		console.log(meal, 'this is the meal')
		const mealKind = meal.meal_type;
		let mealList = meal.food;
		let totalCal = 0;
		let mealId = '';
		for(let i = 0; i < meal.food.length; i++){
			totalCal += meal.food[i].food_calories
		}
		console.log(totalCal, 'this is total calories')
		const mealBody = {
			'meal_type' : mealKind,
			'calories' : totalCal
		}
		e.preventDefault();

		try{
			const editMealUrl = `${process.env.REACT_APP_API_URL}/api/v1/meals/${this.state.mealToEdit.id}/`;
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
			const newMealsListWithEdit = this.state.meals.map((meal) =>{
				if(meal.id === mealId){
					meal = editResponseParsed.data
				}

				return meal
			});

			console.log(newMealsListWithEdit, "This is the newMealsListWithEdit");
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
		this.editFoodItem(e, mealId, mealList);
	}
	editFoodItem = async (e, mealId, mealList) => {
	console.log(mealId, "<--mealId");
	console.log(mealList, "<--mealList");

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
					console.log(foodBody, "this is foodBody")
					console.log(foodItemId, "this is foodItemId")
				if(foodItemId != null){
					const editFoodItemUrl = `${process.env.REACT_APP_API_URL}/api/v1/foodItems/${foodItemId}/`;
					console.log(editFoodItemUrl, "this is the edit url")
					const editResponse = await fetch(editFoodItemUrl, {
						method: 'PUT',
						credentials: 'include',
						body: JSON.stringify(foodBody),
						headers: {
							'Content-Type' : 'application/json'
						}
					});
					console.log(editResponse, "this is the edit response")
					const editResponseParsed = await editResponse.json();
					console.log(editResponseParsed, 'parsed edit for foodItems')
					const newFoodItemsListWithEdit = this.state.foodItems.map((foodItem) =>{
						if(foodItem.id === editResponseParsed.data.id){
							foodItem = editResponseParsed.data
						}
						return foodItem
					});
					console.log(newFoodItemsListWithEdit, "this is the new food items list with the edit")
					this.setState({
						foodItems: newFoodItemsListWithEdit, 
						foodItemsToEdit: []
					});
				} else {
					const NewFoodBody = {
						'food_name': mealList[i].food_name ,
						'food_calories': mealList[i].food_calories,
						'food_unique_id': mealList[i].food_unique_id,
						'meal': mealId,
						'creator': mealList[i].creator
					}
					const createdFoodItemResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/foodItems/', {
						method: 'POST', 
						credentials: 'include',
						body: JSON.stringify(NewFoodBody),
						headers: {
							'Content-Type' : 'application/json'
						}
					});
					const parsedResponse = await createdFoodItemResponse.json();
					console.log(parsedResponse, "this is the new foodItem")
					if (parsedResponse.status.code === 201) {
						this.setState({foodItems: [...this.state.foodItems, parsedResponse.data]})
					} else {
						alert(parsedResponse.status.message);
					}
				}
			} 

			} catch(err){
				console.log('error')
				console.log(err)
		}

	}
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
	deleteMeal = async (id, foodItems) => {
		console.log(id, "This is the meal ID")
		console.log(foodItems, "this is the foodItems of the meal")
		const deleteMealResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/meals/' + id +'/', {
			method: 'DELETE',
			credentials: 'include'
		});
		const deleteMealParsed = await deleteMealResponse.json();
		console.log(deleteMealParsed, "<---- this is deleteMealParsed")

		if (deleteMealParsed.status.code === 200){
			console.log(deleteMealParsed, ' response from Flask server')
			this.setState({meals: this.state.meals.filter((meal) => meal.id !== id)})
		} else {
			alert(deleteMealParsed.status.message);
		}

		for(let i = 0; i < foodItems.length; i++){
			if(foodItems[i].meal.id === id){
				const deleteFoodItemResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/foodItems/' + foodItems[i].id + '/', {
					method: 'DELETE',
					credentials: 'include'
				});
				const deleteFoodItemParsed = await deleteFoodItemResponse.json();
				console.log(deleteFoodItemParsed, "<---- this is deleteFoodItemParsed")

				if (deleteFoodItemParsed.status.code === 200){
					console.log(deleteFoodItemParsed, ' deletedFoodItemParsed, response from Flask server')
					this.setState({foodItems: this.state.foodItems.filter((foodItem) => foodItem.id !== foodItems[i].id)})
				} else {
					alert(deleteFoodItemParsed.status.message);
				}
			}
		}
	}
	deleteFoodItem = async (foodItems) =>{
		console.log(foodItems, "This is the food item you're trying to delete")
		for(let i = 0; i < foodItems.length; i++){
				const deleteFoodItemResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/foodItems/' + foodItems[i].id + '/', {
					method: 'DELETE',
					credentials: 'include'
				});
				const deleteFoodItemParsed = await deleteFoodItemResponse.json();
				console.log(deleteFoodItemParsed, "<---- this is deleteFoodItemParsed")

				if (deleteFoodItemParsed.status.code === 200){
					console.log(deleteFoodItemParsed, ' deletedFoodItemParsed, response from Flask server')
					this.setState({foodItems: this.state.foodItems.filter((foodItem) => foodItem.id !== foodItems[i].id)})
				} else {
					alert(deleteFoodItemParsed.status.message);
			}
			this.setState({
				foodItemsToEdit: []
			});
		}	
	}
	handleLogout = (e) => {
		sessionStorage.clear();
		this.props.history.push('/login');
	}
	render(){
		return(
			<div>
				<MainHeader meals={this.state.meals} openAndCreate={this.openAndCreate} logOut={this.handleLogout}/>
				<Grid className='mealList' columns={3} divided textAlign='center' verticalAlign='top'>	
					<Grid.Row>
						<MealList meals={this.state.meals} foodItems={this.state.foodItems} openAndEdit={this.openAndEdit} deleteMeal={this.deleteMeal}/>
					</Grid.Row>
				</Grid>
					<MakeMealForm open={this.state.showMakeMealModal} close={this.closeModalAndMakeMeal} closeNoEdit={this.closeModal}/>
					<EditMealForm delete={this.deleteFoodItem} meal={this.state.mealToEdit} foodItems={this.state.foodItemsToEdit} open={this.state.showEditMealModal} close={this.closeModalAndEditMeal} closeNoEdit={this.closeModal}/>
			</div>
		)
	}

}

export default MainContainer

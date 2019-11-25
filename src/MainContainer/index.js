import React, { Component } from 'react';
import MealSearch from '../MealSearch';
import MakeMealForm from '../MakeMealForm';
import EditMealForm from '../EditMealForm';
import MealList from '../MealList';
import MainHeader from '../MainHeader';
import { Grid } from 'semantic-ui-react';

class MainContainer extends Component {
	constructor(props){
		super(props);

		this.state = {
			meals: [],
			foodItems:[],
			mealToEdit: {
				id: '',
				meal_type: '',
				calories: ''
			},
			foodItemsToEdit: [],
			showMakeMealModal: false,
			showEditMealModal: false
		}
	}
	componentDidMount(){
		this.getMeals();
		this.getFoodItems();
	}
	getMeals = async () => {
		try {
			const meals = await fetch(process.env.REACT_APP_API_URL + '/api/v1/meals/', {
				credentials: 'include',
				method: 'GET'
			});
			const parsedMeals = await meals.json();
			this.setState({
				meals: parsedMeals.data
			})
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
			this.setState({
				foodItems: parsedFoodItems.data
			})
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
			foodItemsToEdit: foodItems,
			showEditMealModal: true
		})
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
			'calories' : totalCal
		}
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
				meals: newMealsListWithEdit
			});
		} catch(err){
			console.log(err)
		}
		this.editFoodItem(mealId, mealList);
	}
	editFoodItem = async (mealId, mealList) => {
	console.log(mealId, "<--mealId");
	console.log(mealList, "<--mealList");
		try {
			for(let i = 0; i < mealList.length; i++){
				const foodBody = {
					'food_name': mealList[i].food_name ,
					'food_calories': mealList[i].food_calories,
					'food_unique_id': mealList[i].food_unique_id,
					'meal': mealId
				}
				const editFoodItemUrl = `${process.env.REACT_APP_API_URL}/api/v1/meals/${this.state.foodItemsToEdit.id}/`;
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
				console.log(editResponseParsed, 'parsed edit')
				const newFoodItemsListWithEdit = this.state.foodItems.map((foodItem) =>{
					if(foodItem.id === editResponseParsed.data.id){
						foodItem = editResponseParsed.data
					}
					return foodItem
				});
				
				this.setState({
					foodItems: newFoodItemsListWithEdit
				});
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
		console.log(deleteMealParsed)

		if (deleteMealParsed.status.code === 200){
			console.log(deleteMealParsed, ' response from Flask server')
			this.setState({meals: this.state.meals.filter((meal) => meal.id !== id)})
		} else {
			alert(deleteMealParsed.status.message);
		}

		for(let i = 0; i < foodItems.length; i++){
			const deleteFoodItemResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/foodItems/' + foodItems[i].id + '/', {
				method: 'DELETE',
				credentials: 'include'
			});
			const deleteFoodItemParsed = await deleteFoodItemResponse.json();
			console.log(deleteFoodItemParsed)

			if (deleteFoodItemParsed.status.code === 200){
				console.log(deleteFoodItemParsed, ' response from Flask server')
				this.setState({foodItems: this.state.foodItems.filter((foodItem) => foodItem.id !== foodItems[i].id)})
			} else {
				alert(deleteFoodItemParsed.status.message);
			}
		}
	}
	render(){
		return(
			<div>
				<header>
					<MealSearch />
					<MainHeader meals={this.state.meals} openAndCreate={this.openAndCreate}/>
				</header>
				<Grid columns={3}>	
					<Grid.Row>
						<MealList meals={this.state.meals} foodItems={this.state.foodItems} openAndEdit={this.openAndEdit} deleteMeal={this.deleteMeal}/>
					</Grid.Row>
					<MakeMealForm open={this.state.showMakeMealModal} close={this.closeModalAndMakeMeal} closeNoEdit={this.closeModal}/>
					<EditMealForm meal={this.state.mealToEdit} foodItems={this.state.foodItemsToEdit} open={this.state.showEditMealModal} close={this.closeModalAndEditMeal} closeNoEdit={this.closeModal}/>
				</Grid>
			</div>
		)
	}

}

export default MainContainer

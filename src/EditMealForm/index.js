import React, { Component } from 'react';
import { Form, Button, Label, Modal, Icon } from 'semantic-ui-react';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';
const apiKey = 'dc1e6e6904af11f3792ca4dad0a5495b';
const apiId = '230690a4';

class EditMealForm extends Component {
	constructor(props){
		super(props);

		this.state = {
			meal_type: '',
			mealId: '',
			food: [],
			foodItemsToDelete: [],
			query: ''
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.meal.meal_type !== this.props.meal.meal_type){
			this.setState({
				meal_type: nextProps.meal.meal_type,
				mealId: nextProps.meal.id,
				food: nextProps.foodItems
			})
		}
	}
	handleChange = (e) => {
		this.setState({
			query: e.currentTarget.value
		})
	}
	handleMealType = (e) => {
		this.setState({
			meal_type: e.currentTarget.value
		})
	}
	fetchSearchResults = (query) => {
		const searchUrl = `https://api.edamam.com/api/food-database/parser?ingr=${this.state.query}&app_id=${apiId}&app_key=${apiKey}`;
		axios.get(searchUrl, {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(response =>{
			console.log(response.data, "I am the response");
			const foodUniqueId = response.data.parsed[0].food.foodId
			const foodText = response.data.text;
			const foodCal = response.data.parsed[0].food.nutrients.ENERC_KCAL
			this.setState(state =>{
				const food = state.food.concat({
					food_name: foodText,
					food_calories: foodCal,
					food_unique_id: foodUniqueId
				});
				return{
					food
				}
			})
		})
	}
	removeFood = (i, foodItems) => {
		console.log(i)
		console.log(foodItems)
		this.setState({
			food: this.state.food.filter((food) => food.food_unique_id !== i),
		});
		if(foodItems.id != null){
			this.setState(state =>{
				const foodItemsToDelete = state.foodItemsToDelete.concat({
					food_name: foodItems.food_name,
					food_calories: foodItems.food_calories,
					food_unique_id: foodItems.food_unique_id,
					id: foodItems.id
				});
				return{
					foodItemsToDelete
				}
			});
		}
	}
	resetState = (e) => {
		this.setState({
			meal_type: '',
			mealId: '',
			food: [],
			foodItemsToDelete: [],
			query: ''
		})
	}
	render(){
		const addedFood = this.state.food.map((food, i) =>{
			return(
				<div key={i}>
				<ul>
					Name: {food.food_name}<br/>
					Calories: {food.food_calories}
				</ul>
				<Button onClick={() => this.removeFood(food.food_unique_id, food)}>Delete Food</Button>
				</div>
			)
		})
		return(
			<Modal open={this.props.open}>
				<Modal.Content>
					<Form>
						<Label>Edit your meal</Label><br/>
						<Icon className='closeIcon' name='close' size="large" onClick={this.props.closeNoEdit}/>
							<select name='meal_type' onChange={this.handleMealType} className="ui dropdown">
								<option value="breakfast">Breakfast</option>
								<option value="lunch">Lunch</option>
								<option value="dinner">Dinner</option>
								<option value="snack">Snack</option>
							</select>
						<Label>What are you eating?</Label>
							<Searchbar  name='input' onChange={this.handleChange} placeholder='Search'/>
							<Button onClick={this.fetchSearchResults}>Add Food</Button>
							<li className='foodList'>{addedFood}</li>
						<Button type='Submit' onClick={(e) => {
								this.resetState();
								this.props.close(e, this.state);
								this.props.delete(this.state.foodItemsToDelete);
							}}>Finish Edits</Button>
					</Form>
				</Modal.Content>
			</Modal>
		)
	}
}

export default EditMealForm

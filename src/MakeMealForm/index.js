import React, { Component } from 'react';
import { Search, Form, Button, Label, Modal, Icon } from 'semantic-ui-react';
// import { Searchbar } from 'react-native-paper';
import axios from 'axios';
const apiKey = 'dc1e6e6904af11f3792ca4dad0a5495b';
const apiId = '230690a4';

class MakeMealForm extends Component {
	constructor(){
		super();

		this.state = {
			meal_type: 'breakfast',
			food: [],
			query: ''
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
			console.log(response, "I am the response");
			const foodUniqueId = response.data.parsed[0].food.foodId
			const foodText = response.data.text;
			const foodCal = response.data.parsed[0].food.nutrients.ENERC_KCAL
			this.setState(state =>{
				const food = state.food.concat({
					foodId: foodUniqueId,
					foodName: foodText,
					foodCalories: foodCal
				});
				return{
					food
				}
			})
		})
	}
	resetState = () => {
		this.setState({
			meal_type: 'breakfast',
			food: [],
			query: ''
		})
	}
	removeFood = (i) => {
		console.log(i)
		this.setState({
			food: this.state.food.filter((food) => food.foodId !== i)
		})
	}
	render(){
		const addedFood = this.state.food.map((food, i) =>{
			return(
				<div key={i}>
				<ul>
					Name: {food.foodName}<br/>
					Calories: {food.foodCalories}
				</ul>
				<Button onClick={() => this.removeFood(food.foodId)}>Delete Food</Button>
				</div>
			)
		})
		return(
			<Modal className='editModal' open={this.props.open}>
				<Modal.Content>
					<Form>
						<Label>Which meal is this?</Label>
						<Icon className='closeIcon' name='close' onClick={this.props.closeNoEdit}/>
							<select name='meal_type' onChange={this.handleMealType} className="ui dropdown">
								<option value="breakfast">Breakfast</option>
								<option value="lunch">Lunch</option>
								<option value="dinner">Dinner</option>
								<option value="snack">Snack</option>
							</select><br/>
						<Label>What are you eating?</Label><br/>
							<Search name='input' onSearchChange={this.handleChange} placeholder='Search'/>
							<Button onClick={this.fetchSearchResults}>Add Food</Button>
							<li>{addedFood}</li>
						<Button type='Submit' onClick={(e) => {
								this.props.close(e, this.state); 
								this.resetState();
							}}>Complete Meal</Button>
					</Form>
				</Modal.Content>
			</Modal>
		)
	}
}

export default MakeMealForm



import React, { Component } from 'react';
import { Form, Button, Label, Modal, Icon, Grid } from 'semantic-ui-react';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';
import searchIcon from '../Images/searchIcon.png'
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
			if(response.data.parsed[0] === undefined){
				alert('Food cannot be found!')
			} else {
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
			}
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
				<Grid.Row>
					<ul style={{margin: '10px 0px'}}>
						<Icon name='close' color='red' size='big' style={{margin: '10px 0px'}} onClick={() => this.removeFood(food.foodId)}/>
						{food.foodName} (Calories: {food.foodCalories})
					</ul>			
				</Grid.Row>
				</div>
			)
		})
		return(
			<Grid columns='equal'>
			<Modal className='editModal' open={this.props.open}>
				<Modal.Content>
					<Form>
						<Grid.Row>
						<Label size='large' color='green' className='mealListLabel'>Which meal is this?</Label>
							<Icon className='closeIcon' name='close' size="large" onClick={this.props.closeNoEdit}/><br/>
								<select style={{margin: '15px 0px'}} name='meal_type' onChange={this.handleMealType} className="ui dropdown">
									<option value="breakfast">Breakfast</option>
									<option value="lunch">Lunch</option>
									<option value="dinner">Dinner</option>
									<option value="snack">Snack</option>
								</select><br/>
						</Grid.Row>
						<Grid.Row>
							<Label size='large' color='green' style={{margin: '0 0 15px 0'}}>What are you eating?</Label><br/>
								<Searchbar icon={searchIcon} name='input' onChange={this.handleChange} placeholder='Search for food'/><br/>
								<Button color='green' size='small' style={{margin: '10px 0px'}} onClick={this.fetchSearchResults}><Icon name='add'/>Add Food</Button><br/>
						</Grid.Row>
								<li className='foodList'>{addedFood}</li>
						<Grid.Row>
						<Button floated='right' color='green' style={{margin: '10px 0px'}} type='Submit' onClick={(e) => {
								this.props.close(e, this.state); 
								this.resetState();
							}}>Complete Meal</Button>
						</Grid.Row>
					</Form>
				</Modal.Content>
			</Modal>
			</Grid>
		)
	}
}

export default MakeMealForm



import React, { Component } from 'react';
import { Form, Button, Label, Modal, Icon, Grid } from 'semantic-ui-react';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';
import searchIcon from '../Images/searchIcon.png';
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
				<Grid.Row>
					<ul>
						<Icon name='close' color='red' size='big' style={{margin: '10px 0px'}} onClick={() => this.removeFood(food.food_unique_id, food)}/>
						{food.food_name} (Calories: {food.food_calories})
					</ul>
				</Grid.Row>
				</div>
			)
		})
		return(
			<Grid columns='equal'>
			<Modal open={this.props.open}>
				<Modal.Content>
					<Form>
					<Grid.Row>
						<Label size='large' color='green' className='mealListLabel'>Edit your meal</Label>
						<Icon className='closeIcon' name='close' size="large" onClick={(e) =>{
							this.props.closeNoEdit();
							this.resetState();
						}
						}/><br/>
							<select name='meal_type' onChange={this.handleMealType} className="ui dropdown">
								<option value="breakfast">Breakfast</option>
								<option value="lunch">Lunch</option>
								<option value="dinner">Dinner</option>
								<option value="snack">Snack</option>
							</select><br/>
					</Grid.Row>
					<Grid.Row>
						<Label size='large' color='green' style={{margin: '0 0 15px 0'}}>What are you eating?</Label>
							<Searchbar icon={searchIcon} name='input' onChange={this.handleChange} placeholder='Search'/>
							<Button color='green' size='small' style={{margin: '10px 0px'}} onClick={this.fetchSearchResults}><Icon name='add'/>Add Food</Button>
					</Grid.Row>
							<li className='foodList'>{addedFood}</li>
					<Grid.Row>
						<Button floated='right' color='green' style={{margin: '10px 0px'}} type='Submit' onClick={(e) => {
								this.resetState();
								this.props.close(e, this.state);
								this.props.delete(this.state.foodItemsToDelete);
							}}>Finish Edits</Button>
					</Grid.Row>
					</Form>
				</Modal.Content>
			</Modal>
			</Grid>
		)
	}
}

export default EditMealForm

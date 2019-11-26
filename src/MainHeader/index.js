import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Header, List, Button, Label, Grid } from 'semantic-ui-react';

function MainHeader(props){
	console.log(props.meals)
	let totalCalories = 0;
	const mealCalories = props.meals.map((meal) =>{
		totalCalories += meal.calories;
	});

	return(
		<Header>
			<Segment style={{backgroundColor: '#339966', height: '60px'}}>
				<Button className='headerButton' floated='left' onClick={props.openAndCreate}>Make a Meal</Button>
				<Button className='headerButton' floated='right' onClick={props.logOut}>Log Out</Button>
			</Segment>
			<div className='totalCalories'>
				<Label size='large'>Your total number of calories today is: {totalCalories}</Label>
			</div>
		</Header>
	)
		
}


export default MainHeader


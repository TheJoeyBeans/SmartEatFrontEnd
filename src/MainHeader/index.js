import React from 'react';
import { Link } from 'react-router-dom';
import { Header, List, Button, Label } from 'semantic-ui-react';

function MainHeader(props){
	console.log(props.meals)
	let totalCalories = 0;
	const mealCalories = props.meals.map((meal) =>{
		totalCalories += meal.calories;
	});

	return(
		<div>
			<Label>Your total number of calories today is: {totalCalories}</Label>
			<Button onClick={props.openAndCreate}>Make a Meal</Button>
		</div>
	)
		
}


export default MainHeader


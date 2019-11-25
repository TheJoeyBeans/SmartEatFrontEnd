import React from 'react';
import { Card, Button, Grid } from 'semantic-ui-react';

function MealList(props){
	console.log(props.meals, "meal props")
	console.log(props.foodItems, "foodItem props")
	
	const meals = props.meals.map((meal) => {
		const foodItems = props.foodItems.map((foodItem, i) =>{
			if(meal.id === foodItem.meal.id){
				return(
					<li className='foodList' key={i}>
						Food Name: {foodItem.food_name}<br/>
						Calories: {foodItem.food_calories}
					</li>
				)
			}
		});

		return (
			<Grid.Column className='mealList'>
				<Card className='mealListItem' key={meal.id}>
					<Card.Content className='mealListDescription'>
						<Card.Header>{meal.meal_type}</Card.Header>
						<Card.Description>
						For {meal.meal_type}, you ate:<br/>
						<ul>
							{ foodItems }
						</ul><br/>
						For a total of {meal.calories} calories. 
						</Card.Description>
					</Card.Content>
					<Card.Content extra>
						<Button floated='left' className='listButton' size='small' onClick={() => props.openAndEdit(meal, props.foodItems)}>Edit Meal</Button>
						<Button floated='right' className='listButton' size='small' onClick={() => props.deleteMeal(meal.id, props.foodItems)}>Delete Meal</Button>
					</Card.Content>
				</Card>
			</Grid.Column>
		)
	})

	return(
		<Card.Group>
			{ meals }
		</Card.Group>
	)
}

export default MealList

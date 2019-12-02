import React from 'react';
import { Card, Button, Grid, Icon } from 'semantic-ui-react';

function MealList(props){
	console.log(props.meals, "meal props")
	console.log(props.foodItems, "foodItem props")
	const meals = props.meals.map((meal) => {
		if(meal.date_created === props.date){
			const foodItems = props.foodItems.map((foodItem, i) =>{
				if(meal.id === foodItem.meal.id){
					return(
						<li className='foodList' key={i}>
							<Icon name='food'/>{foodItem.food_name} ({foodItem.food_calories} Cal)
						</li>
					)
				}
			});

			return (
				<Grid.Column className='mealList'>
					<Card className='mealListItem' key={meal.id}>
						<Card.Content className='mealListDescription'>
							<Card.Header>For {meal.meal_type}, you ate:</Card.Header>
							<Card.Description>
							<ul>
								{ foodItems }
							</ul><br/>
							For a total of {meal.calories} calories. 
							</Card.Description>
						</Card.Content>
						<Card.Content extra>
							<Button color='green' floated='left' className='listButton' size='small' onClick={() => props.openAndEdit(meal, props.foodItems)}>Edit Meal</Button>
							<Button color='green' floated='right' className='listButton' size='small' onClick={() => props.deleteMeal(meal.id, props.foodItems)}>Delete Meal</Button>
						</Card.Content>
					</Card>
				</Grid.Column>
			)
		}
	})
	return(
		<Card.Group>
			{ meals }
		</Card.Group>
	)
}

export default MealList

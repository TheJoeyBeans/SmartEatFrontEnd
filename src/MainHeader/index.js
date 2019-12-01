import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Header, List, Button, Label, Grid, Icon } from 'semantic-ui-react';

function MainHeader(props){
	console.log(props.meals)
	let totalCalories = 0;
	const mealCalories = props.meals.map((meal) =>{
		totalCalories += meal.calories;
	});

	return(
		<div>
			<Header>
				<Segment style={{backgroundColor: '#339966'}}>
					<Grid columns={3} divided>
						<Grid.Row>
							<Grid.Column>
								<Button className='headerButton' onClick={props.openAndCreate}><Icon name='write'/>Make a Meal</Button>
							</Grid.Column>
							<Grid.Column>
								<h1 className='appTitle'><Icon name='heart'/>Eat Smart</h1>
							</Grid.Column>
							<Grid.Column>
								<Button className='headerButton' floated='right' onClick={props.logOut}><Icon name='sign-out'/>Log Out</Button>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>
			</Header>
			<div className='totalCalories'>
				<Label size='medium'>Today is: {props.date}</Label><br/>
				<Label size='large'>Your total number of calories today is: {totalCalories}</Label>
			</div>
		</div>
	)
		
}


export default MainHeader


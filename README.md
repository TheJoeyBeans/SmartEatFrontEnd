USERSTORIES:

User can make a meal list which tracks food for breakfast, lunch, or dinner. 

User can add food/drink items to their meal lists via search or manual input. 

Food/drink items found via search will have calories attached to them. 

Total calories for the day will be displayed at the top of the page. 

User can set daily caloric intake goal, daily calories will turn red if calories intake becomes greater than goal set by the user. 

WIREFRAMES: https://imgur.com/Jx5cx6i

-Model Outline: 

Meal-Type: text, (Drop down list of Breakfast, lunch, dinner, or snack)
Food: [ {
	Name: text, 
	calories: integer 
} ]
Daily Calorie Goal: Number



Created API will contain data of the meals, 
External nutrition API will be fetched to populate search results with food names and calories. 

Users NOT logged in should be able to use search functionality to find food with caloric values. 
Users logged in will be able to make their meal lists. 

Potential Stretch Goals: 
Users can add “Frequent” foods/drinks which will allow them to select that 

import React from 'react';
import Register from './Register';
import Login from './Login';
import { Route, Switch } from 'react-router-dom';
import MainContainer from './MainContainer';
import './App.css';

const My404 = () => {
	return(
		<div>
			<h3>You are lost.</h3>
		</div>
	)
}

function App() {
  return (
    <main>
    <Switch>
      <Route exact path='/' component={ Register }/>
      <Route exact path='/login' component={ Login }/>
      <Route exact path='/meals' component={ MainContainer }/>
      <Route component={ My404 } />
     </Switch>
    </main>
  );
}

export default App;

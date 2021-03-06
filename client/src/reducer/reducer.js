import * as actions from '../actions/actions';
import cookie from 'react-cookie';

export const initialState = {
	runningTotal: 0,
	winningSet: [17, 18, 19],
	prevPlayer: 2,
	currentPlayer: 1,
	numberOfPlayers: null,
	winner: null,
	loser: null,
	gameCompleted: false,
	games: [],
	gameMode: '',
	seconds:6,
	players:null,
	loggedIn: !!cookie.load('facebookId'),
	user: '',
	errorMessage: ''
}

export default function reducer (state = initialState, action) {
	switch(action.type) {

	case actions.USER_INFO_SUCCESS :
		state = Object.assign({}, state, {user: action.user});
		console.log('state at logged in:', state);
		return state;

	case actions.RESET_GAME : 
	console.log("made it to reset game");
	state = Object.assign({}, state, {
							runningTotal: 0,
							winningSet: [17, 18, 19],
							prevPlayer: 2,
							currentPlayer: 1,
							numberOfPlayers: null,
							winner: null,
							loser: null,
							gameCompleted: false,
							seconds:6,
							players:null
							});
	console.log('state after reset: ', state);
	return state;


	case actions.SAVE_GAME_SUCCESS:
		state = Object.assign({}, state, { games: [action.gameId]});
		return state;

	case actions.SAVE_GAME_ERROR:
		state = Object.assign({}, state, { errorMessage: action.error});
		return state;

	case actions.MAKE_NEW_GAME : 
		let players = [];
		for(var i = 0; i<action.players; i++) {
		
			if(i === 0) {
				players[i] = {id: 'A', score:0, hands:0, ai:null}
			}

			if(i === 1) {
				players[i] = {id: 'B', score:0, hands:0, ai:true}
			}

			if(i === 2) {
				players[i] = {id: 'C', score:0, hands:0, ai:null}
			}

			if(i === 3) {
				players[i] = {id: 'D', score:0, hands:0, ai:null}
			}
		}
			console.log(players);
			state = Object.assign({}, state, {numberOfPlayers:action.players, players:players, gameMode: action.gameMode });
			return state;

	case actions.ADD_CHOICE_TO_TOTAL :
		let increment;
		console.log("THE CURRENT PLAYER IS", state.currentPlayer);
		if( state.players[state.currentPlayer - 1].ai || action.numChoice === null ) {

			increment = Math.ceil(Math.random() *3);
			console.log("THE AI WENT AND ADDED", increment);
		}
		else {
			increment = parseInt(action.numChoice, 10);
		}

			let total = increment + state.runningTotal;
			if ( state.currentPlayer >= state.numberOfPlayers) {

				state.currentPlayer = 1;
			}
			else {

				state.currentPlayer += 1;
			}

			if (total >= 17) {

				let gameLoser = state.currentPlayer;
				let gameIsDone = true;
		
		let newState = Object.assign({}, state, {loser: gameLoser, gameCompleted: gameIsDone});
		console.log(newState);
		return newState;
		//At this point we would have the loser displayed and the gameData will be sent to the server
			}
		
			let newState = Object.assign({}, state, 
				{runningTotal: total}, {currentPlayer:state.currentPlayer, seconds:6});
			console.log(newState);
			return newState;

	  case actions.SUBTRACT_SECOND :
			let newCount = state.seconds -= 1;
			let subtractedState = Object.assign({}, state,{ seconds: newCount});
			console.log("THE NUMBER OF SECONDS IS", state.seconds);
			return subtractedState;
			break;
	default: 
		return state;
	}
}

//Our Ai takes running total as an parameter and if it its not equal to the winning set pick a random number between one and three
//one way have a lifecycle method triggered when the player is number 2 and have the AI function run

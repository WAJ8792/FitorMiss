import { combineReducers } from 'redux';

import { gym_reducer } from './gym_reducer';
import { session_reducer } from './session_reducer';
import { toggle_sidebar } from './sidebar_reducer';
import { address_reducer } from './address_reducer';
import { classes_reducer } from './classes_reducer';


const RootReducer = combineReducers({
  gym: gym_reducer,
  sessions: session_reducer,
  sidebar: toggle_sidebar,
  adress: address_reducer,
  classes: classes_reducer,
});

export default RootReducer;

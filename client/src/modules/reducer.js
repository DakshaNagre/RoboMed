import { SET_USER } from "./action";

function userDataReducer(state={}, action){
    switch(action.type) {
        case SET_USER:
          return Object.assign({}, state,action.user); 
         default: 
           return state;
     }
}

export default userDataReducer;
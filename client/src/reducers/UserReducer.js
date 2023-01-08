import {useReducer} from "react";

export const initialState = null;

export function reducer (state , action){
    if(action.type === "USER"){
        return action.payload;
    }
    if(action.type==="CLEAR"){
        return null
    }
} 
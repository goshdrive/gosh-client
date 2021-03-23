import * as ActionTypes from './ActionTypes';

export const Reagents = (state = {
    errMess: null,
    reagents: []
}, action) => {
    switch(action.type) {
        case ActionTypes.RENDER_REAGENTS:
            return {...state, isLoading: false, errMess: null, reagents: action.payload}
        
        case ActionTypes.REAGENTS_LOADING:
            return {...state, isLoading: true, errMess: null, reagents: []}

        case ActionTypes.REAGENTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, reagents: []}

        case ActionTypes.ADD_REAGENTS:
            var reagent = action.payload;
            return {...state, reagents: state.reagents.concat(reagent)};

        case ActionTypes.UPDATE_REAGENTS:
            var reagent = action.payload;
            var reagentsCopy = state.reagents.slice()
            var foundIndex = reagentsCopy.findIndex(x => x.id == reagent.id);
            reagentsCopy[foundIndex] = reagent;
            
            return {...state, reagents: reagentsCopy}
       
        case ActionTypes.REMOVE_REAGENTS:
            var reagent = action.payload;
            return {...state, reagents: state.reagents.filter(
                item => item.id !== reagent
            )};

        default:
            return state;
    }
}
import { sortByAlpha } from './../lib/utils.js';

const choices = (state = [], action) => {
    switch (action.type) {
        case 'ADD_CHOICE':
            return [...state, {
                id: action.id,
                groupId: action.groupId,
                value: action.value,
                label: action.label,
                disabled: action.disabled, // A disabled choice appears in the choice dropdown but cannot be selected
                selected: false, // A selected choice has been added to the passed input's value (added as an item)
                active: true, // An active choice appears within the choice dropdown
                score: 9999,
            }].sort(sortByAlpha);

        case 'ADD_ITEM':
            let newState = state;

            // If all choices need to be activated
            if(action.activateOptions) {
                newState = state.map((choice) => {
                    choice.active = action.active;
                    return choice;
                }).sort(sortByAlpha);
            }
            // When an item is added and it has an associated choice,
            // we want to disable it so it can't be chosen again
            if(action.choiceId > -1) {
                newState = state.map((choice) => {
                    if(choice.id === parseInt(action.choiceId)) {
                        choice.selected = true;
                    }
                    return choice;
                });
            }

            return newState;

        case 'REMOVE_ITEM':
            // When an item is removed and it has an associated choice,
            // we want to re-enable it so it can be chosen again
            if(action.choiceId > -1) {
                return state.map((choice) => {
                    if(choice.id === parseInt(action.choiceId)) {
                        choice.selected = false;
                    }
                    return choice;
                });
            } else {
                return state;
            }

        case 'FILTER_CHOICES':
            const filteredResults = action.results;
            const filteredState = state.map((choice, index) => {
                // Set active state based on whether choice is 
                // within filtered results
        
                choice.active = filteredResults.some((result) => {
                    if(result.item.id === choice.id) {
                        choice.score = result.score;
                        return true;
                    }
                });

                return choice;
            }).sort((prev, next) => {
                return prev.score - next.score;
            });

            return filteredState;

        case 'ACTIVATE_CHOICES':
            return state.map((choice) => {
                choice.active = action.active;
                return choice;
            }).sort(sortByAlpha);
            

        default:
            return state;
    }
}

export default choices;
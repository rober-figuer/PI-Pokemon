const initialState = {  pokemons: [],
                        types: [] }         

function reducer(state = initialState,  {type, payload}) {
    switch (type) {
        case "GET_POKEMONS":
            return {
                ...state,
                pokemons: payload
            }
        default: 
    }
}


export default reducer;  // al reducer lo llevamos al store
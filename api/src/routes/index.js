const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require('axios');
const { Pokemon, Type, loadedTypes } = require('../db');
const { pokemonURL, pokemonTYPE } = require('../endpoints');


const router = Router();

//funciones controladoras
const getApiInfo = async () => {
    let apiURL = await axios.get(pokemonURL);
    //console.log(apiURL.data.results);
    let apiINFO = await apiURL.data.results.map(e => axios.get(e.url));
    //console.log(apiINFO);
    let apiALL = await axios.all(apiINFO);
    let apiLAST = apiALL.map(e => e.data);
    
    return apiLAST.map(e => {
        return { name: e.name,
                 id: e.id,
                 life: e.stats[0].base_stat,     // falta type, img
                 strength: e.stats[1].base_stat,
                 defense: e.stats[2].base_stat,
                 speed: e.stats[5].base_stat,
                 height: e.height,
                 weight: e.weight }
    })

};

///////////////////////////////////////////////////////////////////////////////

const getDbInfo = async () => {
    return await Pokemon.findAll(/* { include: { model: Type,
                                               attibutes: ['name'],
                                               through: { attributes: [] } }}*/)
}

////////////////////////////////////////////////////////////////////////////////

const getInfoAPInDB = async () => {
    let pokemonAPI = await getApiInfo();
    let pokemonDB = await getDbInfo();
    let joinedInfo = pokemonAPI.concat(pokemonDB);
    
    return joinedInfo; 
}


//Routes

router.get('/pokemons', async (req, res) => {
    let boxAllPokemons = await getInfoAPInDB();
    let nameQuery = req.query.name;
    if(nameQuery) {                                                            //.includes
        let pokemonName = await boxAllPokemons.filter(el => el.name.toLowerCase() === (nameQuery.toLowerCase()));
        if(pokemonName.length != 0) {
            res.status(200).send(pokemonName) ; 
        }else res.status(404).send('Pokemon not found');
    }
    res.status(200).send(boxAllPokemons);
});

router.get('/pokemons/:id', async (req, res) => {
    let pokemonId = req.params.id;
    let boxAllPokemons = await getInfoAPInDB();
    if(pokemonId) {
        let filteredPokemon = await boxAllPokemons.filter(el => el.id == pokemonId)
        filteredPokemon ? ////////////
        res.status(200).send(filteredPokemon) : res.status(404).send('Sorry, pokemon not found')
    }
});

router.get('/types', async (req, res) => {
    let allTypes = await loadedTypes();
    //console.log((allTypes1))
    res.send(allTypes);/////////////////////////////////
} );

router.post('/pokemons', async (req, res) => {
    const { name,
            
            life,
            strength,
            defense,
            speed,
            height,
            weight } = req.body;
    
    const pokemonCreated = await Pokemon.create({ name,
                                                  
                                                  life,
                                                  strength,
                                                  defense,
                                                  speed,
                                                  height,
                                                  weight });
    const JSONpokemon = pokemonCreated.toJSON();
    res.send(pokemonCreated);
            
});


module.exports = router;

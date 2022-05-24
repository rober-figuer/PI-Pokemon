require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {  DB_USER, DB_PASSWORD, DB_HOST, } = process.env;
const axios = require('axios'); ////////// added for loeadedTypes
const { pokemonTYPE } = require('./endpoints');

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`, {
  logging: false, // set 
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);
console.log(sequelize.models);
// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Pokemon, Type } = sequelize.models;


//Cargo los tipos de pokemons en el modelo de Types, los traigo de la api a la base de datos
const loadedTypes = async function() {
  //try {
    let typesApi = await axios.get(pokemonTYPE)
    let mappedTypes = typesApi.data.results.map(el => ( {name: el.name}))
    console.log('Loading types....');
    //console.log(mappedTypes);
    //await Type.findOrCreate(mappedTypes); CORRECTA
    mappedTypes.forEach(el => { Type.findOrCreate( { where: el } )   // cuidado con el force
                              });
    //const allTypes = await Type.findAll();
    //console.log(allTypes);
    //res.send(allTypes)

    //mappedTypes.map(async function (el)  { return await  Type.create(el)});

    //for(i = 0; i < mappedTypes.length; i ++) {
    //  await Type.create( mappedTypes[i] );
    //} 
    
  //} catch (error) {
  //  console.log('ERROR CATCHED')
   
  //}
  console.log('ended function');
  const allTypes = await Type.findAll();
  
  //console.log(allTypes);
  return allTypes;
};



// RELATIONS
Pokemon.belongsToMany(Type, { through: 'pokemonXtype' });
Type.belongsToMany(Pokemon, { through : 'pokemonXtype' });



module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
  loadedTypes,  ////////////
};

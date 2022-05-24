const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {  
  // defino el modelo
  sequelize.define('pokemon', {   
    name: { type: DataTypes.STRING,
            allowNull: false },
    id: { type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true },
    life: { type: DataTypes.INTEGER,
            allowNull: true },
    strength: { type: DataTypes.INTEGER,
                allowNull: true },
    defense: {  type: DataTypes.INTEGER,
                allowNull: true },
    speed: { type: DataTypes.INTEGER,
              allowNull: true },
    height: { type: DataTypes.INTEGER,
              allowNull: true },
    weight: { type: DataTypes.INTEGER,
              allowNull: true }
    //image: { type: DataTypes.}
                                         }, {timestamps: false});
 

  
};

// function generateUID() {
//         // I generate the UID from two parts here 
//         // to ensure the random number provide enough bits.
//         var firstPart = (Math.random() * 46656);
//         //console.log(firstPart);
//         var secondPart = (Math.random() * 46656);
//         firstPart = ("000" + firstPart.toString(36)).slice(-3);
//       //console.log(firstPartRAN)
//         secondPart = ("000" + secondPart.toString(36)).slice(-3);
//         return firstPart + secondPart;
//     };
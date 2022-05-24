const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {  
  sequelize.define('type', {    // no defino id porque sequelize lo define solo
    name: { type: DataTypes.STRING,
            allowNull: false 
          }


                               }, {timestamps: false} );


  
};

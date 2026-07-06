const { sequelize } = require("../../ozrit/nodejs/models");

module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define(
        'Brand',
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'brands',
            timestamps: true,
            underscored: true
        }
    );

    Brand.associate = (models) => {
        Brand.hasMany(models.Product, {
            foreignKey: 'brand_id',
            as: 'products',
            as: 'products',
            onDelete: 'CASCADE',
        })
    }
    return Brand;
}
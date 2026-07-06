module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define(
        'Product',
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
            },
            category_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            brand_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            }
        },
        {
            tableName: 'products',
            timestamps: true,
            underscored: true
        }
    );

    Product.associate = (models) => {
        Product.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category',
            onDelete: 'CASCADE'
        });
    };

    
    Product.associate = (models) => {
        Product.belongsTo(models.Brand, {
            foreignKey: 'brand_id',
            as: 'brand',
            onDelete: 'CASCADE'
        });
    };


    return Product;
};

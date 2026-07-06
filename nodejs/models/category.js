module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
        'Category',
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
            image: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            tableName: 'categories',
            timestamps: true,
            underscored: true
        }
    );

    
    Category.associate = (models) => {
        Category.hasMany(models.Product, {
            foreignKey: 'category_id',
            as: 'products',
            onDelete: 'CASCADE'
        });
    };

    

    return Category;
};


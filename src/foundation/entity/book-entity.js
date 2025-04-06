'use-strict';

import { DataTypes } from 'sequelize';
import DbManager from '../db/db-manager.js';

const BookEntity = DbManager.entity('BookEntity', {
    Name: {
        type: DataTypes.STRING,
        unique: 'unique_key'
    },
    Score: {
        type: DataTypes.DECIMAL
    }
}, {
    tableName: 'book',
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    uniqueKeys: {
        unique_key: {
            name: 'book_ukey',
            fields: ['name']
        }
    }
});

export default BookEntity;
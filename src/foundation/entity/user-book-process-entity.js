'use-strict';

import { DataTypes } from 'sequelize';
import DbManager from '../db/db-manager.js';

const PROCESS_ENUM = {
    BORROW: 'borrow',
    RETURN: 'return'
}

const UserBookProcessEntity = DbManager.entity('UserBookProcessEntity', {
    UserId: {
        type: DataTypes.INTEGER,
        unique: 'unique_key'
    },
    BookId: {
        type: DataTypes.INTEGER,
        unique: 'unique_key'
    },
    ProcessName: {
        type: DataTypes.STRING
    },
    UserScore: {
        type: DataTypes.DECIMAL
    }
}, {
    tableName: 'user_book_process',
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    uniqueKeys: {
        unique_key: {
            name: 'user_book_process_ukey',
            fields: ['user_id', 'book_id']
        }
    }
});

export { UserBookProcessEntity, PROCESS_ENUM };
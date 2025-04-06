'use-strict';

import { DataTypes } from 'sequelize';
import DbManager from '../db/db-manager.js';

const UserEntity = DbManager.entity('UserEntity', {
    Name: {
        type: DataTypes.STRING,
        unique: 'unique_key'
    }
}, {
    tableName: 'user',
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    uniqueKeys: {
        unique_key: {
            name: 'user_ukey',
            fields: ['name']
        }
    }
});

export default UserEntity;
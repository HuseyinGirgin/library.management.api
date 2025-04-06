'use-strict';

import { Sequelize } from 'sequelize';
import BaseDbManager from './base-db-manager.js';
import Utils from '../utils.js';

const DB_CONTEXT = {
    Instance: null
}

class DbManager extends BaseDbManager {

    static connectDb() {
        try {
            if (Utils.notAssigned(DB_CONTEXT.Instance)) {
                const dbName = process.env.DB_NAME;
                const userName = process.env.DB_USER;
                const password = process.env.DB_PASSWORD;
                const options = {
                    host: process.env.DB_HOST || 'localhost',
                    dialect: process.env.DB_DIALECT || 'postgres',
                    port: process.env.DB_PORT || 5432
                }
                DB_CONTEXT.Instance = new Sequelize(dbName, userName, password, options);
            }
        } catch (err) {
            console.log(`An error occurred while connecting db.Error:${err}`);
            throw err;
        }
    }

    static async closeDb() {
        try {
            if (Utils.assigned(DB_CONTEXT.Instance)) {
                await this.getDbInstance().close();
            }
        } catch (err) {
            console.log(`An error occurred while closing db.Error:${err}`);
        }
    }

    static async transaction(dbTransactionCallBack) {
        const transaction = await this.getDbInstance().transaction();
        try {
            await dbTransactionCallBack(transaction);
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    static async authenticate() {
        try {
            await this.getDbInstance().authenticate();
        } catch (err) {
            throw err;
        }
    }

    static getDbInstance() {
        this.connectDb();

        return DB_CONTEXT.Instance;
    }

    static entity(name, columns, options) {
        return this.getDbInstance().define(name, columns, options)
    }

    static async query(query, options) {
        return await this.getDbInstance().query(query, options);
    }
}

export default DbManager;
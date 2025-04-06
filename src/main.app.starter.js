'use-strict';

const port = process.env.PORT;

import express, { json } from 'express';
import libraryRouter from './routers/library.js';
import DbManager from './foundation/db/db-manager.js';

DbManager.connectDb();
await DbManager.authenticate();

const app = express();
app.use(json());
app.use(libraryRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
import * as Mongoose from "mongoose";
import { IDataConfiguration } from "./configurations";

export interface IDatabase {
}

export function init(config: IDataConfiguration): IDatabase {
  (<any>Mongoose).Promise = Promise;
  let options = {
    user: config.username,
    pass: config.password
  };
  Mongoose.connect(config.connectionString, options);

  let mongoDb = Mongoose.connection;

  mongoDb.on("error", () => {
    console.log(`Unable to connect to database: ${config.connectionString}`);
  });

  mongoDb.once("open", () => {
    console.log(`Connected to database: ${config.connectionString}`);
  });

  return {
  };
}

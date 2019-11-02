import * as Mongoose from "mongoose";
import { IDataConfiguration } from "./configurations";
import { IUrl, UrlModel } from "./api/crawler/model";

export interface IDatabase {
  urlModel: Mongoose.Model<IUrl>;
}

export function init(config: IDataConfiguration): IDatabase {
  (<any>Mongoose).Promise = Promise;
  let options = {
    user: config.username,
    pass: config.password,
    useNewUrlParser: true,
    useUnifiedTopology: true
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
    urlModel: UrlModel
  };
}

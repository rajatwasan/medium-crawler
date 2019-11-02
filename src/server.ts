import * as Hapi from "hapi";
import * as Boom from "boom";
import { IServerConfigurations } from "./configurations";
import * as crawler from "./api/crawler";
import { IDatabase } from "./database";
import * as http from 'http';

http.globalAgent.maxSockets = 5;

export async function init(
  configs: IServerConfigurations,
  database: IDatabase
): Promise<Hapi.Server> {
  try {
    const port = process.env.PORT || configs.port;
    const server = new Hapi.Server({
      debug: { request: ['error'] },
      port: port,
      routes: {
        cors: {
          origin: ["*"]
        }
      }
    });

    if (configs.routePrefix) {
      server.realm.modifiers.route.prefix = configs.routePrefix;
    }

    console.log("Register Routes");
    crawler.init(server, configs, database);
    console.log("Routes registered sucessfully.");

    return server;
  } catch (err) {
    console.log("Error starting server: ", err);
    throw err;
  }
}

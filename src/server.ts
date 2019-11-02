import * as Hapi from "hapi";
import * as Boom from "boom";
import { IServerConfigurations } from "./configurations";
import { IDatabase } from "./database";

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
    // add routes
    console.log("Routes registered sucessfully.");

    return server;
  } catch (err) {
    console.log("Error starting server: ", err);
    throw err;
  }
}

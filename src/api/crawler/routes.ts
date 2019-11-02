import * as Hapi from "hapi";
import * as Joi from "joi";
import UrlController from "./controller";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";

export default function(
  server: Hapi.Server,
  serverConfigs: IServerConfigurations,
  database: IDatabase
) {
  const urlController = new UrlController(serverConfigs, database);
  server.bind(urlController);

  server.route({
    method: "GET",
    path: "/",
    options: {
      handler: urlController.getData,
      auth: false,
      tags: ["api", "url"],
      description: "Get crawled urls.",
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Urls retrieved."
            }
          }
        }
      }
    }
  });
  server.route({
    method: "GET",
    path: "/crawl",
    options: {
      handler: urlController.crawl,
      auth: false,
      tags: ["api", "url"],
      description: "Crawl the web.",
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Successful."
            }
          }
        }
      }
    }
  });
}

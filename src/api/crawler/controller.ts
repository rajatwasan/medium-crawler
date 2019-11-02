import * as Hapi from "hapi";
import * as Boom from "boom";
import { IUrl } from "./model";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { IRequest } from "../../interfaces/request";
import * as Request from "request-promise";
import * as cheerio from "cheerio";

import * as Http from 'http';
import * as Https from 'https';
const Wreck = require('wreck');

const wreck = Wreck.defaults({
  agents: {
      https: new Https.Agent({ maxSockets: 5 }),
      http: new Http.Agent({ maxSockets: 5 }),
      httpsAllowUnauthorized: new Https.Agent({ maxSockets: 5, rejectUnauthorized: false })
  }
});
// import { performance } from "perf_hooks";
import * as URL from 'url';
export default class UrlController {
  private database: IDatabase;
  private configs: IServerConfigurations;
  queue = [];

  constructor(configs: IServerConfigurations, database: IDatabase) {
    this.database = database;
    this.configs = configs;
  }
  public async crawl(request: IRequest, h: Hapi.ResponseToolkit) {
    let collection = await this.database.urlModel.find();
    let url = 'https://medium.com/';
    // let url1 = 'https://medium.com/topic/technology';
    try {
      await this.Crawler(url);
      return h.response(collection).code(201);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  }
  async Crawler(url) {
    console.log("Crawler started for url:", url);
    try {
      let html = await wreck.get(url);
      let $ = cheerio.load(html.toString());

      let urls = $("a");
      let array = [];

      Object.keys(urls).forEach(async (item) => {
        if (urls[item].type === 'tag') {
          // console.log(urls[item]);
          let href = urls[item].attribs.href.trim();

          if (href && array.indexOf(href) === -1) {
            let url = href.split('?')[0];
            let params = Object.keys(URL.parse(href, true)['query']);
            let urlCollection = await this.database.urlModel.findOne({url});
            if (urlCollection) {
              params.forEach(param => {
                if (urlCollection[index].params.indexOf(param) === -1) {
                  urlCollection[index].refCount += 1;
                  urlCollection[index].params.push(param);
                }
              });
            } else {
              this.queue.push(url);
              // await this.Crawler(url); // add max socket to avoid blocking
              array.push({ url, params });
            }
          }
        }
      });
      let arrayDocument: IUrl[] = [],
        uniqueUrl = [], //collection.map(x => x.url),
        index;
      for (let i = 0; i < array.length; i++) {
        index = uniqueUrl.indexOf(array[i].url);
        if (index !== -1) {
          array[i].params.forEach(param => {
            if (arrayDocument[index].params.indexOf(param) === -1) {
              arrayDocument[index].refCount += 1;
              arrayDocument[index].params.push(param);
            }
          });
        } else {
          uniqueUrl.push(array[i].url);
          array[i].refCount = 1;
          arrayDocument.push(array[i]);
        }
      }
      return await this.database.urlModel.create(arrayDocument);
    } catch (error) {
      console.log("Error:", error);
      return Boom.badImplementation(error);
    }
  }
  public async getData(request: IRequest, h: Hapi.ResponseToolkit) {
    let urls = await this.database.urlModel.find();
    if (!urls) {
      return Boom.notFound("Run crawl api");
    }
    return h.response(urls);
  }
}

import * as Hapi from "hapi";
import * as Boom from "boom";
import { IUrl } from "./model";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { IRequest } from "../../interfaces/request";
import * as Request from "request-promise";
import * as cheerio from "cheerio";
// const request = require('request-promise');
// const cheerio = require('cheerio');
import { performance } from "perf_hooks";
import * as URL from 'url';
export default class UrlController {
  private database: IDatabase;
  private configs: IServerConfigurations;

  constructor(configs: IServerConfigurations, database: IDatabase) {
    this.database = database;
    this.configs = configs;
  }
  public async crawl(request: IRequest, h: Hapi.ResponseToolkit) {
    let collection = await this.database.urlModel.find();

    let url = 'https://medium.com/';
    let array = [];

    let html = await Request.get(url);
    let $ = cheerio.load(html.toString());
    try {
      let urls = $("a");
      // console.log(urls[0]);
      Object.keys(urls).forEach(async (item) => {
        if (urls[item].type === 'tag') {
          // console.log(urls[item]);
          let href = urls[item].attribs.href.trim();

          if (href && array.indexOf(href) === -1) {
            let url = href.split('?')[0];
            let queryData = Object.keys(URL.parse(href, true)['query']);
            // const params = new URL.URLSearchParams(href.split('?')[1]);
            // console.log(params);
            // if (queryData) {
            //   console.log(queryData);
            // }
            array.push({ url, params: queryData });
          }
        }
      });
      let arrayDocument:IUrl[] = [],
        uniqueUrl = collection.map(x => x.url),
        index;

      for (let i = 0; i < array.length; i++) {
        index = uniqueUrl.indexOf(array[i].url);
        if (index !== -1) {
          collection[index].refCount += 1;
          array[i].params.forEach(param => {
            if (collection[index].params.indexOf(param) === -1) {
              collection[index].params.push(param);
            }
          });
          collection[index].save();
        } else {
          uniqueUrl.push(array[i].url);
          array[i].refCount = 1;
          arrayDocument.push(array[i]);
        }
      }
      // collection.save();
      if (arrayDocument.length > 0) {
        arrayDocument = await this.database.urlModel.create(arrayDocument);
        arrayDocument.forEach(element => {
          collection.push(element);
        });
        return h.response(collection).code(201);
      }
      return h.response(collection).code(201);
    } catch (error) {
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

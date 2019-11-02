# Problem statement

Recursively crawl popular blogging website https://medium.com using Node.js and harvest all
possible hyperlinks that belong to medium.com and store them in a database of your choice

**Installation**

* *npm run setup*

**Run**

* *gulp build* (build ts files)
* *gulp test* (run mocha tests)
* *gulp tslint* (run tslint)
* *gulp watch* (watch ts files)
* *npm run start* (start the application)
* *npm run watch* (restart the application when files change)

Running on port 5000 ex: localhost:5000

# APIs

Path: / 
get all the data

Path: /crawl
crawl the url
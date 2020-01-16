Created with the help of node packages express, nodemon, cors, xml2json and moment.

# Please Start up the server before starting up the client.

## Server

Navigate to the server directory. (If on windows, it only seems to work if you run as administrator, seems to be a windows xml2json issue)

`npm install` will install required dependancies.

`npm run server:dev` will start up the backend which acts as a local api running on [http://localhost:3000](http://localhost:3000).

## Client

Navigate to the client directory.

`npm install` will install the required dependancies.

`npm start` will try to start the front end at [http://localhost:3000](http://localhost:3000) but this is being used to run the back-end so respond `y` to the prompt about running on another port which will cause it to most likely launch on [http://localhost:3001](http://localhost:3001)


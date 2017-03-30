# Introduction 
_Author: Yu-ching Sun_

This application is a basic search application, which allows users to search tweets and amazon video reviews according to their input string. 

### Implementation

  - Use MongoDB, Express, AngularJS and Node.js to implement front end and back end.

### Installation
Open a terminal for MongoDB driver, enter
```sh
$ mongod
```

Open another terminal for MongoDB shell, enter

```sh
$ mongo
```

If MongoDB shell shows the following, 
meaning we can use the shell to access data
```sh
MongoDB shell version: 2.6.10
connecting to: test
```

In the shell, check if our collections are in the database or not

```sh
$ use users
$ show collections
```

If collections are in the database, we drop the collections
in case the previous collections are not correct

```sh
$ db.tweets_sandy.drop()
$ db.amazon_video.drop()
```
If both commands return true, meaning dropping succeeds. 

Then we need to import tweets_sandy and amazon_video collections
Open a new terminal

```sh
$ mongoimport --headerline --db users --collection tweets_sandy --type csv --file filepath/tweets_sandy.csv
$ mongoimport --db users --collection amazon_video --type json --file filepath/video.json
```

If both collections are imported correctly, 
the terminal will show the following message for tweets_sandy collection

```sh
imported 11226 objects
```

and the message for amazon_video collection

```sh
imported 37126 objects
```

Still at the MongoDB shell,
add 'comments' field to both collections, tweets_sandy and amazon_video

```sh
db.tweets_sandy.update({},{$set:{'comments':[]},{upsert:false,multi:true}})
db.amazon_video.update({},{$set:{'comments':[]},{upsert:false,multi:true}})
```


Open a new terminal, go to the directory containing server.js file,
check if node is installed, by typing

```sh
$node -v
```

if it shows the version of node, such as "v4.2.6" then we can type

```sh
$npm init
```

Press enter to skip the questions, and type "yes" in the end.
Then, we install mongodb and assert

```sh
$npm install mongodb --save
$npm install assert --save
$npm install body-parser
```

And finally at the file path,
run the server.js file, by typing

```sh
$node server.js
```

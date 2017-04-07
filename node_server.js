var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var ObjectId = require('mongodb').ObjectId; 
 
var database;

var port = 5000;
var result=[];
var findRecord;

app.use(express.static(__dirname+'/frontend'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/search', function (req, res){
	
	// get the request string 
	var searchWord = req.query.searchString;
	console.log(searchWord);
	var inputList = searchWord.split('/');
	console.log(inputList[0]);
	console.log(inputList[1]);
	var findDict1 = {};
	var findDict2 = {};
	
	if(inputList[0] == 'amazon_video'){
		findDict1 = {'reviewText':{$regex:inputList[1],$options:'i'}};
		findDict2 = {_id:1,reviewerID:1,reviewerName:1,reviewText:1,reviewTime:1,comments:1};
	}
	else{
		findDict1 = {'text':{$regex:inputList[1],$options:'i'}};
		findDict2 = {_id:1,fromUser:1,fromUserId:1,text:1,createdAt:1,comments:1};
	}
	
	console.log(findDict1);
		console.log(findDict2);

	
	database.collection(inputList[0], function(err, collection) {
		console.log('collection');
		
		
		result = collection.find( findDict1,findDict2 ).toArray();
	
			
			result.then(function(something){
				
	
			res.json(something);
			});
		
	});
    
});

app.post('/post', function (req, res){
	console.log('posted');
	var databaseUse=req.body.whichDatabase;
	var docID = req.body.id;
	
	var comment = req.body.comment;
	console.log(docID);
	console.log(comment.name + " " + comment.content);
	//amazon 
	if (databaseUse == 'amazon_video'){
		database.collection(databaseUse, function(err, collection) {
		
		console.log('connect to amazon_video');
		
		// insert a comment to the comments attribute
		collection.update( {_id:new ObjectId(docID)},
							{ $push: { comments: comment } }
						 );
		});
	}
	else{
		database.collection(databaseUse, function(err, collection) {
		
			console.log('connect to tweets_sandy');
			
			// insert a comment to the comments attribute
			collection.update( {_id:new ObjectId(docID)},
								{ $push: { comments: comment}});
		});
	}//else
});
	
	
	


// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/users", function(err, db) {
  if(!err) {
    console.log("We are connected");
	database = db;
	//app.get();
  }
  app.listen(port);
});

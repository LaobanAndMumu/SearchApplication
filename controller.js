angular.module('myApp',[]).
controller('myController',['$scope','$http',function($scope,$http){
	$scope.search= '';
	$scope.docs=[];
	$scope.status="";
	$scope.twitter = false;
	$scope.amazon = false; 
	$scope.length;
	$scope.errorMessage;
	$scope.databaseUse;
	$scope.printDatabase;
	
	$scope.loading = false;
	$scope.zeroLength=true;
	
	$scope.onclick = function(){
		$scope.loading = true;
		$scope.errorMessage="";						
        $scope.length;
		
		if ($scope.search.trim()!=''){
			if($scope.amazon || $scope.twitter){
				var collection ='';
				if ($scope.amazon){
					collection = 'amazon_video/';
					
				}
				else{
					collection='tweets_sandy/';
					
				}
				
				$http({ url:'/search', method: "GET", 
				   params:{'searchString':(collection + $scope.search)}}).
					success(function(data,status,headers,config){
						$scope.docs = data;
						$scope.length = data.length;
						
						if($scope.length === 0){
					        
							$scope.errorMessage='No matches found';
							$scope.zeroLength=true;
						}
						else{
							$scope.length = 'Number of Matches Found: ' +$scope.length; 
							$scope.zeroLength=false;
						}
					}).error(function(data,status,headers,config){
						$scope.status= data.msg;
					}).finally(function() {
						// called no matter success or failure
						$scope.loading = false;
					});
					
				     
				
			}
			else{
				$scope.zeroLength=true;
				$scope.length='';
				$scope.docs = [];
				$scope.loading = false;
				$scope.errorMessage='No collection chosen';
				
			}
		}
		else{
			$scope.length='';
			$scope.docs = [];
			$scope.loading = false;
			$scope.errorMessage='No search word submitted';
		}
	};
	
	$scope.selectTwitter=function(){
		$scope.twitter=true;
		$scope.amazon=false;
		$scope.databaseUse = 'tweets_sandy';
		$scope.printDatabase='You choose Twitter database';
	}
	$scope.selectAmazon=function(){
		$scope.amazon=true;
		$scope.twitter=false;
		$scope.databaseUse = 'amazon_video';
		$scope.printDatabase='You choose Amazon database';
	}

}]).

controller('resultController',['$scope','$http',function($scope,$http){
	$scope.showing = true;
	$scope.showComment=true;
	$scope.writeComment=true;
	
	$scope.seeButton = "";
	$scope.resultText = "";
	$scope.dbID;
	$scope.idNo;
	$scope.post = "";
	$scope.comments=[];
	$scope.commentName='';
	$scope.newcomment='';
	$scope.insertMessage='';

	$scope.formatDoc = function(doc){
				
		if ($scope.amazon) {
			$scope.seeButton = "See Amazon Video Review";
			var date = doc.reviewTime.split(' ');
			$scope.resultText = "User name: " + doc.reviewerName + ", Review ID: " +
				doc.reviewerID + ", Review Created At: " + date[1].replace(/,/g,'') + " " + date[0] + " " + date[2];
			$scope.post = doc.reviewText;
			$scope.idNo=doc.reviewerID;
			$scope.dbID = doc._id;
		}
		else{
		
			$scope.seeButton = "See Tweet Content about Sandy";
			var date= doc.createdAt.split(' ');
			$scope.resultText = "User name: " + doc.fromUser + ", User id: " +
				doc.fromUserId + ", Tweet Created At: " + date[1] + " " + date[2] + " " + date[3];
			$scope.post = doc.text;
			$scope.idNo = doc.fromUserId;
			$scope.dbID = doc._id;
		}

		if(doc.comments){
			$scope.comments = doc.comments;
		}
	}
	
	// make comments
	$scope.makeComment=function(){
		if ($scope.newcomment.trim()==''){
			$scope.newcomment='';
		}
		
		else{
			$scope.message = "fired";
			var published = new Date().toISOString();
			$scope.comments.push({name:$scope.commentName,content:$scope.newcomment,time:published});
			$scope.message="fired2";
			$http({ url:'/post', method: "POST", 
				data:{whichDatabase: $scope.databaseUse,id:$scope.dbID, 
				comment:{name:$scope.commentName,content:$scope.newcomment,time:published} }}
				).success(function(data,status,headers,config){
					$scope.insertMessage='successfully create a comment';
					
					
				}).error(function(data,status,headers,config){
					$scope.status= data.msg;
				});			
		}
		$scope.commentName='';
		$scope.newcomment = "";
	}//
	
	$scope.listclick=function(){
		$scope.showing = !$scope.showing;
	}
	$scope.commentHider=function(){
		$scope.showComment=!$scope.showComment;
	}
	$scope.showWriteComment=function(){
		$scope.writeComment=!$scope.writeComment;
	}
	
}]);

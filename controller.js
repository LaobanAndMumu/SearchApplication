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
	var idNo;
	$scope.post = "";
	$scope.comments=[];
	$scope.newcomment='';
	$scope.insertMessage='';

	$scope.formatDoc = function(doc){
				
		if ($scope.amazon) {
			$scope.seeButton = "See Amazon Video Review";
			var date = doc.reviewTime.split(' ');
			$scope.resultText = "User name: " + doc.reviewerName + ", Review ID: " +
				doc.reviewerID + ", Review Created At: " + date[1].replace(/,/g,'') + " " + date[0] + " " + date[2];
			$scope.post = doc.reviewText;
			idNo=doc.reviewerID;
		}
		else{
		
			$scope.seeButton = "See Tweet Content about Sandy";
			var date= doc.createdAt.split(' ');
			$scope.resultText = "User name: " + doc.fromUser + ", User id: " +
				doc.fromUserId + ", Tweet Created At: " + date[1] + " " + date[2] + " " + date[3];
			$scope.post = doc.tweet;
			idNo = doc.fromUserId;
		}
		
		$scope.comments=doc.comments;
	}
	
	// make comments
	$scope.makeComment=function(){
		if ($scope.newcomment.trim()==''){
			$scope.newcomment='';
		}
		
		else{
			var published = new Date().toISOString();
			$scope.comments.push({content:$scope.newcomment,time:published});
			
			$http({ url:'/post', method: "POST", 
				data:{whichDatabase: databaseUse,id:idNo, comment:{content:$scope.newcomment,time:published} }}).
				success(function(data,status,headers,config){
					$scope.insertMessage='successfully create a comment';
					
					
				}).error(function(data,status,headers,config){
					$scope.status= data.msg;
				});
		}
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
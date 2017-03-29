angular.module('myApp',[]).
controller('myController',['$scope','$http',function($scope,$http){
	$scope.search= '';
	$scope.docs=[];
	$scope.status="";
	$scope.twitter = false;
	$scope.amazon = false; 
	$scope.length;
	$scope.errorMessage;
	$scope.insertMessage='';

	$scope.onclick = function(){
		
		$scope.errorMessage="";						
        $scope.length=0;
		
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
						if($scope.length == 0){
					
							$scope.errorMessage='No matches found';
						}
					}).error(function(data,status,headers,config){
						$scope.status= data.msg;
					});
					
				
				
			}
			else{
				$scope.errorMessage='No collection chosen';
				
			}
		}
		else{
			$scope.errorMessage='No search word submitted';
		}
	};
	
	$scope.selectTwitter=function(){
		$scope.twitter=true;
		$scope.amazon=false;
	}
	$scope.selectAmazon=function(){
		$scope.amazon=true;
		$scope.twitter=false;
	}

}]).

controller('resultController',['$scope','$http',function($scope,$http){
	$scope.showing = true;
	$scope.seeButton = "";
	$scope.resultText = "";
	var idNo;
	$scope.post = "";
	$scope.comments=[];
	$scope.newcomment='';
	
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
		
			$scope.seeButton = "See Tweets about Sandy";
			var date= doc.createdAt.split(' ');
			$scope.resultText = "User name: " + doc.fromUser + ", User id: " +
				doc.fromUserId + ", Tweet Created At: " + date[1] + " " + date[2] + " " + date[3];
			$scope.post = doc.tweet;
			idNo=doc.fromUserId;
		
		}
		
		$scope.comments=doc.comments;
	}
	
	$scope.makeComment=function(){
		
		$scope.comments=$scope.comments.push($scope.newcomment);
		
		$http({ url:'/post', method: "POST", 
			data:{id:idNo, comment:$scope.newcomment }).
			success(function(data,status,headers,config){
				$scope.insertMessage='successfully create comment';
				
			}).error(function(data,status,headers,config){
				$scope.status= data.msg;
			});
		
	}//
	
	$scope.listclick=function(){
		$scope.showing = !$scope.showing;
	}
	
}]);
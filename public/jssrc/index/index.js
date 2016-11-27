var app = angular.module('myApp', []);
	app.controller('customersCtrl',["$scope", "$http", function($scope, $http) { 
		$scope.page = 1;
		$scope.getData = function(page,length){
			var req = {
		        method: 'post',
		        url: '/getArticleList',
		        headers: {
		            'Content-Type': 'json'
		        },
		        params:{
					page:page,
					length:length
				}
		    }
		    $http(req).success(function(response){
		    	$scope.articleList = [];
		    	if(response.status == 1){
					$scope.articleList = response.articles;
					if($scope.page == 1){//初始化打开第一页，保证滚动条在顶端
						window.scrollTo(0,0);
						//$('body').animate( {scrollTop: 0}, 500);
					}
		    	}
		    }).error(function(){
		        alert("出错了");
		    });
		}

		$scope.getData(1,5);
	    $(window).scroll(function () {
			var winHeight = $(window).height();//窗口高度
			var scrollTop = $(window).scrollTop();//滚动高度
			var mainPage = document.body.scrollHeight;//页面内容高度
			if( (winHeight + scrollTop) > mainPage-50 ){//(winHeight + scrollTop) == mainPage
				$scope.getData(++$scope.page,2);
			}
		});
	}]);
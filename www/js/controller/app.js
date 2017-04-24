myapp.controller('AppController', ['$scope', '$interval', 'googleLogin', 'googleCalendar', 'googlePlus', function($scope, $interval, googleLogin, googleCalendar, googlePlus) {

    this.currentTab = 0;

    this.isLogin = function() {
        var user = firebase.auth().currentUser;
        if(user) {
            // console.log("AppController isLogin true.");
            return true;
        } else {
            // console.log("AppController isLogin false.");
            return false;
        }
    };

    this.load = function(page) {
        console.log("AppController loading " + page);
        $scope.splitter.content.load(page);
        $scope.splitter.left.close();
    };

    this.toggle = function() {
      $scope.splitter.left.toggle();
    };
    
    this.changetab = function(tabId) {
      $scope.tabbar.setActiveTab(tabId);
      $scope.splitter.left.toggle();
    };
    
    this.navi = function(page) {
      $scope.tabNavigator.pushPage(page);
      $scope.splitter.left.toggle();
    };
    
    this.tabchange = function($event) {
        console.log("AppController tabchange is called tabid = " + $event.index);
        this.currentTab = $event.index;
        // var user = null;
        // var userStr = localStorage.getItem('user');
        // if(userStr != null) {
        //     user = eval('(' + userStr + ')');
        //     console.log(user);
        //     $scope.user = user;
        //     this.test = 'test2';
        // }
        // if(user == null){
        //     $scope.splitter.content.load('view/login.html');
        // }
        // if($event.index == 1) {
        //     googleCalendar.listCalendars().then(function(response) {
        //         console.log(response);
        //     });
        // }
    };
    
    // this.currentUser = googleLogin.currentUser;

    this.logout = function() {
      // localStorage.setItem('user', null);
      // $scope.splitter.content.load("tabbar.html");
      $scope.splitter.left.close();
      firebase.auth().signOut();
    };
    
    ons.ready(function() {
        // console.log("googleLogin = " + googleLogin);
/**        
        firebase.auth().onAuthStateChanged(function(user) {
            console.log("firebase.auth().onAuthStateChanged!");
          if (user) {
            console.log("login uid = " + user.uid);
            // ホーム画面に遷移
            // $scope.isLogin = true;
            // $scope.splitter.content.load('view/home.html');
          } else {
            console.log("not logged in.");
            // ログイン画面に遷移
            // $scope.isLogin = false;
            // $scope.splitter.content.load('view/login.html');
          } 
        });
**/        
        console.log("AppController is ready!");
    });
    
}]);


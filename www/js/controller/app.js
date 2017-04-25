myapp.controller('AppController', ['$scope', '$interval', function($scope, $interval) {

    this.currentTab = 0;

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
    };
    
    // this.currentUser = googleLogin.currentUser;

    this.logout = function() {
      // localStorage.setItem('user', null);
      // $scope.splitter.content.load("tabbar.html");
      $scope.splitter.left.close();
      firebase.auth().signOut();
    };
    
    ons.ready(function() {
        console.log("AppController is ready!");
    });
    
}]);


myapp.controller('LoginController', ['$scope', 'googleLogin', 'googleCalendar', 'googlePlus', function($scope, googleLogin, googleCalendar, googlePlus) {

    this.newMail;
    this.newPassword;
    this.mail;
    this.password;
    this.isLoggedIn;

//     this.login = function () {
//         console.log("AppController login start.");
//         googleLogin.login();
//     };
// 
//     $scope.$on("googlePlus:loaded", function() {
//        var user = googlePlus.getCurrentUser();
//       console.log("googlePlus:loaded.");
//       googlePlus.getCurrentUser().then(function(user) {
//         console.log(user);
//         this.currentUser = user;
//         localStorage.setItem('user', JSON.stringify(user));
//         $scope.splitter.content.load("tabbar.html");
//       });
//     })
//     
//     this.currentUser = googleLogin.currentUser;

    // 新規ユーザ登録
    this.regi = function() {
      // 新規ユーザーの登録機能
      firebase.auth().createUserWithEmailAndPassword(this.newMail, this.newPassword).catch(function(error) {
        alert(error.message);
      });
    }
 
    // ログイン
    this.login = function(anonymouse) {
      // 新規ユーザーの登録機能
      if(anonymouse) {
        firebase.auth().signInAnonymously().catch(function(error) {
            alert(error.message);
        });
      } else {
          firebase.auth().signInWithEmailAndPassword(this.mail + "@ef-4.co.jp", this.password).catch(function(error) {
            alert(error.message);
          });
      }
    }

    // ログアウト
    this.logout = function() {
      firebase.auth().signOut();
    }

    ons.ready(function() {
        console.log("LoginController is ready!");
    });
    
}]);


myapp.controller('HomeController', ['$scope', '$interval', 'iBeaconService', function ($scope, $interval, iBeaconService) {

    $scope.label = '未検出';
    $scope.rssi = '';

    // 1000*60ミリ秒単位に処理を実行
    var t = $interval(function() {
        $scope.now = '現在時刻：' + (new Date()).toLocaleTimeString();
        console.log($scope.now);
        $scope.user = firebase.auth().currentUser;
        // console.log($scope.user);
            
    }, 1000 * 60);
    
    $scope.setCanvasSize = function() {
        let width = window.innerWidth;
        let canvas = document.getElementById('graph');
        canvas.width = width * 90 / 100;
	    canvas.height = 20;
        
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgb(0,0,0)';
        //ctx.strokeRect(0, 0, width, height);
    };
    
    $scope.updateGraph = function() {
        console.log("updateGraph is called!");
        // キャンバスを取り出す
        let canvas = document.getElementById('graph');
        let height = canvas.height;
        let width = canvas.width;
        console.log("height = " + height + " width = " + width);
        // 2Dのコンテキストを取り出す
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgb(255,0,255)';
        ctx.fillRect(0, 0, width, height);
    };
    
    $scope.beacons = iBeaconService.beacons;
    
    var callback = function(deviceData, uuid)
    {
        var beacon = $scope.beacons[uuid];
        $scope.$apply(function()
        {
            beacon.rssi = deviceData.rssi;
            switch (deviceData.proximity)
            {
                case PROX_IMMEDIATE:
                    beacon.proximity = 'Immediate';
                    break;
                case PROX_NEAR:
                    beacon.proximity = 'Near';
                    break;
                case PROX_FAR:
                    beacon.proximity = 'Far';
                    break;
                case PROX_UNKNOWN:
                default:
                    break;
            }
            
            $scope.uuid = beacon.rssi;

            // if (iBeaconService.currentBeaconUuid === null && beacon.rssi > -45) {
            if (beacon.rssi > -45) {
                iBeaconService.currentBeaconUuid = uuid;
                // $scope.enterInfoPage(uuid);
                console.log("iBeaconService enter uuid = " + uuid);
            }
        });
    };
    
    // $scope.enterInfoPage = function(currentUuid) {
    //     iBeaconService.currentBeaconUuid = currentUuid;
    //     $scope.ons.navigator.pushPage('info-page.html');
    //     $scope.ons.navigator.on("prepop", function() {
    //         iBeaconService.currentBeaconUuid = null;
    //     });
    // };
    
    ons.ready(function() {
        // $scope.splitter.left.toggle();
        // console.log("googleLogin = " + googleLogin);
        $scope.setCanvasSize();
        $scope.updateGraph();
        iBeaconService.watchBeacons(callback);
        console.log("HomeController is ready!");
    });
    
    
}]);

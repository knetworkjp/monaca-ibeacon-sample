myapp.controller('HomeController', ['$scope', '$interval', 'iBeaconService', function ($scope, $interval, iBeaconService) {

    $scope.name = '';
    $scope.status = '未検出';
    $scope.rssi = '';
    $scope.proximity = '';
    $scope.beacons = iBeaconService.beacons;
    
    $scope.exitRoom = function(uuid) {
        
        var beacon = $scope.beacons[uuid];
        var sysdate = new Date();
        var unixTime = Math.floor( sysdate.getTime() / 1000 ) ;
        
        // ローカルストレージから読み込み
        var data = JSON.parse(localStorage.getItem("EVENT_HISTORY"));
        if(data == null) {
            data = [];
        }
        // ローカルストレージに保存
        var item = {name: beacon.name, type: 'EXIT', time: unixTime, timestr: sysdate.toLocaleTimeString()};
        data.push(item);
        localStorage.setItem('EVENT_HISTORY', JSON.stringify(data));
        iBeaconService.historyUpdated = true;
        
        $scope.status = '';
        $scope.rssi = 0;
        $scope.proximity = '';
        iBeaconService.currentBeaconUuid = null;
        iBeaconService.currentBeaconEntered = 0;
        
        $scope.updateGraph();
    }

    // 1000*60ミリ秒単位に処理を実行
    var t = $interval(function() {
        
        var sysdate = new Date();
        var unixTime = Math.floor( sysdate.getTime() / 1000 ) ;
        
        $scope.now = '現在時刻：' + sysdate.toLocaleTimeString();
        console.log($scope.now);

        var lastUpdate = iBeaconService.lastUpdated;
        if(iBeaconService.currentBeaconUuid != null && unixTime - lastUpdate > 120) {
            var uuid = iBeaconService.currentBeaconUuid;
            $scope.exitRoom(uuid);
        }
        
        $scope.updateGraph();
        
    }, 1000 * 60);
    
    $scope.setCanvasSize = function() {
        var width = window.innerWidth;
        var canvas = document.getElementById('graph');
        canvas.width = width * 90 / 100;
	    canvas.height = 20;
        
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgb(0,0,0)';
        //ctx.strokeRect(0, 0, width, height);
    };
    
    $scope.updateGraph = function() {
        
        console.log("updateGraph is called!");
        
        var baseDate = new Date();
        var sysTime = Math.floor( baseDate.getTime() / 1000 );
        baseDate.setHours(0, 0, 0, 0);
        var baseTime = Math.floor( baseDate.getTime() / 1000 ) ;
        
        // キャンバスを取り出す
        var canvas = document.getElementById('graph');
        var height = canvas.height;
        var width = canvas.width;
        // 2Dのコンテキストを取り出す
        var ctx = canvas.getContext('2d');
        console.log("height = " + height + " width = " + width);
        
        // ローカルストレージから読み込み
        var data = JSON.parse(localStorage.getItem("EVENT_HISTORY"));
        if(data == null) {
            data = [];
        }

        var enterTime = 0;
        var roomName = '';
        var style = null;
        
        console.log("data.length = " + data.length);

        for(var i=0;i<data.length;i++) {
            var item = data[i];
            console.log(item.name + ":" + item.type+":" + item.time);
            if(item.type == 'ENTER') {
                // ENTERが連続できた場合
                if(enterTime > 0) {
                    if(roomName == item.name) {
                        // 同じ部屋の場合、スキップする
                        continue;
                    } else {
                        // ちがう部屋の場合、退室として描画する
                        var stayTime = item.time - enterTime;
                        var startX = (enterTime - baseTime) * width / (60*60*24);
                        var widthX = stayTime * width / (60*60*24);
                        console.log("startX=" + (enterTime - baseTime) + ",widthX=" + widthX);
                        if(item.name == 'Room1') {
                            style = 'rgb(255,0,0)';
                        } else {
                            style = 'rgb(0,255,0)';
                        }
                        ctx.fillStyle = style;
                        ctx.fillRect(startX, 0, widthX, height);
                    }
                }
                enterTime = item.time;
            } else {
                // 退室の場合、描画する
                var stayTime = item.time - enterTime;
                var startX = (enterTime - baseTime) * width / (60*60*24);
                var widthX = stayTime * width / (60*60*24);
                console.log("startX=" + (enterTime - baseTime) + ",widthX=" + widthX);
                if(item.name == 'Room1') {
                    style = 'rgb(255,0,0)';
                } else {
                    style = 'rgb(0,255,0)';
                }
                enterTime = 0;
                ctx.fillStyle = style;
                ctx.fillRect(startX, 0, widthX, height);
            }
            roomName = item.name;
        }

        if(enterTime > 0) {
            var stayTime = sysTime - enterTime;
            var startX = (enterTime - baseTime) * width / (60*60*24);
            var widthX = stayTime * width / (60*60*24);
            if(roomName == 'Room1') {
                style = 'rgb(255,0,0)';
            } else {
                style = 'rgb(0,255,0)';
            }
            ctx.fillStyle = style;
            ctx.fillRect(startX, 0, widthX, height);
        } 
        
    };
    
    var callback = function(deviceData, uuid)
    {
        var beacon = $scope.beacons[uuid];
        $scope.$apply(function()
        {
            beacon.rssi = deviceData.rssi;
            switch (deviceData.proximity)
            {
                case PROX_IMMEDIATE:
                    beacon.proximity = '接近';
                    break;
                case PROX_NEAR:
                    beacon.proximity = '近';
                    break;
                case PROX_FAR:
                    beacon.proximity = '遠';
                    break;
                case PROX_UNKNOWN:
                default:
                    break;
            }
            
            if(iBeaconService.forceReset) {
                $scope.status = '';
                $scope.rssi = '';
                $scope.proximity = '';
                iBeaconService.currentBeaconUuid = null;
                iBeaconService.currentBeaconEntered = 0;
                iBeaconService.forceReset = false;
                iBeaconService.historyUpdated = true;
            }
            
            // 現在のUNIX時間(秒)を取得する
            var date = new Date();
            var unixTime = Math.floor( date.getTime() / 1000 ) ;
            
            if($scope.rssi == '' || ($scope.rssi != '' && $scope.rssi < beacon.rssi)) {
                if(beacon.rssi > -80) {
                    if($scope.status != '入室中') {
                        // 入室処理
                        $scope.status = '入室中';
                        iBeaconService.currentBeaconUuid = uuid;
                        iBeaconService.currentBeaconEntered = unixTime;
                        
                        // ローカルストレージから読み込み
                        var data = JSON.parse(localStorage.getItem("EVENT_HISTORY"));
                        if(data == null) {
                            data = [];
                        }
                        // ローカルストレージに保存
                        var item = {name: beacon.name, type: 'ENTER', time: unixTime, timestr: date.toLocaleTimeString()};
                        data.push(item);
                        localStorage.setItem('EVENT_HISTORY', JSON.stringify(data));
                        iBeaconService.historyUpdated = true;
                    }
                    if(iBeaconService.currentBeaconUuid == uuid) {
                        iBeaconService.lastUpdated = unixTime;
                        $scope.name = beacon.name;
                        $scope.rssi = beacon.rssi;
                        $scope.proximity = beacon.proximity;
                        $scope.updateGraph();
                    }
                }
            } else if($scope.status == '入室中' && $scope.name == beacon.name && beacon.rssi < -80) {
                
                var lastUpdated = iBeaconService.lastUpdated;
                // 30秒以上前に入室更新があった場合
                if(unixTime - lastUpdated > 30) {
                    // 退室処理
                    $scope.status = '';
                    $scope.rssi = '';
                    $scope.proximity = '';
                    iBeaconService.currentBeaconUuid = null;
                    iBeaconService.currentBeaconEntered = 0;
                    
                    $scope.exitRoom(uuid);
                }
                
            } else if($scope.name == beacon.name){
                $scope.rssi = beacon.rssi;
                $scope.proximity = beacon.proximity;
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
        // var data = [
        // {name: 'Room1', type: 'ENTER', time:99999, timestr:'2017/04/25 01:00:00'},
        // {name: 'Room1', type: 'EXIT', time:99999, timestr:'2017/04/25 02:00:00'},
        // {name: 'Room2', type: 'ENTER', time:99999, timestr:'2017/04/25 03:00:00'},
        // ];
        
        // ローカルストレージから読み込み
        var data = JSON.parse(localStorage.getItem("EVENT_HISTORY"));
        if(data == null) {
            data = [];
        }
        if(data != null && data.length > 0) {
            var item = data[data.length-1];
            // 入室で終了してしまっている場合は、ステータスを補完する
            if(item.type == 'ENTER') {
                $scope.name = item.name;
                $scope.status = '入室';
                $scope.rssi = '';
            }
        }        
        $scope.beacons = iBeaconService.beacons;
        
        $scope.setCanvasSize();
        $scope.updateGraph();
        iBeaconService.watchBeacons(callback);
        console.log("HomeController is ready!");
    });
    
    
}]);

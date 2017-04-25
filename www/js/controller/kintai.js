myapp.controller('KintaiController', ['$scope', '$interval', 'iBeaconService', function ($scope, $interval, iBeaconService) {
    
    // currentTabにTABインデックスが入ります。
    this.showPage = function(currentTab) {
        
        console.log("KintaiController showPage is called! tab = " + currentTab);
        
        if(iBeaconService.historyUpdated) {
            console.log("KintaiController update list.");
            $scope.reloadList();
        }
        
        // 必ずtrueを返却する(ng-showの戻り値)
        return true;
    }

    /**
     *  
     */
    $scope.reloadList = function() {
        console.log("KintaiController reloadList called.");
        // 更新処理
        var data = JSON.parse(localStorage.getItem("EVENT_HISTORY"));
        if(data == null) {
            data = [];
        }
        $scope.items = data;
        iBeaconService.historyUpdated = false;
    }
    
    ons.ready(function() {
        $scope.reloadList();
        console.log("KintaiController is ready!");
    });
    
    
    
}]);

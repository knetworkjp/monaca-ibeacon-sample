myapp.controller('KintaiController', ['$scope', function($scope) {
    
    this.updateTime = 0;
    
    // currentTabにTABインデックスが入ります。
    this.showPage = function(currentTab) {
        
        console.log("KintaiController showPage is called! tab = " + currentTab);
        
        // 現在のUNIX時間(秒)を取得する
        var date = new Date();
        var unixTime = Math.floor( date.getTime() / 1000 ) ;
        // 一定時間経過していれば更新する。
        if(currentTab == 2 && unixTime - this.updateTime > 180) {
            console.log("KintaiController update list.");
            $scope.reloadList();
            // 更新時刻をセット
            this.updateTime = unixTime;
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
        var objRuikei = {'totalWorkdays':'10',
                        'totalWorktime':'80:00',
                        'totalBreaktime':'12:00',
                        'totalOvertime':'3:00',
                        'totalLate':'2',
                        'totalLeaveEarly':'3'};
                        
        $scope.totalWorkdays = objRuikei.totalWorkdays;
        $scope.totalWorktime = objRuikei.totalWorktime;
        $scope.totalBreaktime = objRuikei.totalBreaktime;
        $scope.totalOvertime = objRuikei.totalOvertime;
        $scope.totalLate = objRuikei.totalLate;
        $scope.totalLeaveEarly = objRuikei.totalLeaveEarly;
    }
    
    ons.ready(function() {
        $scope.reloadList();
        console.log("KintaiController is ready!");
    });
    
    
    
}]);

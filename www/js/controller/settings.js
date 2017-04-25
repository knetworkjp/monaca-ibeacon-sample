myapp.controller('SettingsController', ['$scope', 'iBeaconService', function ($scope, iBeaconService) {
    
    this.clearData = function() {
        
        console.log("SettingsController clearData is called");
        
        iBeaconService.forceReset = true;
        
        var data = [];
        localStorage.setItem('EVENT_HISTORY', JSON.stringify(data));
        
        // キャンバスを取り出す
        var canvas = document.getElementById('graph');
        var height = canvas.height;
        var width = canvas.width;
        // 2Dのコンテキストを取り出す
        var ctx = canvas.getContext('2d');
        console.log("height = " + height + " width = " + width);
        
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0, 0, width, height);
        
        navigator.notification.alert('データをクリアしました。', null, "データクリア", "OK");
    }
    
    ons.ready(function() {
        console.log("SettingsController is ready!");
    });
    
}]);

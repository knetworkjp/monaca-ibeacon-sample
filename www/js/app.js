var PROX_UNKNOWN = 'ProximityUnknown';
var PROX_FAR = 'ProximityFar';
var PROX_NEAR = 'ProximityNear';
var PROX_IMMEDIATE = 'ProximityImmediate';

var myapp = ons.bootstrap(['onsen','googleApi']);

// myapp.config(function(googleLoginProvider) {
//         googleLoginProvider.configure({
//             clientId: '25604735847-3hrfjp74pv66pqhvc7u6nho2iok2hts7.apps.googleusercontent.com',
//             scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/plus.login"]
//         });
//     });

ons.enableAutoStatusBarFill();

// Initialize Firebase
var config = {
apiKey: "AIzaSyAAi3FXzbY4Jl2Ij1Zc7Qf4p45GZZXaGUM",
authDomain: "kintaiapp-db93d.firebaseapp.com",
databaseURL: "https://kintaiapp-db93d.firebaseio.com",
projectId: "kintaiapp-db93d",
storageBucket: "kintaiapp-db93d.appspot.com",
messagingSenderId: "118236638197"
};

console.log(config);

firebase.initializeApp(config);

myapp.service('iBeaconService', function() {
    
    this.currentBeaconUuid = null;
    this.currentBeaconEntered = null;
    this.lastUpdated = null;
    this.onDetectCallback = function(){};
    
    var beacons = {
        "00000000-22CD-1001-B000-001C4D36A219": {icon: 'img/1.jpg', rssi: -63, proximity: PROX_UNKNOWN, name: 'Room1', number: '1', id: '00000001', major: 1, minor: 1},
        "07723097-35BF-443A-AF59-13F8374702C6": {icon: 'img/2.jpg', rssi: -63, proximity: PROX_UNKNOWN, name: 'Room2', number: '2', id: '00000002', major: 1, minor: 1},
    };
    
    this.beacons = beacons;
    
    createBeacons = function() {
        var result = [];
        try {
            angular.forEach(beacons, function(value, key) {
                console.log('BeaconRegion id: ' + value.id);
                result.push(new cordova.plugins.locationManager.BeaconRegion(value.id, key, value.major, value.minor));
            });
        } catch (e) {
            console.log('createBeacon err: ' + e);
        }
        return result;
    };
    
    this.watchBeacons = function(callback){
        
        document.addEventListener("deviceready", function(){
            var beacons = createBeacons();
            
            try {    
                var delegate = new cordova.plugins.locationManager.Delegate();

                delegate.didDetermineStateForRegion = function (pluginResult) {
                
                    console.log('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
                
                    cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
                        + JSON.stringify(pluginResult));
                };
                
                delegate.didStartMonitoringForRegion = function (pluginResult) {
                    console.log('didStartMonitoringForRegion:', pluginResult);
                
                    console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
                };
                
                delegate.didRangeBeaconsInRegion = function (pluginResult) {
                    var beaconData = pluginResult.beacons[0];
                    var uuid = pluginResult.region.uuid.toUpperCase();
                    if (!beaconData || !uuid) {
                        return;
                    }
                    
                    callback(beaconData, uuid);
                    console.log('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
                };
                
                cordova.plugins.locationManager.setDelegate(delegate);
                
                // required in iOS 8+
                cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
                // or cordova.plugins.locationManager.requestAlwaysAuthorization()
                
                beacons.forEach(function(beacon) {
                    cordova.plugins.locationManager.startRangingBeaconsInRegion(beacon);
                });
                
            } catch (e) {
                console.log('Delegate err: ' + e);   
            }
        }, false);
    };
});
console.log("app.js loaded!");

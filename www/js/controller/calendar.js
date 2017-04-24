myapp.controller('CalendarController', ['$scope', 'googleLogin', 'googleCalendar', 'googlePlus', function($scope, googleLogin, googleCalendar, googlePlus) {
    
    this.reload = function() {
        console.log("CalendarController reload.");
        googleCalendar.listCalendars().then(function(res1) {
            // for(i=0;i<res1.length;i++) {
            //     var id = res1[i].id;
            //     console.log("id = " + id);
            //     googleCalendar.listEvents({calendarId: id}).then(function(res2) {
            //         for(i=0;i<res2.length;i++) {
            //             console.log(res2[i]);
            //         }
            //     });
            // }
            googleCalendar.listEvents({calendarId: res1[0].id}).then(function(res2) {
                // for(i=0;i<res2.length;i++) {
                //     console.log(res2[i]);
                // }
                console.log(res2);
                this.items = res2;
                $scope.items = res2;
            });
        });
    }
    
    this.load = function($done) {
        googleCalendar.listCalendars().then(function(res1) {
            googleCalendar.listEvents({calendarId: res1[0].id}).then(function(res2) {
                console.log(res2);
                this.items = res2;
                $scope.items = res2;
                $done();
            });
        });
    };
    
    ons.ready(function() {
        console.log("CalendarController is ready!");
    });
    
}]);

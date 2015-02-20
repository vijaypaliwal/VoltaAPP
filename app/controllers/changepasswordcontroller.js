
'use strict';

var CpasswordURL = "http://54.154.64.51:8080/voltaware/v1.0/password/tokens/"

app.controller('changepasswordcontroller', ['$scope','$location', 'authService', '$http', 'log', function ($scope,$location, authService, $http, log) {
    $scope.message = 'Home';
    $scope.cp = {
        oldpassword: "",
        newpassword: ""
    };
    $scope.tokenvalue = "";

    $scope.authentication = authService.authentication;


    $scope.getUrlParameter = function (sParam) {
        var sPageURL = window.location.href;
        var sURLVariables = sPageURL.split('?');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('?');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }

        $scope.tokenvalue = sURLVariables[1];

     
    }

    $scope.changepassword = function () {

     
    
        $.ajax({
            url: CpasswordURL + $scope.tokenvalue,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify($scope.cp.newpassword),
            dataType: "json",
            success: function (response, status)
            {
                authService.logOut();
                $location.path('/login');
                log.success("Please try to login with your new password")
            },
            error: function (xhr) {

                if (xhr.status == 200 && xhr.status < 300) {
                    authService.logOut();

                    window.location.href = "http://54.154.64.51:8080/angular/#/login";
               
                    log.success("Please try to login with your new password")
                    $location.path('/login');

                }

                else
                {
                    log.error(xhr.responseText)
                }
               
            
            }
        })

      

     
    };

    $scope.getUrlParameter();
 

}]);


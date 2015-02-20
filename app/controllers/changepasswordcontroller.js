
'use strict';

var CpasswordURL = "http://54.154.64.51:8080/voltaware/v1.0/password/tokens/"

app.controller('changepasswordcontroller', ['$scope', '$location', 'authService', 'localStorageService', '$http', 'log', function ($scope, $location, authService,localStorageService, $http, log) {
    $scope.message = 'Home';

    var authData = localStorageService.get('authorizationData');

    $scope.AuthToken = authData.token;

    $scope.cp = {
        oldpassword: "",
        newpassword: ""
    };
    $scope.tokenvalue = "";

    $scope.authentication = authService.authentication;


    alert($scope.AuthToken);

    $scope.changepassword = function () {

        alert("Change Password In");
    
        $.ajax({
            url: CpasswordURL + $scope.AuthToken,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify($scope.cp.newpassword),
            dataType: "json",
            success: function (response, status)
            {
                alert("Success");

                debugger;

              //  authService.logOut();
             //   $location.path('/login');
               // log.success("Please try to login with your new password")
            },
            error: function (xhr) {

                alert("error");

                debugger;

                if (xhr.status == 200 && xhr.status < 300) {
                    authService.logOut();

                 //   window.location.href = "http://54.154.64.51:8080/angular/#/login";
               
                //    log.success("Please try to login with your new password")
                  //  $location.path('/login');

                }

                else
                {
                    log.error(xhr.responseText)
                }
               
            
            }
        })

      

     
    };

  
 

}]);


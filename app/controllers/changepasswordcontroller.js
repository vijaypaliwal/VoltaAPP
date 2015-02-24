
'use strict';

var ChangepasswordURL = "http://54.154.64.51:8080/voltaware/v1.0/users/"



app.controller('changepasswordcontroller', ['$scope', '$location', 'authService', 'localStorageService', '$http', 'log', function ($scope, $location, authService,localStorageService, $http, log) {
    $scope.message = 'Home';

    var authData = localStorageService.get('authorizationData');

    $scope.AuthToken = authData.token;
    $scope.uid = authData.uid;

    $scope.cp = {
        oldpassword: "",
        newpassword: "",
        confirmpassword: ""
    };
    $scope.tokenvalue = "";

    $scope.authentication = authService.authentication;


  

    $scope.changepassword = function () {
    
        $.ajax({
            url: ChangepasswordURL + $scope.uid + "/password",// + $scope.cp.newpassword,
            type: "PUT",
            contentType: "application/json",

            headers: {
                'Authorization': 'Bearer ' + $scope.AuthToken
            },

            data:JSON.stringify({ "password": $scope.cp.newpassword, "oldPassword": $scope.cp.oldpassword }),
             dataType: "json",
            success: function (response, status)
            {
             
                log.success("Password changed successfully");
                $scope.cp.newpassword = "";
                $scope.cp.oldpassword = "";
                $scope.cp.confirmpassword = "";
                $scope.$apply();
            },
            error: function (xhr) {

              

           

                if (xhr.status == 200 && xhr.status < 300) {
                    log.success("Password changed successfully");
                    $scope.cp.newpassword="";
                    $scope.cp.oldpassword = "";
                    $scope.cp.confirmpassword = "";
                    $scope.$apply();
                }

                else
                {
                    log.error(xhr.responseText)
                }
               
            
            }
        })

      

     
    };

    $('#changepasswordbutton').prop('disabled', true);

    $scope.matchpassword = function () {


        if ($scope.cp.newpassword == $scope.cp.confirmpassword && $scope.cp.confirmpassword != null && $scope.cp.confirmpassword != "")
        {
            $('#changepasswordbutton').prop('disabled', false);
        }

        else {

            $('#changepasswordbutton').prop('disabled', true);

        }

    }

    setInterval(function () { $scope.matchpassword(); }, 1000);


    

  
 

}]);


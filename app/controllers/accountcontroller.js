'use strict';
app.controller('accountcontroller', ['$scope', 'log', 'localStorageService', function ($scope, log, localStorageService) {

    var authData = localStorageService.get('authorizationData');
    var userLang = navigator.language || navigator.userLanguage;


    $scope.email = authData.userName;
    $scope.uid = authData.uid;
    $scope.AuthToken = authData.token;


    $scope.account = {
        accountnumber: "",
        title: "",
        firstname: "",
        lastname: "",
        housename: "",
        address1: "",
        address2: "",
        town: "",
        region: "",
        post: "",
        country: "",
        email: $scope.email
     
    };



   $scope.savealert = function () {

   $.ajax({
            url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/alert',
            type: "POST",
            accept: "application/json",
            data: JSON.stringify({ "hourAlert": $scope.alert.highusagehr, "dayAlert": $scope.alert.highusageday, "emailAlert" : $scope.alert.emailAlert }),
            headers: {
                'Authorization': 'Bearer ' + $scope.AuthToken
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status) {


                debugger;

                log.info("Alert Added Successfully");
                debugger;

            },
            error: function (err) {


                log.error("Error::" + err.statusText);

                debugger;


            }
        })

   }


    




   


        


}]);


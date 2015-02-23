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


    $.ajax({
        url: 'http://54.154.64.51:8080/voltaware/v1.0/me',
        type: "GET",
        accept: "application/json",
    
        headers: {
            'Authorization': 'Bearer ' + $scope.AuthToken
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response, status) {

            debugger;
            $scope.account.firstname = response.firstName
            $scope.account.lastname = response.lastName
            $scope.$apply();

        },
        error: function (err) {


            log.error("Error::" + err.statusText);

            debugger;


        }
    })



   $scope.updateprofile = function () {

   $.ajax({
            url: 'http://54.154.64.51:8080/voltaware/v1.0/users/' + $scope.uid,
            type: "PUT",
            accept: "application/json",
            data: JSON.stringify({ "firstName": $scope.account.firstname, "lastName": $scope.account.lastname, "emailAddress": $scope.account.email, "title": "MR" }),
            headers: {
                'Authorization': 'Bearer ' + $scope.AuthToken
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status) {


                debugger;

                log.info("Profile Updated successfully");
                debugger;

            },
            error: function (err) {


                log.error("Error::" + err.statusText);

                debugger;


            }
        })

   }

}]);


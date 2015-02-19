'use strict';
app.controller('alertcontroller', ['$scope', 'log', 'localStorageService', function ($scope, log, localStorageService) {

    var authData = localStorageService.get('authorizationData');
    var userLang = navigator.language || navigator.userLanguage;


    $scope.email = authData.userName;
    $scope.uid = authData.uid;
    $scope.AuthToken = authData.token;


    $scope.alert = {
        highusagehr: false,
        highusageday: false,
        largeconsumes: false,
        computers: false,
        light: false,
        emailAlert: $scope.email
     
    };


    if (userLang == "es" || "ru" || "ru-ru") {

        $("#CurrentDate").html("<b>" + moment(new Date()).format("DD MMM YYYY,h:mm:ss a") + "</b>");

    }

    else {
        $("#CurrentDate").html("<b>" + moment(new Date()).format("MMM DD YYYY,h:mm:ss a") + "</b>");
    }

     

        $.ajax({
            url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/alert',
            type: "GET",
            accept: "application/json",
            headers: {
                'Authorization': 'Bearer ' + $scope.AuthToken
            },
        
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status) {

                debugger;

                var data = response.length == 0 ? null : response[response.length - 1];

                if (data != null) {
                    $scope.alert.highusagehr = data.hourAlert;
                    $scope.alert.highusageday = data.dayAlert;
                    $scope.alert.emailAlert = data.emailAlert;

                    $scope.$apply();
                }

        

                log.info("Alert Fetched Successfully");
                

            },
            error: function (err) {

          

               


            }
        })
  


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


    




        //setTimeout(function () {


          


        //  //  $("input[type='checkbox']").bootstrapSwitch();

        //    $('#hr').attr('checked', $scope.alert.highusagehr); // Checks it
        //    $('#day').attr('checked', $scope.alert.highusageday);
        //}, 1500);



        


}]);


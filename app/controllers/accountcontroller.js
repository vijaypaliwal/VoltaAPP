'use strict';
app.controller('accountcontroller', ['$scope', 'log', 'localStorageService', function ($scope, log, localStorageService) {

    var authData = localStorageService.get('authorizationData');
    var userLang = navigator.language || navigator.userLanguage;


    $scope.email = authData.userName;
    $scope.uid = authData.uid;
    $scope.AuthToken = authData.token;


    $scope.Isaddressrecord = true;


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
        email: $scope.email,
        numberofadults: "",
        numberofchildren: "",
        numberofrooms: "",
        propertytypeid: 0,
        propertytypename:"",
     
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



    $.ajax({
        type: "GET",
        dataType: "json",
        url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property',
        contentType: "application/json; charset=utf-8",
        headers: {
            'Authorization': 'Bearer ' + $scope.AuthToken
        },
        success: function (json) {


          

            debugger;

       

            var data = "";


            for (var i = json.length - 1; i >= 0; i--)
            {
              
                if (json[i].address != null)
                {
                    data = json[i];
                    break;
                }
            }


            if (i != 0)
            {
                if (data != null) {
                    $scope.account.numberofadults = data.numberAdults;
                    $scope.account.numberofchildren = data.numberChildren;
                    $scope.account.numberofrooms = data.numberBedrooms;
                    $scope.$apply();
                }


                if (data.propertyType != null) {
                    $scope.account.propertytypeid = data.propertyType.id;
                    $scope.account.propertytypename = data.propertyType.name;
                    $scope.$apply();

                }


                if (data.address != null) {

                    $scope.account.housename = data.address.houseNumber;
                    $scope.account.address1 = data.address.addressLine1;
                    $scope.account.address2 = data.address.addressLine2;
                    $scope.account.town = data.address.city;
                    $scope.account.region = data.address.region;
                    $scope.account.country = data.address.country;
                    $scope.account.post = data.address.postcode;
                    $scope.$apply();
                }


                if (data.address == null)
                {
                    $scope.Isaddressrecord = false;
                    $scope.$apply();
                }

            }
            else {
                log.error("No Data found for this profile");
            }

        },
        error: function (xhr, status) {


         

            debugger;
            log.error(xhr)


        }
    });



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
            error: function (xhr) {


                if (xhr.status == 200 && xhr.status < 300) {
                    log.success("Profile Updated successfully");
                }

                else {
                    log.error(xhr.responseText)
                }


            }
   })

 


   if ($scope.Isaddressrecord == false) {

   $.ajax({
       url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property',
       type: "POST",
       accept: "application/json",
       data: JSON.stringify({"numberBedrooms": $scope.account.numberofrooms, "numberAdults": $scope.account.numberofadults, "numberChildren": $scope.account.numberofchildren, "propertyType": { "id": $scope.account.propertytypeid, "name": $scope.account.propertytypename }, "address": { "houseNumber": $scope.account.housename, "addressLine1": $scope.account.address1, "addressLine2": $scope.account.address2, "postcode": $scope.account.post, "region": $scope.account.region, "city": $scope.account.town, "country": $scope.account.country }, "sensor": { "serialNumber": "ABBB12509" }}),
       headers: {
           'Authorization': 'Bearer ' + $scope.AuthToken
       },
       dataType: "json",
       contentType: "application/json; charset=utf-8",
       success: function (response, status) {


       
           debugger;

           log.success("Profile Updated Successfully");
           debugger;

       },
       error: function (err) {

      
           debugger;


           log.error("Error::" + err.statusText);


       }
   })

   }

   }

}]);


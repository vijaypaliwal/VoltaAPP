﻿'use strict';
app.controller('householdlcontroller', ['$scope', 'log', 'localStorageService', function ($scope, log, localStorageService) {

    $scope.householddetail = "Household Profile & Tariff Setup";

    var authData = localStorageService.get('authorizationData');


    $scope.uid = authData.uid;
    $scope.token = authData.token;

    $scope.iseditmode = false;

    $scope.propertyID = "";

    $scope.household = {
        propertytype: "",
        numberofadults: "",
        numberofchildrens: "",
        numberofbedrooms: "",
        electricityprovider: "",
        tarrif: ""

    };

    $scope.numberofadults = [{ Id: 0, Value: "0" }, { Id: 1, Value: "1" }, { Id: 2, Value: "2" }, { Id: 3, Value: "3" }, { Id: 4, Value: "4" }, { Id: 5, Value: "5" }, { Id: 6, Value: "6" }, { Id: 7, Value: "7" }, { Id: 8, Value: "8" }, { Id: 9, Value: "9" }, { Id: 10, Value: "10" }];
    $scope.numberofchildrens = [{ Id: 0, Value: "0" }, { Id: 1, Value: "1" }, { Id: 2, Value: "2" }, { Id: 3, Value: "3" }, { Id: 4, Value: "4" }, { Id: 5, Value: "5" }, { Id: 6, Value: "6" }, { Id: 7, Value: "7" }, { Id: 8, Value: "8" }, { Id: 9, Value: "9" }, { Id: 10, Value: "10" }];
    $scope.numberofbedrooms = [{ Id: 0, Value: "0" }, { Id: 1, Value: "1" }, { Id: 2, Value: "2" }, { Id: 3, Value: "3" }, { Id: 4, Value: "4" }, { Id: 5, Value: "5" }, { Id: 6, Value: "6" }, { Id: 7, Value: "7" }, { Id: 8, Value: "8" }, { Id: 9, Value: "9" }, { Id: 10, Value: "10" }];



    $.ajax({
        type: "GET",
        dataType: "json",
        url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property',
        contentType: "application/json; charset=utf-8",
        headers: {
            'Authorization': 'Bearer ' + $scope.token
        },
        success: function (json) {

            var data = json.length == 0 ? null : json[json.length - 1];

            debugger;

            if (data != null) {

                $scope.household.propertytype = data.propertyType.id;
                $scope.household.numberofadults = data.numberAdults;
                $scope.household.numberofchildrens = data.numberChildren;
                $scope.household.numberofbedrooms = data.numberBedrooms;
               // $scope.household.tarrif = data.tariff.id;
                $scope.household.electricityprovider = data.tariff.electricityProviderXML.id;

                $scope.propertyID = data.id;

                $('#Propertytypelist option[value="' + $scope.household.propertytype + '"]').prop('selected', true);
                $('#numberofadult option[value="' + $scope.household.numberofadults + '"]').prop('selected', true);
                $('#numberofchildren option[value="' + $scope.household.numberofchildrens + '"]').prop('selected', true);
                $('#numberofbedroom option[value="' + $scope.household.numberofbedrooms + '"]').prop('selected', true);
                $('#electricityproviderlist option[value="' + $scope.household.electricityprovider + '"]').prop('selected', true);
              $('#tarriflist option[value="' + $scope.household.tarrif + '"]').prop('selected', true);
                
                $scope.iseditmode = true;

            }


        
            debugger;

        },
        error: function (xhr, status) {
           
            debugger;
            log.error(xhr)


        }
    });





    $.ajax({
        type: "GET",
        dataType: "json",
        url: 'http://54.154.64.51:8080/voltaware/v1.0/property_type',
        contentType: "application/json; charset=utf-8",
        success: function (json) {

       
           $('#Propertytypelist').empty();
            var i = 0;
            for (i = 0; i < json.length; i++) {
                $('#Propertytypelist').append($('<option>').text(json[i].name).attr('value', json[i].id));
            }

        

            debugger;

          

        },
        error: function (xhr, status) {

            log.error(xhr)


        }
    });

   

    $.ajax({
        type: "GET",
        dataType: "json",
        url: 'http://54.154.64.51:8080/voltaware/v1.0/electricityprovider',
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            $('#electricityproviderlist').empty();
            var i = 0;
            for (i = 0; i < data.length; i++) {
                $('#electricityproviderlist').append($('<option>').text(data[i].name).attr('value', data[i].id));
            }

            debugger;


        },
        error: function (xhr, status) {

         
            debugger;
        }
    });



    $('#electricityproviderlist').on('change', function () {
        var electricityid = $('#electricityproviderlist option:selected').val();

        debugger;

        $.ajax({
            type: "GET",
            dataType: "json",

            url: 'http://54.154.64.51:8080/voltaware/v1.0/electricityprovider/' + electricityid,
            contentType: "application/json; charset=utf-8",
            success: function (tarrif) {



                debugger;

                $('#tarriflist').empty();
                var i = 0;
                for (i = 0; i < tarrif.listTariff.length; i++) {
                    $('#tarriflist').append($('<option>').text(tarrif.listTariff[i].name).attr('value', tarrif.listTariff[i].id));
                }
            },
            error: function (xhr, status) {

          
                debugger;

              
            }
        });

    })




   



  
    $scope.saveproperty = function () {


  

        var URL = "";
        var MethodTYPE = ""

        if ($scope.iseditmode == true) {

            URL = 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property/' + $scope.propertyID;
            MethodTYPE = "PUT";

        }

        if ($scope.iseditmode == false) {

            URL = 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property';
            MethodTYPE = "POST";

        }

     


     
        $.ajax({
            url: URL,
            type: MethodTYPE,
            accept: "application/json",
            data: JSON.stringify({ "numberBedrooms": $scope.household.numberofbedrooms, "numberAdults": $scope.household.numberofadults, "numberChildren": $scope.household.numberofchildrens, "propertyType": { "id": $("#Propertytypelist").val(), "name": $("#Propertytypelist option:selected").text() } }),
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status) {

            

                log.success("House hold profile successfully. ");
      
                $.ajax({
                    url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property/' + response.id + '/tariff/' + $("#tarriflist").val(),
                    type: "PUT",
                    accept: "application/json",
              
                    headers: {
                        'Authorization': 'Bearer ' + $scope.token
                    },
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response, status) {

                        log.info("link property to a tariff successfully. ");
                        debugger;

                    },
                    error: function (err) {

                
                        log.error("Error::" + err.statusText);


                    }
                })

              //  $('#houseHold').find("input[type=text], select").val("");

            },
            error: function (err) {

            

                log.error("Error::" + err);

                
            }
        })

    }


    setTimeout(function () {
        $('#Propertytypelist option[value="' + $scope.household.propertytype + '"]').prop('selected', true);
        $('#electricityproviderlist option[value="' + $scope.household.electricityprovider + '"]').prop('selected', true);
      //  $('#tarriflist option[value="' + $scope.household.tarrif + '"]').prop('selected', true);
    }, 1500);


   



}]);
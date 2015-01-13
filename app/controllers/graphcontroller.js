
'use strict';

app.controller('graphcontroller', ['$scope', '$http', 'authService', 'localStorageService', '$location', 'log', function ($scope, $http, authService, localStorageService, $location, log) {


    debugger;
    $scope.authentication = authService.authentication.isAuth;
    $scope.userid = authService.authentication.userId;
    $scope.sensorId = authService.authentication.sensorId;
    $scope.accesstoken = authService.authentication.accesstoken

    $scope.isauth = $scope.authentication;

    $scope.acctoken = $scope.accesstoken;


    var authData = localStorageService.get('authorizationData');
    $scope.AuthToken = authData.token;

    $scope.uid = authData.uid;
    $scope.sid = authData.sid;

    $scope.rememberme = authData.remember;





    //alert($scope.isauth);

    //alert($scope.uid);

    //alert($scope.sid);

    //alert($scope.acctoken);



    //if (isauth == false) {
    //    authService.logOut();
    //    $location.path('/home');
    //    log.info("You are not Authorize yet. Please Login or Register your Account")

    //}

    $scope.furl = 'http://54.154.64.51:8080/voltaware/v1.0/' + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/graphtoday';

    $scope.surl = 'http://54.154.64.51:8080/voltaware/v1.0/' + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/now'
    $scope.todayurl = 'http://54.154.64.51:8080/voltaware/v1.0/' + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/totaltoday'
    $scope.dailyavg = 'http://54.154.64.51:8080/voltaware/v1.0/' + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/daily_average'
    $scope.expected = 'http://54.154.64.51:8080/voltaware/v1.0/' + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/expected_today'
    $scope.last24hours = 'http://54.154.64.51:8080/voltaware/v1.0/' + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/last24hour'
    $scope.last7days = 'http://54.154.64.51:8080/voltaware/v1.0/' + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/last7days'
    $scope.lastmonth = 'http://54.154.64.51:8080/voltaware/v1.0/' + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/lastMonth'
    $scope.last6month = 'http://54.154.64.51:8080/voltaware/v1.0/' + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/last6Months'
    $scope.lastyear = 'http://54.154.64.51:8080/voltaware/v1.0/' + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/lastYears'



    $scope.message = 'Home';

    $scope.culture = "RS";

    $scope.culturedateformat = "DD-MM-YYYY";

    var userLang = navigator.language || navigator.userLanguage;

    $scope.myculture = function (culture) {

        if (culture == "ru" || culture == "ru-ru") {
            $scope.culturedateformat = "DD-MM-YYYY";

            $("#CurrentDate").html("<b>" + moment(new Date()).format("llll") + "</b>");

        }

        else {
            $scope.culturedateformat = "MM-DD-YYYY";
            $("#CurrentDate").html("<b>" + moment(new Date()).format("llll") + "</b>");
        }
        $scope.datetoshow = moment(new Date()).format($scope.culturedateformat);


    }
    $scope.myculture(userLang);






    if (userLang == "es" || "ru" || "ru-ru") {

        $("#CurrentDate").html("<b>" + moment(new Date()).format("DD MMM YYYY,h:mm:ss a") + "</b>");

    }

    else {
        $("#CurrentDate").html("<b>" + moment(new Date()).format("MMM DD YYYY,h:mm:ss a") + "</b>");
    }







    if (userLang == "ru" || userLang == "ru-ru") {

        $scope.Equalmessage = "Utilizaci&#243n d&#237a promedio y la utilizaci&#243n de d&#237as previstos son de Igualdad";

    }

    else {
        $scope.Equalmessage = 'Среднедневное потребление и ожидаемое потребление за текущий день равны';
    }



    if (userLang == "ru" || userLang == "ru-ru") {

        $scope.lessmessage = "Среднедневное потребление меньше, чем ожидаемое потребление за текущий день";

    }

    else {
        $scope.lessmessage = 'Average day Utilisation is less than Expected day utilisation';
    }



    if (userLang == "ru" || userLang == "ru-ru") {

        $scope.greatermessage = "Среднедневное потребление выше, чем ожидаемое потребление за текущий день";

    }

    else {
        $scope.greatermessage = 'Average day Utilisation is greater than Expected day utilisation';
    }



    $scope.todayvalue = "";
    $scope.expvalue = "";
    $scope.bottomgraphurl = $scope.last24hours;
    $scope.graphdateformat = "{value:%I:%M %p}";
    var todaydate = new Date()

    var partodaydate = new Date();
    $scope.todaydateformatch = moment(partodaydate).format($scope.culturedateformat);
    $scope.onedayapidate = todaydate;
    $scope.daystoIncrease = 0;
    $scope.isDateRangeSelected = false;

    $scope.islast7dayactive = false;
    $scope.islast24dayactive = true;
    $scope.ActiveButton = 1;



    $scope.datetoshow = moment(todaydate).format($scope.culturedateformat);


    $scope.onedatafterdate = $scope.onedayapidate;

    $(".loader").show();
    //get method
    $scope.getgraph = function () {


        $http.get($scope.furl, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            $(".loader").hide();
            var xData = [];
            var yData = [];
            for (var i = 0; i < data.listPower.length; i++) {
                xData.push(parseFloat(data.listPower[i].power));
                yData.push(new Date(data.listPower[i].timestamp));
            }


            
            var charts = $('#container').highcharts({
                title: {
                    text: '',
                    x: -20 //center
                },
                subtitle: {
                    x: -20
                },
                xAxis: {
                    TimeZone: yData
                },
                yAxis: {
                    title: {
                        text: 'kWh'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }],
                },
                tooltip: {
                    valueSuffix: 'kWh'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Power Time',
                    data: xData
                }]
            });



        }).error(function (xhr, error, errorStatus, responseText) {

            $(".loader").hide();

            debugger;

            log.error(xhr.consumerMessage + ' ' + '[' + error + ']');
        });
    };
    var iw = $('body').innerWidth();

   

    $scope.updateFormateforGraphforLang = function () {
        switch (userLang) {
            case "ru-ru":
            case "ru":
                Highcharts.setOptions({
                    lang: {
                        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                        weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
                    }
                }); break;
            case "sp":
                Highcharts.setOptions({
                    lang: {
                        loading: 'Aguarde...',
                        months: ['enero', 'febrero', 'marzo', 'Abril', 'mayo', 'junio', 'julio', 'Agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
                        weekdays: ['Domingo', 'segundo', 'tercera', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
                        shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'Mayo', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                        exportButtonTitle: "Exportar",
                        printButtonTitle: "Imprimir",
                        rangeSelectorFrom: "De",
                        rangeSelectorTo: "Até",
                        rangeSelectorZoom: "Periodo",
                        downloadPNG: 'Download imagem PNG',
                        downloadJPEG: 'Download imagem JPEG',
                        downloadPDF: 'Download documento PDF',
                        downloadSVG: 'Download imagem SVG'
                        // resetZoom: "Reset",
                        // resetZoomTitle: "Reset,
                        // thousandsSep: ".",
                        // decimalPoint: ','
                    }
                });
                break;
            default:   break;
        }

    }
    $scope.getsecondgraph = function () {

        $http.get($scope.surl, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            $(".loader").hide();

            $('.js-gauge--1').kumaGauge({
                value: data.power * 100,
                radius: iw/2.5,
                gaugeWidth: 40,
                showNeedle: true,
                height: 200,
                label: {
                    display: true,
                    left: 'Min',
                    right: 'Max',
                    fontFamily: 'Helvetica',
                    fontColor: '#1E4147',
                    fontSize: '11',
                    fontWeight: 'bold'
                }
            });




        }).error(function (xhr, error, errorStatus, responseText) {

            $(".loader").hide();
            debugger;

            log.error(xhr.consumerMessage + ' ' + '[' + error + ']');


        });
    };

    $scope.gettodaycounter = function () {

        $http.get($scope.todayurl, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            var todayvalue = (data.power) * 100
            document.getElementById("today").innerHTML = todayvalue.toFixed(2);



        }).error(function (xhr, error, errorStatus, responseText) {



        });
    };

    $scope.getdailyavgcounter = function () {

        $http.get($scope.dailyavg, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            var todayavgvalue = (data.power) * 100
            document.getElementById("todayavg").innerHTML = todayavgvalue.toFixed(3);

            debugger;

            $scope.todayvalue = todayavgvalue;

            $scope.$apply();

        }).error(function (xhr, error, errorStatus, responseText) {




        });
    };

    $scope.getexpectedgcounter = function () {

        $http.get($scope.expected, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            var todayexpvalue = (data.power) * 100
            document.getElementById("todayexp").innerHTML = todayexpvalue.toFixed(3);
            $scope.expvalue = todayexpvalue;
            $scope.$apply();

            $scope.wholehousemessage();


        }).error(function (xhr, error, errorStatus, responseText) {




        });
    };


    $scope.wholehousemessage = function () {

        if ($scope.todayvalue == $scope.expvalue) {
            document.getElementById("wholehousemessage").innerHTML = $scope.Equalmessage;

        }

        if ($scope.todayvalue < $scope.expvalue) {

            document.getElementById("wholehousemessage").innerHTML = $scope.lessmessage;

        }


        if ($scope.todayvalue > $scope.expvalue) {
            document.getElementById("wholehousemessage").innerHTML = $scope.greatermessage;

        }



    };

    $scope.get24hrsgraph = function () {




        if ($scope.isDateRangeSelected) {
            $scope.bottomgraphurl = $scope.bottomgraphurl + "?date=" + $scope.onedayapidate + "+" + "10:20:00";
        }

        // alert($scope.bottomgraphurl);

        $http.get($scope.bottomgraphurl, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {


            var xData = [];
            var yData = [];
            for (var i = 0; i < data.listPower.length; i++) {
                xData.push(parseFloat(data.listPower[i].power));
                yData.push(new Date(data.listPower[i].timestamp));
            }
            debugger;


            $('#container1').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {

                    categories: yData,
                    reversed: true,
                    type: 'datetime',
                    title: 'Last 24 Hours Detail',
                    labels: {
                        // format: '{value:%I:%M %p}', last 24 hours
                        //  format: '{value:%a-%m-%Y}', week
                        //  format: '{value:%a-%m-%Y}', month
                        //  format: '{value:%B \'%y}', 6 month

                        format: $scope.graphdateformat,
                        rotation: -90,
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Verdana, sans-serif',
                            width: '100px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'KWH'
                    }
                },


          

                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} Kwh</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },

           

                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Power Kwh',
                    data: xData
                }]
            });



            debugger;



        }).error(function (xhr, error, errorStatus, responseText) {



            debugger;

            log.error(xhr.consumerMessage + ' ' + '[' + error + ']');
        });
    };


    $scope.GetMyData = function (CurrentPage) {
        debugger;

        var Current = CurrentPage - 1;
        $("#allbuttons button").each(function (index) {
            $(this).removeClass();
            if (index == Current) {
                $(this).addClass("btn btn-info");
            } else {
                $(this).addClass("btn btn-success");
            }
        });
        $scope.ActiveButton = CurrentPage;
        $scope.daystoIncrease = 0;
        $scope.datetoshow = moment(todaydate).format($scope.culturedateformat);


        $("#rightarrow").hide();

        switch (CurrentPage) {
            case 1:

                $scope.get24hrs(false); break;
            case 2:
                $scope.get7days(false); break;
            case 3:
                $scope.getmonth(false); break;
            case 4:
                $scope.get6month(false); break;
            case 5:
                $scope.getyear(false); break;
        }

    }


    $scope.get7days = function (isDaterange) {

        $scope.bottomgraphurl = $scope.last7days;
        $scope.isDateRangeSelected = isDaterange;
        $scope.islast7dayactive = true;
        console.log("7 days URL::" + $scope.bottomgraphurl);
        $scope.graphdateformat = '{value:%a-%b-%d-%Y}'
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";

    };

    $scope.getmonth = function (isDaterange) {
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.lastmonth;
        console.log("1 month URL::" + $scope.bottomgraphurl);
        $scope.graphdateformat = '{value:%d-%b-%Y}'
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";
    };

    $scope.get24hrs = function (isDaterange) {
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.last24hours;
        $scope.graphdateformat = '{value:%I:%M %p}'
        $scope.get24hrsgraph();

        console.log("24 hrs URL::" + $scope.bottomgraphurl);
        $scope.bottomgraphurl = "";


    };

    $scope.get6month = function (isDaterange) {
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.last6month;
        $scope.graphdateformat = '{value:%B \'%y}'
        console.log("6 months URL::" + $scope.bottomgraphurl);
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";
    };

    $scope.getyear = function (isDaterange) {
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.lastyear;
        console.log("1 Year URL::" + $scope.bottomgraphurl);
        $scope.graphdateformat = '{value:%b \%Y}'
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";
    };

    $scope.getonedayback = function () {

        //Get selected type
        //getDay to decrease
        var onedayAgo = new Date();

        switch ($scope.ActiveButton) {
            case 1:
                $scope.daystoIncrease = $scope.daystoIncrease + 1;
                onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);
                $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;

                $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);

                if (moment(partodaydate).format($scope.culturedateformat) != moment(onedayAgo).format($scope.culturedateformat)) {
                    $("#rightarrow").show()
                }
                else {
                    $("#rightarrow").hide()

                }

                $scope.get24hrs(true);
                break;
            case 2:
                $scope.daystoIncrease = $scope.daystoIncrease + 7;
                onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);
                $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);

                if (moment(partodaydate).format($scope.culturedateformat) != moment(onedayAgo).format($scope.culturedateformat)) {
                    $("#rightarrow").show()
                }
                else {
                    $("#rightarrow").hide()

                }
                $scope.get7days(true); break;
            case 3:
                $scope.daystoIncrease = $scope.daystoIncrease + (32 - new Date(onedayAgo.getYear(), onedayAgo.getMonth(), 32).getDate());
                onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);
                $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);

                if (moment(partodaydate).format($scope.culturedateformat) != moment(onedayAgo).format($scope.culturedateformat)) {
                    $("#rightarrow").show()
                }
                else {
                    $("#rightarrow").hide()

                }
                $scope.getmonth(true); break;
            case 4:
                $scope.daystoIncrease = $scope.daystoIncrease + 180;
                onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);
                $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);

                if (moment(partodaydate).format($scope.culturedateformat) != moment(onedayAgo).format($scope.culturedateformat)) {
                    $("#rightarrow").show()
                }
                else {
                    $("#rightarrow").hide()

                }
                $scope.get6month(true); break;
            case 5:
                var ydays = 365;
                if (onedayAgo.getYear() % 4 == 0) {
                    ydays = 366;
                }
                $scope.daystoIncrease = $scope.daystoIncrease + ydays;

                onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);
                $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);

                if (moment(partodaydate).format($scope.culturedateformat) != moment(onedayAgo).format($scope.culturedateformat)) {
                    $("#rightarrow").show()
                }
                else {
                    $("#rightarrow").hide()

                }
                $scope.getyear(true); break;
        }



    }

    $scope.getonedayafter = function () {
        var onedayafter = new Date();

        switch ($scope.ActiveButton) {
            case 1:
                $scope.daystoIncrease = $scope.daystoIncrease - 1;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);
                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                //  $scope.datetoshow = $scope.onedatafterdate;
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);


                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }

                $scope.get24hrs();
                break;
            case 2:
                $scope.daystoIncrease = $scope.daystoIncrease - 7;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);
                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                //  $scope.datetoshow = $scope.onedatafterdate;

                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);


                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.get7days(); break;
            case 3:
                //$scope.daystoIncrease = $scope.daystoIncrease - 30;
                $scope.daystoIncrease = $scope.daystoIncrease - (32 - new Date(onedayafter.getYear(), onedayafter.getMonth(), 32).getDate())
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);
                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                // $scope.datetoshow = $scope.onedatafterdate;
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);


                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.getmonth(); break;
            case 4:
                $scope.daystoIncrease = $scope.daystoIncrease - 180;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);
                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                // $scope.datetoshow = $scope.onedatafterdate;

                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);


                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.get6month(); break;
            case 5:
                var ydays = 365;
                if (onedayafter.getYear() % 4 == 0) {
                    ydays = 366;
                }
                $scope.daystoIncrease = $scope.daystoIncrease - ydays;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);
                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                //$scope.datetoshow = $scope.onedatafterdate;
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);


                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.getyear(); break;
        }
    }

    $scope.getgraph();
    $scope.getsecondgraph();
    $scope.gettodaycounter();
    $scope.getexpectedgcounter();
    $scope.getdailyavgcounter();
    $scope.GetMyData(1);

    //setInterval(function () { $scope.gettodaycounter(); }, 10000);

}]);


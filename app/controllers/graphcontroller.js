
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
    $scope.isFirstTime = false;


    $scope.message = 'Home';

    $scope.culture = "RS";

    $scope.culturedateformat = "DD-MM-YYYY";


    $scope.graphname = "24hrs";

    var userLang = navigator.language || navigator.userLanguage;

    $scope.myculture = function (culture) {

        if (culture == "ru" || culture == "ru-ru") {
            $scope.culturedateformat = "DD MMM YYYY";

            $("#CurrentDate").html("<b>" + moment(new Date()).format("llll") + "</b>");

        }

        else {
            $scope.culturedateformat = "DD MMM YYYY";
            $("#CurrentDate").html("<b>" + moment(new Date()).format("llll") + "</b>");
        }
        $scope.datetoshow = moment(new Date()).format($scope.culturedateformat);


    }
    $scope.myculture(userLang);



    if (userLang == "es" || "ru" || "ru-ru") {

        $("#CurrentDate").html("<b>" + moment(new Date()).format("DD MMM YYYY,h:mm:ss a") + "</b>");

    }

    else {
        $("#CurrentDate").html("<b>" + moment(new Date()).format("DD MMM YYYY,h:mm:ss a") + "</b>");
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

    $scope.graphstep = 1;

    $scope.now = 0;
    $scope.marginleft = 0;

    $scope.tariffname = "";



    $scope.datetoshow = moment(todaydate).format($scope.culturedateformat);

    var preDate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 1);
    $scope.previousdate = moment(preDate).format($scope.culturedateformat);

   

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

    var height = $(window).height();


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
            default: break;
        }

    }
    $scope.getsecondgraph = function () {

        $http.get($scope.surl, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            $(".loader").hide();

            $('.js-gauge--1').kumaGauge({
                value: data.power * 100,
                radius: iw / 2.5,
                gaugeWidth: 40,
                showNeedle: true,
                paddingY: 0,
                paddingX: 0,

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


            var currentusage = (data.power) * 100
            document.getElementById("currentusage").innerHTML = currentusage.toFixed(2);


       


            //$(function () {

            //    var gaugeOptions = {

            //        chart: {
            //            type: 'solidgauge'
            //        },

            //        title: null,

            //        pane: {
            //           // center: ['50%', '85%'],
            //            size: '100%',
            //            startAngle: -90,
            //            endAngle: 90,
            //            background: {
            //                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            //                innerRadius: '60%',
            //                outerRadius: '100%',
            //                shape: 'arc'
            //            }
            //        },

            //        tooltip: {
            //            enabled: false
            //        },

            //        // the value axis
            //        yAxis: {
            //            stops: [
            //                [0.1, '#55BF3B'], // green
            //                [0.5, '#DDDF0D'], // yellow
            //                [0.9, '#DF5353'] // red
            //            ],
            //            lineWidth: 0,
            //            minorTickInterval: null,
            //            tickPixelInterval: 400,
            //            tickWidth: 0,
            //            title: {
            //                y: -70
            //            },
            //            labels: {
            //                y: 16
            //            }
            //        },

            //        plotOptions: {
            //            solidgauge: {
            //                dataLabels: {
            //                    y: 2,
            //                    borderWidth: 0,
            //                    useHTML: true
            //                }
            //            }
            //        }
            //    };

            //    debugger;

            //    var num = parseFloat(data.power) * 100;
            //    var n = parseFloat(num.toFixed(2));

            //    // The speed gauge
            //    $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
            //        yAxis: {
            //            min: 0,
            //            max: 100,
            //            title: {
            //                text: 'kWh'
            //            }
            //        },

            //        credits: {
            //            enabled: false
            //        },

               

            //        series: [{
            //            name: 'Speed',
            //            data: [n],
            //            dataLabels: {
            //                format: '<div style="text-align:center"><span style="font-size:20px;color:' +
            //                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
            //                       '<span style="font-size:12px;color:silver">Current Usage</span></div>'
            //            },
            //            tooltip: {
            //                valueSuffix: ''
            //            }
            //        }]

            //    }));


            //});




        }).error(function (xhr, error, errorStatus, responseText) {

            $(".loader").hide();
            debugger;

            log.error(xhr.consumerMessage + ' ' + '[' + error + ']');


        });
    };


    $.ajax({
        type: "GET",
        dataType: "json",
        url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property/' + 18,
        contentType: "application/json; charset=utf-8",
        headers: {
            'Authorization': 'Bearer ' + $scope.AuthToken
        },
        success: function (json) {



            debugger;

       
            $scope.tariffname = json.tariff.electricityProviderXML.name + ' ' + json.tariff.electricityProviderXML.nation;
       

         
        },
        error: function (xhr, status) {
            alert("Propert Get Error");
            debugger;
            log.error(xhr.responseText)


        }
    });


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


    $(window).on("orientationchange", function () {
        $scope.getsecondgraph();
        $scope.GetMyData(1);
        $scope.getsecondgraph();
    });

  


    var dt = new Date();
    var currenttime = dt.getHours();

    $scope.now = currenttime


   

    $scope.marginleft = $scope.now * 4;

  
    if ($scope.now >= 20)
    {
    $(".leftnow").show()
    $(".rightnow").hide()
    }
    else {

        $(".leftnow").hide()
        $(".rightnow").show()

    }
  
 

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


            //if ($scope.graphname == "24hrs" || $scope.graphname == "30days") {

            //    for (var i = 0; i < data.listPower.length; i++) {
            //        if ((parseInt(i )% 3) == 0) {
            //            xData.push(parseFloat(data.listPower[i].power));
            //            yData.push(new Date(data.listPower[i].timestamp));
            //        }

            //    }

            //}


            //else {



            //    for (var i = 0; i < data.listPower.length; i++) {
            //        xData.push(parseFloat(data.listPower[i].power));
            //        yData.push(new Date(data.listPower[i].timestamp));
            //    }
            //}


         


            switch ($scope.graphname) {

                
                case "24hrs":

                    $scope.graphstep = 3; break;
                case "7days":
                    $scope.graphstep = 1; break;
                case "30days":
                    $scope.graphstep = 7;

                    var predate = $scope.previousdate;
                    var pd = new Date(predate);
                    $scope.previousdate = moment(pd).format("MMM YYYY");

                    var aftdate = $scope.datetoshow;
                    var ad = new Date(aftdate);
                    $scope.datetoshow = moment(ad).format("MMM YYYY");

                  
                
                  
                    break;
                case "6month":
                    $scope.graphstep = 1;
                    var predate = $scope.previousdate;
                    var pd = new Date(predate);
                    $scope.previousdate = moment(pd).format("MMM YYYY");

                    var aftdate = $scope.datetoshow;
                    var ad = new Date(aftdate);
                    $scope.datetoshow = moment(ad).format("MMM YYYY");
                    break;
                case "1year":
                    $scope.graphstep = 2;


                    var predate = $scope.previousdate;
                    var pd = new Date(predate);
                    $scope.previousdate = moment(pd).format("MMM YYYY");

                    var aftdate = $scope.datetoshow;
                    var ad = new Date(aftdate);
                    $scope.datetoshow = moment(ad).format("MMM YYYY");

                    break;
            }

            $('#container1').highcharts({
                chart: {
                    type: 'column',
                    height: 225,
                    zoomType: 'x',
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
                    lineWidth: 0,
                    minorGridLineWidth: 0,
                    lineColor: 'transparent',
                 
                    tickPosition: 'outside',
                   tickInterval: $scope.graphstep,
                    labels: {
                        format: $scope.graphdateformat,
                      
                        style: {
                            fontSize: '6px',
                            
                        },
                     //   step: $scope.graphstep
                   
                    },
                    minorTickLength: 0,
                    tickLength: 0
                   
                },
                yAxis: {
                    min: 0,
                
                    title: {
                        text: 'kWh'
                    },
                    labels: {
                        style: {
                            fontSize: '6px',
                        },

                      
                      
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
                    name: $scope.previousdate +'-'+ $scope.datetoshow ,
                    data: xData
                }]
            });



            debugger;



        }).error(function (xhr, error, errorStatus, responseText) {



            debugger;

            log.error(xhr.consumerMessage + ' ' + '[' + error + ']');
        });
    };


    $scope.FirstTimeClick = function (CurrentPage)
    {
        $scope.isFirstTime = true;
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
        $scope.GetMyData(CurrentPage);
    }

    $scope.GetMyData = function (CurrentPage) {
       

        
        $scope.daystoIncrease = 0;
        

        $scope.datetoshow = moment(todaydate).format($scope.culturedateformat);
        $("#rightarrow").hide();

        switch (CurrentPage) {
            case 1:
                if ($scope.isFirstTime) {
                    $scope.previousdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 1);
                    $scope.previousdate = moment($scope.previousdate).format($scope.culturedateformat);
                    $scope.isFirstTime = false;
                }  
                $scope.get24hrs(false); break;
            case 2:
                if ($scope.isFirstTime) {
                    $scope.previousdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 7);
                    $scope.previousdate = moment($scope.previousdate).format($scope.culturedateformat);
                    $scope.isFirstTime = false;
                }  
                $scope.get7days(false); break;
            case 3:
                if ($scope.isFirstTime) {
                    $scope.previousdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 30);
                    $scope.previousdate = moment($scope.previousdate).format($scope.culturedateformat);
                    $scope.isFirstTime = false;
                }  
                $scope.getmonth(false); break;
            case 4:
                if ($scope.isFirstTime) {
                    $scope.previousdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 180);
                    $scope.previousdate = moment($scope.previousdate).format($scope.culturedateformat);
                    $scope.isFirstTime = false;
                }  
                  
                 
                $scope.get6month(false); break;
            case 5:
                if ($scope.isFirstTime) {
                    $scope.previousdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 365);
                    $scope.previousdate = moment($scope.previousdate).format($scope.culturedateformat);
                    $scope.isFirstTime = false;
                } 
                $scope.getyear(false); break;
        }

    }

    $scope.showpicker = function () {
        $(".datepickersection").show()
        $(".graphmenusection").hide()
    }


    $scope.showgraphmenu = function () {

        $(".graphmenusection").show()
        $(".datepickersection").hide()
    }


    $scope.get7days = function (isDaterange) {

        $scope.graphname = "7days";

        $scope.bottomgraphurl = $scope.last7days;
        $scope.isDateRangeSelected = isDaterange;
        $scope.islast7dayactive = true;
        console.log("7 days URL::" + $scope.bottomgraphurl);
        $scope.graphdateformat = '{value:%d/%m/%y}'
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";



    };

    $scope.getmonth = function (isDaterange) {
        $scope.graphname = "30days";
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.lastmonth;
        console.log("1 month URL::" + $scope.bottomgraphurl);
        $scope.graphdateformat = '{value:%d/%m/%y}'
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";

    };

    $scope.get24hrs = function (isDaterange) {

        $scope.graphname = "24hrs";
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.last24hours;
        $scope.graphdateformat = '{value:%H}'
        $scope.get24hrsgraph();

        console.log("24 hrs URL::" + $scope.bottomgraphurl);
        $scope.bottomgraphurl = "";



    };

    $scope.get6month = function (isDaterange) {
        $scope.graphname = "6month";
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.last6month;
        $scope.graphdateformat = '{value:%b}'
        console.log("6 months URL::" + $scope.bottomgraphurl);
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";

    };

    $scope.getyear = function (isDaterange) {
        $scope.graphname = "1year";
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.lastyear;
        console.log("1 Year URL::" + $scope.bottomgraphurl);
        $scope.graphdateformat = '{value:%b}'
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";

    };

    $scope.getonedayback = function () {

        var onedayAgo = new Date();
        var onedaybefore = new Date();

        switch ($scope.ActiveButton) {
            case 1:
                $scope.daystoIncrease = $scope.daystoIncrease + 1;
                onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);
                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease + 1))
                $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);
                $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;

                $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);

                $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);

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


                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease + 7))
                $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);



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


                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease + 30))
                $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);

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

                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease + 180))
                $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);

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

                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease + ydays))
                $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);

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
        var onedaybefore = new Date();

        switch ($scope.ActiveButton) {
            case 1:
                $scope.daystoIncrease = $scope.daystoIncrease - 1;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);

             
                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease - 1))

                $scope.previousdate = $scope.datetoshow;

                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                //  $scope.datetoshow = $scope.onedatafterdate;
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);
                $scope.onedayapidate = moment(onedayafter).format("DD-MM-YYYY");

                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }

                $scope.get24hrs(true);
                break;
            case 2:
                $scope.daystoIncrease = $scope.daystoIncrease - 7;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);

                debugger;

                 onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease - 7))

                 $scope.previousdate = $scope.datetoshow;

                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                $scope.onedayapidate = moment(onedayafter).format("DD-MM-YYYY");
                //  $scope.datetoshow = $scope.onedatafterdate;

                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);


                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.get7days(true); break;
            case 3:
                //$scope.daystoIncrease = $scope.daystoIncrease - 30;
                $scope.daystoIncrease = $scope.daystoIncrease - (32 - new Date(onedayafter.getYear(), onedayafter.getMonth(), 32).getDate())
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);

                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease - 30))

                $scope.previousdate = $scope.datetoshow;

               
                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                
                // $scope.datetoshow = $scope.onedatafterdate;
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);
                $scope.onedayapidate = moment(onedayafter).format("DD-MM-YYYY");

                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.getmonth(true); break;
            case 4:
                $scope.daystoIncrease = $scope.daystoIncrease - 180;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);

                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease - 180))
                $scope.previousdate = $scope.datetoshow;


                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");

                $scope.isDateRangeSelected = true;
                // $scope.datetoshow = $scope.onedatafterdate;
                $scope.onedayapidate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);


                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.get6month(true); break;
            case 5:
                var ydays = 365;
                if (onedayafter.getYear() % 4 == 0) {
                    ydays = 366;
                }
                $scope.daystoIncrease = $scope.daystoIncrease - ydays;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);

                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease - ydays))
                $scope.previousdate = $scope.datetoshow;

                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                //$scope.datetoshow = $scope.onedatafterdate;
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);

                $scope.onedayapidate = moment(onedayafter).format("DD-MM-YYYY");
                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.getyear(true); break;
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


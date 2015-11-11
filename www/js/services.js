angular.module('JustAProject')

.factory('$dataService', function($q, $http, $httpService) {
    
    return {
        get3HReading: function(psiData) {
            return psiData.channel.item.region[1].record.reading[1]._value;
        },
        get3HRating: function(psiData) {
            var psiValue = psiData.channel.item.region[1].record.reading[1]._value;
            var psiData = [];

            if(psiValue > 300) {
                psiData[0] = "Hazardous";
                psiData[1] = "#d60000";
            } else if(psiValue > 200) {
                psiData[0] = "Very unhealthy";
                psiData[1] = "#ea8522";
            } else if(psiValue > 100) {
                psiData[0] = "Unhealthy";
                psiData[1] = "#e7b60d";
            } else if(psiValue > 50) {
                psiData[0] = "Moderate";
                psiData[1] = "#006fa1";
            } else if(psiValue >= 0) {
                psiData[0] = "Good";
                psiData[1] = "#479b02";
            } else {
                psiData[0] = "Invalid Data";
                psiData[1] = "white";
            }
            return psiData;
        },
        getDateTime: function() {
            var date = new Date();
            var dateTime = date.toLocaleTimeString();   
            return dateTime;
        },
        getHour: function(psiData) {
            var time = psiData.channel.item.region[1].record._timestamp;
            time = time.substring(8,10);
            var parseTime = parseInt(time);

            if(parseTime >= 12) {
                parseTime = parseTime - 12; 
                if(parseTime == -12) {
                    parseTime = 12 + "AM";
                } else if(parseTime == 12) {
                    parseTime = 12 + "AM";
                } else {
                    parseTime = parseTime + "PM";
                }
            } else {
                parseTime = parseTime + "AM";
            }
            return parseTime;
        }
    }
})

.service('$httpService', function($q, $http) {
  var getPSI = function get(url) {
    var deferred = $q.defer();
    $http.get(url)
        .success(function (data) {
          var x2js = new X2JS();
          var newData = x2js.xml_str2json(data);
          deferred.resolve(newData);
        })
        .error(function (error) {
            deferred.reject(error);
        });

    return deferred.promise;
 }
return {
  getPSI : getPSI
}

});

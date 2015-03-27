

/**
 * @ngdoc function
 * @name clientAngularApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the clientAngularApp
 */
angular.module('clientAngularApp')
  .controller('APICtrl', ['$rootScope', '$scope','MeasureSpaceAPIService', function ($rootScope, $scope, MeasureSpaceAPIService) {
console.log($scope);


	$scope.apidata= {
  "Endpoints": {
    "Channels": {
      "/near": {
        "parameters": {
          "Longitude": {
            "name": "Lng",
            "datatype": "FLOAT",
            "example": "-1.434343"
          },
          "Latitude": {
            "name": "Lat",
            "datatype": "FLOAT",
            "example": "51.00005"
          }
        },
        "AcceptEncoding": "url-form-encoded",
        "Method": "GET",
        "Description": "Get the ITU channel assignments for a specific region. This information is compiled based on ITU channel regions and may not be fully accurate to small regions, but this is something we are working on.",
        "ResponseDescription": "Returns an array of the channels, including its frequency range, its internal ID and its ITU channel number",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "[\n  {\n    \"ChannelNumber\": 21,\n    \"LowEnd\": 471.25,\n    \"ChannelID\": 10,\n    \"UpEnd\": 476.75\n  },\n  {\n    \"ChannelNumber\": 22,\n    \"LowEnd\": 479.25,\n    \"ChannelID\": 11,\n    \"UpEnd\": 484.75\n  },\n  {\n    \"ChannelNumber\": 23,\n    \"LowEnd\": 487.25,\n    \"ChannelID\": 12,\n    \"UpEnd\": 492.75\n  },...",
        "ExampleQuery": "https://api.measurespace.io/channels/near/-0.189099270827/51.5344744155",
        "ExampleQueryBody": "NA",
        "Endpoint": "/channels/near/:Lng/:Lat"
      }
    },
    "User": {
      "/datasets": {
        "parameters": {
          "UserID": {
            "name": "UserID",
            "datatype": "INT",
            "example": "1"
          }
        },
        "AcceptEncoding": "url-form-encoded",
        "Method": "GET",
        "Description": "Get the datasets that realte to a user via their id",
        "ResponseDescription": "Returns a JSON array containing all the datasets that have been uploaded by the user specified by ID",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "[\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829782\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 60\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1427315026\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 89\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425315989\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 57\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829783\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 61\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425830307\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 62\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425830379\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 63\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425831273\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 64\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425831320\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 65\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426182434\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 70\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426445442\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 2,\n    \"PointCount\": 284,\n    \"DatasetID\": 72\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829721\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 59\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426512816\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 2,\n    \"PointCount\": 284,\n    \"DatasetID\": 74\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1427314770\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 84\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940123\",\n    \"Created\": \"1427313667\",\n    \"Lat\": 51.5104183412,\n    \"Lon\": -0.156444146492,\n    \"EndTime\": \"1423954433\",\n    \"UserID\": -1,\n    \"PointCount\": 289,\n    \"DatasetID\": 82\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940123\",\n    \"Created\": \"1427314919\",\n    \"Lat\": 51.5104183412,\n    \"Lon\": -0.156444146492,\n    \"EndTime\": \"1423954433\",\n    \"UserID\": 1,\n    \"PointCount\": 289,\n    \"DatasetID\": 87\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940672\",\n    \"Created\": \"1427313245\",\n    \"Lat\": 51.5096982,\n    \"Lon\": -0.1347394,\n    \"EndTime\": \"1423943487\",\n    \"UserID\": -1,\n    \"PointCount\": 44,\n    \"DatasetID\": 80\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940672\",\n    \"Created\": \"1426512901\",\n    \"Lat\": 51.5096982,\n    \"Lon\": -0.1347394,\n    \"EndTime\": \"1423943487\",\n    \"UserID\": 2,\n    \"PointCount\": 44,\n    \"DatasetID\": 76\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1427315157\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 1,\n    \"PointCount\": 34,\n    \"DatasetID\": 90\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1426512563\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 2,\n    \"PointCount\": 34,\n    \"DatasetID\": 73\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1427314784\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 1,\n    \"PointCount\": 34,\n    \"DatasetID\": 85\n  }\n]",
        "ExampleQuery": "https://api.measurespace.io/datasets/user/1/datasets",
        "ExampleQueryBody": "NA",
        "Endpoint": "/user/:UserID/datasets"
      }
    },
    "Datasets": {
      "/near": {
        "parameters": {
          "Longitude": {
            "name": "Lng",
            "datatype": "FLOAT",
            "example": "-1.434343"
          },
          "Latitude": {
            "name": "Lat",
            "datatype": "FLOAT",
            "example": "51.00005"
          }
        },
        "AcceptEncoding": "url-form-encoded",
        "Method": "GET",
        "Description": "Get the datasets that are near a geographical region, radius of 1000m , this will be customisable in future api versions",
        "ResponseDescription": "Returns a JSON array containing all the datasets that are within the search region, and a QueryError otherwise",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "[\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829782\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 60\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1427315026\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 89\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425315989\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 57\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829783\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 61\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425830307\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 62\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425830379\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 63\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425831273\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 64\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425831320\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 65\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426182434\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 70\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426445442\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 2,\n    \"PointCount\": 284,\n    \"DatasetID\": 72\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1425829721\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 0,\n    \"PointCount\": 284,\n    \"DatasetID\": 59\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1426512816\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 2,\n    \"PointCount\": 284,\n    \"DatasetID\": 74\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1425315398\",\n    \"Created\": \"1427314770\",\n    \"Lat\": 51.5203243904,\n    \"Lon\": -0.170329774411,\n    \"EndTime\": \"1425329858\",\n    \"UserID\": 1,\n    \"PointCount\": 284,\n    \"DatasetID\": 84\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940123\",\n    \"Created\": \"1427313667\",\n    \"Lat\": 51.5104183412,\n    \"Lon\": -0.156444146492,\n    \"EndTime\": \"1423954433\",\n    \"UserID\": -1,\n    \"PointCount\": 289,\n    \"DatasetID\": 82\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940123\",\n    \"Created\": \"1427314919\",\n    \"Lat\": 51.5104183412,\n    \"Lon\": -0.156444146492,\n    \"EndTime\": \"1423954433\",\n    \"UserID\": 1,\n    \"PointCount\": 289,\n    \"DatasetID\": 87\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940672\",\n    \"Created\": \"1427313245\",\n    \"Lat\": 51.5096982,\n    \"Lon\": -0.1347394,\n    \"EndTime\": \"1423943487\",\n    \"UserID\": -1,\n    \"PointCount\": 44,\n    \"DatasetID\": 80\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423940672\",\n    \"Created\": \"1426512901\",\n    \"Lat\": 51.5096982,\n    \"Lon\": -0.1347394,\n    \"EndTime\": \"1423943487\",\n    \"UserID\": 2,\n    \"PointCount\": 44,\n    \"DatasetID\": 76\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1427315157\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 1,\n    \"PointCount\": 34,\n    \"DatasetID\": 90\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1426512563\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 2,\n    \"PointCount\": 34,\n    \"DatasetID\": 73\n  },\n  {\n    \"ChannelCount\": 12,\n    \"StartTime\": \"1423935385\",\n    \"Created\": \"1427314784\",\n    \"Lat\": 51.5118808,\n    \"Lon\": -0.1527719,\n    \"EndTime\": \"1423937325\",\n    \"UserID\": 1,\n    \"PointCount\": 34,\n    \"DatasetID\": 85\n  }\n]",
        "ExampleQuery": "https://api.measurespace.io/datasets/near/-0.189099270827/51.5344744155",
        "ExampleQueryBody": "NA",
        "Endpoint": "/datasets/near/:Lng/:Lat"
      },
      "/readings": {
        "parameters": {
          "DatasetID": {
            "name": "DatasetID",
            "datatype": "INT",
            "example": "65"
          }
        },
        "AcceptEncoding": "url-form-encoded",
        "Method": "GET",
        "Description": "Get all the readings that relate to a specific dataset by its ID",
        "ResponseDescription": "Returns a JSON object containing the Dataset readings",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "{\n  \"14\": [\n    {\n      \"Lat\": 51.5344744155,\n      \"Timestamp\": \"1425321920\",\n      \"Lon\": -0.189099270827,\n      \"CombinedPower\": -64\n    },\n    {\n      \"Lat\": 51.501254082,\n      \"Timestamp\": \"1425316288\",\n      \"Lon\": -0.129792259269,\n      \"CombinedPower\": -65\n    },\n    {\n      \"Lat\": 51.5048360566,\n      \"Timestamp\": \"1425316616\",\n      \"Lon\": -0.152592287107,\n      \"CombinedPower\": -62\n    },\n    {\n      \"Lat\": 51.520158256,\n      \"Timestamp\": \"1425326370\",\n      \"Lon\": -0.169350042549,\n      \"CombinedPower\": -68\n    },\n    {\n      \"Lat\": 51.5030787,\n      \"Timestamp\": \"1425317965\",\n      \"Lon\": -0.1520732,\n      \"CombinedPower\": -66\n    },...",
        "ExampleQuery": "https://api.measurespace.io:8080/datasets/65/readings",
        "ExampleQueryBody": "NA",
        "Endpoint": "/datasets/:DatasetID/readings"
      },
      "/meta": {
        "parameters": {
          "DatasetID": {
            "name": "DatasetID",
            "datatype": "INT",
            "example": "65"
          }
        },
        "AcceptEncoding": "url-form-encoded",
        "Method": "GET",
        "Description": "Get the metadat for a given dataset using its unique ID",
        "ResponseDescription": "Returns a JSON object containing the Dataset metadata",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "{\n  \"ChannelCount\": 12,\n  \"StartTime\": \"1425315398\",\n  \"Created\": \"1425831320\",\n  \"Lat\": 51.5203243904,\n  \"Lon\": -0.170329774411,\n  \"EndTime\": \"1425329858\",\n  \"UserID\": 0,\n  \"PointCount\": 284\n}",
        "ExampleQuery": "https://api.measurespace.io:8080/datasets/65/meta",
        "ExampleQueryBody": "NA",
        "Endpoint": "/datasets/:DatasetID/meta"
      }
    },
    "Uploading": {
      "/track": {
        "parameters": {
          "TrackingID": {
            "name": "TrackID",
            "datatype": "FLOAT",
            "example": "10101.10"
          }
        },
        "AcceptEncoding": "multipart/form-data",
        "Method": "GET",
        "Description": "Use this endpoint to track the progress of the upload you have submitted. The Token returned to you by the upload endpoint should be retained so you can update the user of progress. If the job completes successfully, then you can use the returned DatasetID to access the measurements either through the api or through the online visualisation.",
        "ResponseDescription": "Returns a JSON object representing the status of the job. While the job is returning a status of Completed: 0 and Error: null it is still processing.",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "{Completed: 0, \\n CompletedOn: null, \\n DatasetID: null, \\n Error: null, \\n Message: null, \\n StartedOn: \"1427323495\"}",
        "ExampleQuery": "https://api.measurespace.io:8080/upload/track/2323221.00",
        "ExampleQueryBody": "NA",
        "Endpoint": "/upload/track/:TrackID"
      },
      "/upload": {
        "parameters": {
          "UserID": {
            "name": "UID",
            "datatype": "INT",
            "example": "1"
          }
        },
        "AcceptEncoding": "multipart/form-data",
        "Method": "POST",
        "Description": "Upload readings as JSON files, This is a special case endpoint that uses a specific server port, this will be rectified in the future.",
        "ResponseDescription": "Returns a trackingid that can be used to poll the api as to the status of the upload. Use the /measurements/track endpoint. Jobs are processed in a queue and polling is reccommended no more than once per 2 seconds.",
        "ResponseHTTPCode": "200",
        "ExampleResponse": "{trackingid: \"1427323495.5\"}",
        "ExampleQuery": "https://api.measurespace.io:8080/upload",
        "ExampleQueryBody": "NA",
        "Endpoint": "/upload"
      }
    }
  },
  "Begin": {
    "Accepted Upload Formats": {
      "a": {
        "Text": "Accepted Upload Formats",
        "Type": "Heading"
      },
      "b": {
        "Text": "Below is an illustration of the accepted format for readings upload",
        "Type": "Body"
      },
      "c": {
        "Type": "Code",
        "Text": "{\n  \"Getting Started\": {\n    \"Accepted Upload Formats\": {\n      \"TEXTITEM\": {\n        \"Text\": \"Accepted Upload Formats\",\n        \"Type\": \"Heading\"\n      },\n      \"TEXTITEM 2\": {\n        \"Text\": \"Below is an illustration of the accepted format for readings upload\",\n        \"Type\": \"Body\"\n      },\n      \"TEXTITEM 2 2\": {\n        \"Type\": \"Code\"\n      }\n    },\n    \"Architechture\": {\n      \n    },\n    \"Error Responses\": {\n      \n    }\n"
      }
    },
    "Architechture": {
      "a": {
        "Text": "Accepted Upload Formats",
        "Type": "Heading"
      },
      "b": {
        "Text": "Below is an illustration of the accepted format for readings upload",
        "Type": "Body"
      },
      "c": {
        "Type": "Code",
        "Text": "{\n  \"Getting Started\": {\n    \"Accepted Upload Formats\": {\n      \"TEXTITEM\": {\n        \"Text\": \"Accepted Upload Formats\",\n        \"Type\": \"Heading\"\n      },\n      \"TEXTITEM 2\": {\n        \"Text\": \"Below is an illustration of the accepted format for readings upload\",\n        \"Type\": \"Body\"\n      },\n      \"TEXTITEM 2 2\": {\n        \"Type\": \"Code\"\n      }\n    },\n    \"Architechture\": {\n      \n    },\n    \"Error Responses\": {\n      \n    }\n"
      }
    },
    "Error Responses": {
      "a": {
        "Text": "Accepted Upload Formats",
        "Type": "Heading"
      },
      "b": {
        "Text": "Below is an illustration of the accepted format for readings upload",
        "Type": "Body"
      },
      "c": {
        "Type": "Code",
        "Text": "{\n  \"Getting Started\": {\n    \"Accepted Upload Formats\": {\n      \"TEXTITEM\": {\n        \"Text\": \"Accepted Upload Formats\",\n        \"Type\": \"Heading\"\n      },\n      \"TEXTITEM 2\": {\n        \"Text\": \"Below is an illustration of the accepted format for readings upload\",\n        \"Type\": \"Body\"\n      },\n      \"TEXTITEM 2 2\": {\n        \"Type\": \"Code\"\n      }\n    },\n    \"Architechture\": {\n      \n    },\n    \"Error Responses\": {\n      \n    }\n"
      }
    }
  }
}

  }]);

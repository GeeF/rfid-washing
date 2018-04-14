var summarydata = {};
var summaryRefresh = false;
var summaryTable;

function twoDigits(value) {
	if (value < 10) {
		return "0" + value;
	}
	return value;
}

function isInUserList(needle) {
  for(i = 0; i < userdata.length; i++) {
    if(userdata[i].uid == needle) {
      return true;
    }
  }
  return false;  
}

function summarizeLogsData() {
  debugger;
  
  var summaryMap = {}
  
  logdata.forEach(function(obj) {
    var newSummaryEntry = {};
    if(summaryMap[obj.uid] == null && isInUserList(obj.uid)) {
      newSummaryEntry.uid = obj.uid;
      newSummaryEntry.username = obj.username;
      newSummaryEntry.washes = 1;
      newSummaryEntry.washespayed = 0;
      newSummaryEntry.amountdue = 0;
      summaryMap[obj.uid] = newSummaryEntry;
    } else if(summaryMap[obj.uid] != null) {
      summaryMap[obj.uid].washes++;
    }
  });
  
  //newSummaryEntry.washesPayed = 1; // todo from users file /P/uid -> userdata in users.js
  //newSummaryEntry.amountdue = 1;   // todo get amount per wash from settings data
  summarydata = $.map(summaryMap, function(v) { return v; });
  //summarydata[newSummaryEntry.uid] = newSummaryEntry;
}

function initSummaryTable() {
  summarizeLogsData();
  
	jQuery(function ($) {
		// todo condense summaryData 
		summaryTable = FooTable.init("#latestsummarytable", {
			columns: [
				{
					"name": "uid",
					"title": "UID",
					"type": "text",
					"sorted": true,
					"direction": "DESC"
          },
				{
					"name": "username",
					"title": "User Name"
        },
        {
					"name": "washes",
					"title": "# Washes Total"
        },
        {
					"name": "washespayed",
					"title": "# Washes Payed Total"
        },
        {
					"name": "amountdue",
					"title": "Amount Due"
        }
        ],
			rows: summarydata
		});
	});
}

function loadSummary() {
  summaryRefresh = true;
	document.getElementById("summaryFieldset").disabled = true;
	document.getElementById("summary-loading-img").style.display = "none";
  websock.send("{\"command\":\"latestlog\"}");
}

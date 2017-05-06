  // Initialize Firebase in .js file
  var config = {
    apiKey: "AIzaSyDGZEQk3LRSo8agHhrlFXS0zmWBVVDKuMM",
    authDomain: "practice-ab930.firebaseapp.com",
    databaseURL: "https://practice-ab930.firebaseio.com",
    projectId: "practice-ab930",
    storageBucket: "practice-ab930.appspot.com",
    messagingSenderId: "1084452407682"
  };

  firebase.initializeApp(config);
  var database = firebase.database();

  // *****GLOBAL VARIABLES***** //  
  var name = "";
  var destination = "";
  var trainTime = "";
  var frequency = "";
  var nextArrival = "";
  
  // *****CAPTURE INPUTS AND PUSH TO DATABASE*****
  $("#addUser").on("click", function(event){
    event.preventDefault();

    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    trainTime = $("#trainTime-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    
    var currentTime = moment().format("YYYY-MM-DD HH:mm");
    var convertedTime = moment().format("YYYY-MM-DD") + " " + trainTime;
    var difference = moment(currentTime).diff(moment(convertedTime), "minutes");


      while(convertedTime < currentTime) {
        var incrementTime = moment(convertedTime).add(frequency, "minutes");
        var newTime = moment(incrementTime._d).format("YYYY-MM-DD HH:mm");
        convertedTime = newTime;
      }
        nextArrival = moment(convertedTime).format("HH:mm");
        var minutesAway = moment(convertedTime).diff(moment(currentTime), "minutes");    

    database.ref().push( {
        name: name,
        destination: destination,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
    });
    
  });
  // *****INPUTS DATABASE INFO INTO TABLE DATA*****
  database.ref().on("child_added", function(childSnapshot){

    $("#dataAdded").append("<tr class='empDataAdded'>" + 
      "<td>" + childSnapshot.val().name + "</td>" +
      "<td>" + childSnapshot.val().destination + "</td>" + 
      "<td>" + childSnapshot.val().frequency + "</td>" +
      "<td>" + childSnapshot.val().nextArrival + "</td>" +
      "<td>" + childSnapshot.val().minutesAway + "</td>" +
      "</tr>");
  });
   // *****CAPTURES LAST DATABASE INPUTS AND DISPLAYS IN HTML*****
  database.ref().on("value", function(snapshot){
    var sv = snapshot.val();
    var svArr = Object.keys(sv);
    var lastIndex = svArr.length -1;
    var lastKey = svArr[lastIndex];
    var lastObj = sv[lastKey];

      $("#name-input").html(lastObj.name);
      $("#destination-input").html(lastObj.destination);
      $("#frequency-input").html(lastObj.frequency);
      $("#trainTime-input").html(lastObj.trainTime);

  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);

  });


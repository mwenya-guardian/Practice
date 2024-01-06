console.log("Hello... Am up and running!!!");
const { process_params } = require('express/lib/router');
const readline =  require('readline');
const req = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var target, values;
//Getting the user inpuit for the vcalues to be sorted and/or searched
req.question("Enter the Values: ", (userInput) => {
  values = userInput;
  target = values.split(" ")[values.split(" ").length - 1];
    console.log(values);
    //req.close;
    console.log(BinarySearch(values, target));
    
});
//The number to be searched for
req.question("Enter the target value: ", (userInput) => {
  target = userInput;
    console.log(target);
    req.close;
});
function getValues(){
  //event.preventDefault();
  //var values = //document.getElementById("values").value;
  //var target = ;//document.getElementById("target").value;
  //document.write(values);
  //document.getElementById("result").innerHTML = values.length;
  //document.getElementById("resultSearch").innerHTML = target;
  if(values.length == 0){
    //document.getElementById("result").innerHTML = "Please enter the numbers you wish to sort and/or search";
    console.log("Please enter the numbers you wish to sort and/or search");
    return;
  }
    if("string" === typeof values)
      values = values.split(" ");
  if(values.length > 0 && target.length == 0){
    toNumber(values);
    sortAlg(values);
      //document.getElementById("result").innerHTML = values;
      console.log(values);
      return;
  } else if(values.length > 0 && target.length > 0){
    target =  target.slpit(" ")[0];
    target = parseInt(target);
        if(isNaN(target)){
          //document.getElementById("resultSearch").innerHTML = "Please enter a number for the search digit";
          console.log("Please enter a number for the search digit");
          return;
        }
        toNumber(values);
        //document.getElementById("resultSearch").innerHTML = "Index Of Result: " + BinarySearch(values, target);
        console.log("Index Of Result: " + BinarySearch(values, target));
        return;
  }
}

function sortAlg(arr){
  if(!Array.isArray(arr))
    return;
  let index = 0, temp = 0, tempIndex = 0;
    while(index <= arr.length - 1){
      temp = arr[index];
      tempIndex = index;
      for(let i = index; i < arr.length - 1; i++){
        if(temp > arr[i]){
          temp = arr[i];
          tempIndex = i;
        }
      }
    } 
}
function BinarySearch(arr, target){
  //if(!Array.isArray(arr))
    //  return "Here";
  if(sortAlg(arr) == undefined)
    return -1;
  let begin = 0, end = arr.length - 1;
  while(begin < end){
    if(target === arr[(end + begin)/2]){
      return (end + begin)/2;
    }
    else if(target > arr[(end + begin)/2]) {
      begin = (end + begin)/2;
    }
    else if(target < arr[(end + begin)/2]) {
      end = (end + begin)/2; 
    }
    else {
      return -1;
    }
  }
  return -1;
}

function toNumber(arr){
 if(!Array.isArray(arr))
    return;
  for(let i = 0; i < arr.length; i++){
    arr[i] = parseFloat(arr[i]);
  }
  return arr.forEach(function (value){
              if(isNaN(value))
                return NaN;
              });
}
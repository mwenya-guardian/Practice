function getVideo(){
  event.preventDefault();
  let num = document.getElementById("values").value;
  path = "videos/" + num;
  document.getElementById("videos").innerHTML = "<video width= 100% height=\" 600\" preload controls> " + 
          "<source src=\"" + "videos/" + num + "\" type=\"video/mp4\"> " +
          "<source src=\"" + path + "\" type=\"video/mp4\">" +
          "<p> <a href=\"title\"></a></p>" +
          "</video>";
  if(document.getElementById("target").value.length != 0)
    postRequest();
  }
      
function postRequest(){
  let dataInput = document.getElementById("target").value
  let result = 0;
  fetch("find", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        data: dataInput
    }),
  })
    .then(response => {
      response.json();
      dataInput = response;
      result = response.json();
  })
    .then(data => { 
      console.log('Data sent', data);
  })
    .catch(error => {
        console.error('not sent', error);
  });
        document.getElementById("borders").innerHTML = dataInput + " ###  " + result;
}
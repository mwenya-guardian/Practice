function getVideo(){
  event.preventDefault();
  let num = document.getElementById("values").value;
  document.getElementById("videos").innerHTML = "<video width= 100% height=\" 600\" preload controls> " + 
          "<source src=\"videos/" + num + "\" type=\"video/mp4\"> " +
          "<p> <a href=\"title\"></a></p>" +
          "</video>";
  if(document.getElementById("target").value.length != 0)
    postRequest();
  }
      
function postRequest(){
  let dataInput = document.getElementById("target").value
  let result = 0;
      fetch('/find', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', },
      body: JSON.stringify({ data: dataInput,})
    })
      .then(async data => { 
        result = await data.json();
        console.log('Data sent', result);
        document.getElementById("borders").innerHTML = "### Result: " 
        + result.response.data + " ### "
      })
        .catch(error => {
          console.error('not sent', error);
        });
    ;
}
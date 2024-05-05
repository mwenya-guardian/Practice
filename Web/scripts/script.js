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
        + result.response + " ### "
      })
        .catch(error => {
          console.error('not sent', error);
        });
    ;
}
//Get drive info
function getDrives(){
 fetch('/execute-command').then(response =>{
    return response.json();
  }).then(data =>{
      let div = document.getElementById("Drive");
      let drives = data.message;
        drives = drives.split("\r\r\n");
          //Remove un-drive elements
          let drive = drives.filter((element)=>{
            return String(element).indexOf(":") > 0? element:false;
          });
            //getting drive names
            let driveName = [];
              drive.forEach(element => {
                element = String(element).split(":");
                  if(element[1].length > 0)
                    driveName.push(element[0]);
              });
            driveName.forEach(element=>{
              let newButton = document.createElement("input");
              let newLink = document.createElement("a");
                newButton.className = "file";
                newButton.type = "button";
                newButton.value = "Drive:" + String(element);
                newLink.href = "/file/";
              newLink.appendChild(newButton);
              div.appendChild(newLink);
            });
          console.log(driveName);
  });
}

window.addEventListener('DOMContentLoaded', getDrives);
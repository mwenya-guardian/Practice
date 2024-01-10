console.log("running!!!");
const { process_params } = require('express/lib/router');
const express = require('express');
const app = express();
const port = 3000;

//Sample data
let books = [
  {id: 1, title: "Book 1", author:"Author 1"},
  {id: 1, title: "Book 1", author:"Author 1"}
]
let me = {
  id:{is: "This"},
  them: {you:"that"}
}

app.use(express.json());
app.get('/books', (req, res)=> {
  res.json(books.Me = me);
});
app.post('/books', (req, res)=> {
  const newBook = req.body;
  books.push(newBook);
  res.status(201).json(newBook);
});
app.put('/books/:id', (req, res) => {
  const bookId =  parseInt(req.params.id);
  const updateBook = req.body;
  books = books.map(book=> book.id !== bookId? updateBook: book);
    res.json(updateBook);
});
app.delete('/books/:id', (req, res)=> {
  const bookId = parseInt(req.params.id);
  books = books.filter(book => book.id !== bookId);
  res.sendStatus(204);
});
app.listen(port, ()=> {
  console.log('REST API for book management is listening at http://localhost:${port}');
});










//---------------------------------------------------------------------------------
//Previuos function definations
//---------------------------------------------------------------------------------
const readline =  require('readline');
const req = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
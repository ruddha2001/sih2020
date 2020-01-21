let variable = 0;
let $ = require("jquery");

async function getUserAsync() 
{
  let response = await fetch(`http://localhost:8080/loginstatus`);
  let data = await response.status;
  return data;
}

exports.show=1;


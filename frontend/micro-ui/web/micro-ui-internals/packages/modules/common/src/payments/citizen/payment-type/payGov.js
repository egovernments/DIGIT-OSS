export const makePayment =async(url,data)=>{
    var myHeaders = new Headers();
myHeaders.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");


var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: data,
  redirect: 'follow'
};

fetch(url, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}
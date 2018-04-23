var tstamp=Date.now();
var errCount=0;
var fetchImageTimer;
function fetchNewImages() {
    console.log(tstamp)
    
    const postRequestOptions = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({after: tstamp}),
    }
    fetch("/latest", postRequestOptions)
        .then(handleErrors => handleErrors.json())
        .then(items => {
            let imagediv = document.getElementById("imagesdiv");
            items.forEach(element => {
            let brElement = document.createElement('br');
            let imgElement = document.createElement('img');
            imgElement.classList.add('galleria');
            imgElement.src=element;
            imagediv.insertBefore(imgElement,imagediv.childNodes[0]); 
            imagediv.insertBefore(brElement,imagediv.childNodes[1]);
            });    
            tstamp = Date.now();         
        })
        .catch(error => {
            console.log(error)
            errCount++;
            if (errCount==2){
            document.body.innerHTML="Oops server is down.Please try again later";
            clearTimeout(fetchImageTimer);
            errCount=0;
            }
            
        } );
    fetchImageTimer=setTimeout(fetchNewImages, 5000);    
} 

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    errCount=0;
    return response;
}

fetchNewImages()
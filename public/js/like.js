const clicked = (ele) => {

    const isLiked = ("true" === ele.dataset.liked);
    const repid = ele.dataset.repid;

    console.log(isLiked);
    console.log(repid);

    if(!isLiked){
          ele.innerHTML = "Supported !!!";
          ele.className = "btn btn-primary";
          ele.dataset.liked = !isLiked + "";
          
          fetch(`/student/dashboard/report/${repid}?flag=${isLiked}`,{
            method: 'POST', 
            mode: 'cors', 
            cache: 'no-cache',
            credentials: 'same-origin', 
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            }})
                .then(response => {console.log(response)
                  console.log("asjkdhgasdjhagdsjhasgdjhasdgjahsdg")});
            return false;
          }
          else{
            ele.innerHTML = "Support";
          ele.className = "btn btn-outline-primary";
          ele.dataset.liked = !isLiked;

          fetch(`/student/dashboard/report/${repid}?flag=${isLiked}`,{
          method: 'POST', 
          mode: 'cors', 
          cache: 'no-cache',
          credentials: 'same-origin', 
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }})
          .then(response => {console.log(response)
            console.log("asjkdhgasdjhagdsjhasgdjhasdgjahsdg")});
          return false;
            
    }
};



// req.session.userunique = isValid.uid + isValid.dob + isValid.dept + "" // uid(rollno),dob,dept



// {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'cors', // no-cors, *cors, same-origin
//     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: 'same-origin', // include, *same-origin, omit
//     headers: {
//       'Content-Type': 'application/json'
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     redirect: 'follow', // manual, *follow, error
//     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     body: JSON.stringify(data) // body data type must match "Content-Type" header
//   });
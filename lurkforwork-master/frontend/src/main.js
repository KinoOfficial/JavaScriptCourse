import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

const submit=document.getElementById("submit");
const register=document.getElementById("register")
const login = document.getElementById("login");
const registration = document.getElementById('registration');
const back=document.getElementById('back_register');
const pwd_register=document.getElementById('pwd_register');
const pwd2_register=document.getElementById('pwd2_register');
const pwd_warning=document.getElementById('pwd_warning');
const submit_register=document.getElementById('submit_register');

if(localStorage.getItem('myemail')){
    document.getElementById("email").value=localStorage.getItem('myemail')
    document.getElementById("password").value=localStorage.getItem("mypassword")
}
else{
    document.getElementById("email").value=""
    document.getElementById("password").value=""
}

if(localStorage.getItem('checkoutChecked')=='true'){
    document.getElementById('checkoutCheck').checked=true
}
else{
    document.getElementById('checkoutCheck').checked=false
}

let checkoutCheck=document.getElementById('checkoutCheck')

submit.addEventListener('click',function(){
let email_txt=document.getElementById("email").value;
let password_txt=document.getElementById("password").value;
let obj={
    "email": email_txt,
    "password": password_txt
}
fetch('http://localhost:'+BACKEND_PORT+'/auth/login',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(obj)
}).then(json => {
    return json.json()
}).then(data => {
    if(data.error) {
        alert(('Please input the valid email and password!'))
    }
    else{
        localStorage.setItem('userid',data.userId)
        localStorage.setItem('token',data.token)
        if(checkoutCheck.checked==true){
            localStorage.setItem('myemail',document.getElementById("email").value)
            localStorage.setItem('mypassword',document.getElementById("password").value)
            localStorage.setItem('checkoutChecked',true)
        }
        else{
            localStorage.setItem('myemail','')
            localStorage.setItem('mypassword','')
            localStorage.setItem('checkoutChecked',false)
        }
        alert('login success!')

        
    }


    return data.token

    
}).then(
    data=>{
        let f1= (fetch('http://localhost:'+BACKEND_PORT+'/job/feed?start=0',{
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${data}`
            },
        }))

        return f1
        
        
    }
    
).then(json => {

    return json.json()
}).then(data => {

    let myuserid=localStorage.getItem('userid')
    let token=localStorage.getItem('token')
    if(!data.error) {
        tojob(data,myuserid,token);
    }
    
}).catch(data=>{
    alert(data)
})

})



// .catch(data=>{
//     alert('Connecting Error!')
// })






register.onclick= ()=> {
    login.style.display="none";
    registration.style.display="block";
}

back.onclick= ()=> {
    login.style.display="block";
    registration.style.display="none";
}

pwd2_register.onblur= ()=> {
    if(pwd_register.value!=pwd2_register.value){
        pwd_warning.innerText="The two passwords are different";
    }
    else{
        pwd_warning.innerText="";
    }
}

submit_register.onclick=()=>{
    if(pwd_register.value!=pwd2_register.value){
        alert("The two passwords are different")
    }
    else{
        let email=document.getElementById("email_register").value;
        if(isEmail(email)){
            let password=document.getElementById("pwd_register").value;
            let name=document.getElementById("name_register").value;
            let obj={
                "email": email,
                "password": password,
                "name": name
            }
            fetch('http://localhost:'+BACKEND_PORT+'/auth/register',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(obj)
            }).then(json => {
                return json.json()
            }).then(data => {
                if(data.error) {
                    alert('User already exists!')
                }
                else{
                    alert('Successful registration')
                    login.style.display="block";
                    registration.style.display="none";
                }
                
            }).catch(data=>{
                alert(data)
            })
        }
        else{
            alert('Please input the valid email format(xxx@.xxx.com)111')
        }




    }

}

function nameformat(data){
    let node=document.createElement("a")
    node.classList.add('username')
    node.dataset.userid=data.id
    node.dataset.bsToggle="modal"
    node.dataset.bsTarget="#others_modal"
    node.innerText=data.name
    node.href="#"
    return node
}

function nameformat2(data){
    let node=document.createElement("a")
    node.classList.add('username')
    node.dataset.userid=data.id
    node.innerText=data.name
    node.href="#"
    node.dataset.newmodal_flag="true"
    return node
}

function tojob(data,myuserid,token){
    const profile_content =document.getElementById('profile_content')
    const addUpdate=document.getElementById('addUpdate');
    const logout_btn=document.getElementById('logout_btn')
    profile_content.style.display="block";
    addUpdate.style.display='block';
    document.getElementById('job').style.display="block";
    logout_btn.style.display="block"
    login.style.display="none";


    let job_arr=data;


    logout_btn.onclick=function(){
        logout(token,job_arr)
    }

    
    

    if(job_arr.length==0){
        document.getElementById('btn2020').dataset.bsTarget="1"
        document.getElementsByClassName('job_title')[0].innerText=""
        document.getElementsByClassName('job_c')[0].innerText=""
        document.getElementsByClassName('job_time')[0].innerText=""

        if(document.getElementById('btn2020_txt')){
            document.getElementById('btn2020').removeChild(document.getElementById('btn2020_txt'))
        }
        let btn2020_txt=document.createElement('span')
        btn2020_txt.innerText="There are no jobs available to show"
        btn2020_txt.id="btn2020_txt"
        document.getElementById('btn2020').appendChild(btn2020_txt)
        if(document.querySelector('.joblist_li .show')){    
            document.querySelector('.joblist_li .show').classList.remove('show')
        }
        
       
    }
    else{
        for(let job_index=0; job_index<job_arr.length; job_index++)

    {
    let  joblist_li=document.querySelector('.joblist_li')
    document.querySelector('.joblist_li>div').classList.remove('show')
    //        updatingOption_div.classList.remove('show')
    if(job_index!=0){
        let li_copied=joblist_li.cloneNode(true);
        document.getElementById('job_ul').appendChild(li_copied);
    }

    
    

    let joblist_btn=document.querySelectorAll('.joblist_li>button')[job_index]
    let job_container=document.querySelectorAll('.joblist_li>div')[job_index]

    job_container.id="job"+job_index

    let color_list=["btn-primary","btn-secondary","btn-success","btn-danger",'btn-warning',"btn-info","btn-light","btn-dark"]


    joblist_btn.dataset.bsToggle="collapse"

    joblist_btn.dataset.bsTarget="#"+job_container.id

    

    joblist_btn.classList.replace("btn-primary",color_list[job_index%job_arr.length])
    



    let job_title=document.getElementsByClassName('job_title')[job_index];
    let job1_img=document.getElementsByClassName('job_img')[job_index];
    let job_creater=document.getElementsByClassName('job_c')[job_index];
    let job_time=document.getElementsByClassName('job_time')[job_index];
    let job_description=document.getElementsByClassName('job_description')[job_index];
    let job_start=document.getElementsByClassName('job_start')[job_index];
    let job_like=document.getElementsByClassName('job_like')[job_index]
    let job_comment=document.getElementsByClassName('comment')[job_index]
    let job_wholike=document.getElementsByClassName('job_wholike')[job_index];
    let job_like_btn=document.getElementsByClassName('job_like_btn')[job_index];
    

    
    //job title 
    job_title.innerText=""
    job_title.innerText="job title: "+job_arr[job_index].title;

    //job creator
    fetch('http://localhost:'+BACKEND_PORT+'/user?userId='+job_arr[job_index].creatorId,{
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
        }
    }).then(json => {
    return json.json()
    }).then(data => {
    let job_c=document.getElementsByClassName('job_c')[job_index]
    if(job_c.innerText!=""){

        document.getElementsByClassName("job_c")[job_index].removeChild(document.getElementsByClassName("job_c")[job_index].firstChild)
    }

    let job_creater_span=document.createElement("span");
    job_creater_span.innerText="created by: "
    job_c.appendChild(job_creater_span)
    job_creater_span.appendChild(nameformat(data))
    }
    )

    //job image
    job1_img.src=job_arr[job_index].image;

    

    //jor created time
    let createdAt_str=job_arr[job_index].createdAt
    createdAt_str=dateFormat(createdAt_str)
    job_time.innerText=""
    job_time.innerText="created at : "+createdAt_str

    //descriptrion
    job_description.innerText=""
    job_description.innerText="Description: "+job_arr[job_index].description

    //job start time
    job_start.innerText=""
    job_start.innerText="Starting at:"+dateFormat(job_arr[job_index].start)

    //job like
    job_like.innerText=""
    job_like.innerText=job_arr[job_index].likes.length+" "+"Like(s)"

    

    //comment
    let comments_arr=job_arr[job_index].comments
    job_comment.innerText=comments_arr.length+" "+"Comment(s):"
    for(let i=0; i<comments_arr.length; i++){
        fetch('http://localhost:'+BACKEND_PORT+'/user?userId='+comments_arr[i].userId,{
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
        }
        }).then(json => {
        return json.json()
        }).then(data => {
            let name=nameformat(data)
            let job_comment_div=document.createElement('div')
            job_comment.appendChild(job_comment_div)
            job_comment_div.appendChild(name)
            let job_comment_txt=document.createElement('span')
            job_comment_txt.innerText=" :"+comments_arr[i].comment
            job_comment_div.appendChild(job_comment_txt)


        })
    }

    //show who like

    let like_arr=job_arr[job_index].likes

    while(job_wholike.hasChildNodes()){
        job_wholike.removeChild(job_wholike.firstChild)
    }


    for(let i=0; i<like_arr.length; i++) {
        {
            fetch('http://localhost:'+BACKEND_PORT+'/user?userId='+like_arr[i].userId,{
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
        }
        }).then(json => {
        return json.json()
        }).then(data => {
            let name=nameformat(data)
            job_wholike.appendChild(name)

            let job_wholike_txt=document.createElement('span')
            if(i==like_arr.length-1){
                job_wholike_txt.innerText=' like(s) this job'
            }
            else{
                if(like_arr!=1){
                    job_wholike_txt.innerText+=", "
                }
            }
            job_wholike.appendChild(job_wholike_txt)

        })
        }
        
    }

    //2.3.3. Liking a job

    let likeflag=true
    let like_img=document.getElementsByClassName('like_img')[job_index]
    like_img.src="../img/heart2.png"
    if(job_like_btn.childNodes.length>1){
        job_like_btn.removeChild(job_like_btn.childNodes[1])
    }
    let like_txt=document.createElement('span')
    like_txt.innerText="Likes"
        for(let i=0; i<job_arr[job_index].likes.length;i++) {
            if(job_arr[job_index].likes[i].userId==myuserid){
                likeflag=false
                like_img.src="../img/heart1.svg"
                like_txt.innerText="Unlikes"
                break;
            }
        }


    
    job_like_btn.appendChild(like_txt)


    


    job_like_btn.onclick=()=>{
        

        let obj={
            id: Number(job_arr[job_index].id),
            turnon: likeflag
        }

        fetch('http://localhost:'+BACKEND_PORT+'/job/like',{
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify(obj)
        }).then(json => {
            return json.json()
        }).then(data => {
            if(data.error) {
                alert(data.error)
            }
            else{
                if(likeflag==true) {
                    alert('Successful Likes!')
                }
                else{
                    alert('Successful Unlikes!')
                }
                
            }
            
        }).catch(data=>{
            alert(data)
        })
        
     refreshPage(job_arr,myuserid,token)
        
    }
    //2.5.3. Leaving comments
    let leaveComment=document.getElementsByClassName('leaveComment')[job_index]
    let leaveComment_btn=document.getElementsByClassName('leaveComment_btn')[job_index]

    leaveComment_btn.onclick=function(){
        let obj={
            id: job_arr[job_index].id,
            comment: leaveComment.value,
        }
        fetch('http://localhost:'+BACKEND_PORT+'/job/comment',{
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization':`Bearer ${token}`
                    },
                    body: JSON.stringify(obj)
        }).then(json => {
            return json.json()
        }).then(data => {
            if(data.error) {
                alert(data.error)
            }
            else{
                leaveComment.value=''
                alert('Message success!')
            }
            
        })
        refreshPage(job_arr,myuserid,token)
        
    }

    //end of job_arr loop

    }

    }


    



    //2.4.1. Viewing others' profiles

    setTimeout(()=>{

        let elements = document.querySelectorAll(".username");
        // Convert the node list into an Array so we can
        // safely use Array methods with it
        let elementsArray = Array.prototype.slice.call(elements);

        // Loop over the array of elements
        elementsArray.forEach(function(elem){

        // Assign an event handler
        
        elem.addEventListener("click", function(){
        let userid=Number(elem.getAttribute('data-userid'))
        otherProfile(userid,token,job_arr,myuserid)    
        });
        });
        
        
    },1000)

    //2.4.2. Viewing your own profile
    const myprofile =document.getElementById('myprofile');
        myprofile.onclick =function(){
            otherProfile(myuserid,token,job_arr,myuserid)
    }

    //2.4.3. Updating your profile
    const update_save=document.getElementById('update_save');
    const update_email=document.getElementById('update_email');
    const update_password=document.getElementById('update_password');
    const update_name=document.getElementById('update_name');
    const update_img=document.getElementById('update_img');

    update_save.onclick=()=>{

        if(update_email.value==""||update_password.value==""||update_name.value==""){
            alert("please don't keep blank!")
        }
        else{

            if(isEmail(update_email.value)){
                if(update_img.files.length!=0){
                    const file = update_img.files[0];
                    fileToDataUrl(file).then((data)=>{
                        let img_path=data;
                        let obj={
                            email: update_email.value,
                            password: update_password.value,
                            name: update_name.value,
                            image:img_path
                        }
                
                        return fetch('http://localhost:'+BACKEND_PORT+'/user',{
                        method: 'PUT',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization':`Bearer ${token}`
                        },
                        body: JSON.stringify(obj)
                        })
                    }).then(json => {
                        return json.json()
                    }).then(data=>{
                        if(data.error){
                            alert(data.error)
                        }
                        else{
                            alert('updating success!')
                        }
                        
                    })
                    }
                else{
                        let img_path='';
                        let obj={
                            email: update_email.value,
                            password: update_password.value,
                            name: update_name.value,
                            image:img_path
                        }
                        fetch('http://localhost:'+BACKEND_PORT+'/user',{
                        method: 'PUT',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization':`Bearer ${token}`
                        },
                        body: JSON.stringify(obj)
                        }).then(json => {
                            return json.json()
                        }).then(data=>{
                            if(data.error){
                                alert(data.error)
                            }
                            else{
                                alert('updating success!')
                            }
                        })
                    
                }
            }
            else{
                alert('Please input the valid email format(xxx@.xxx.com)222')
            }
            
            
            
        }
        
    }


    //2.4.4. Watching / Unwatching

    const watch_save=document.getElementById('watch_save')
    const watch_email=document.getElementById('watch_email')

    watch_save.onclick=() => {
        if(isEmail(watch_email.value)&&(watch_email.value)){
            
            let obj={
                email: watch_email.value,
                turnon:true
            }
            fetch('http://localhost:'+BACKEND_PORT+'/user/watch',{
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify(obj)
            }).then(json => {
                return json.json()
            }).then(data=>{
                if(data.error){
                    alert(data.error)
                }
                else{
                        alert('watching success!')
                }
            })
        }
        else{
            alert(('Please input the valid email format(xxx@.xxx.com)333'))
        }



        

    }
    
    

    //2.5.1. Adding a job

    const addjob_title=document.getElementById('addjob_title')
    const addjob_img=document.getElementById('addjob_img')
    const addjob_startat=document.getElementById('addjob_startat')
    const addjob_description=document.getElementById('addjob_description')
    const addjob_btn=document.getElementById('addjob_btn')

    addjob_btn.onclick=() => {

        if(addjob_img.files.length!=0){
            const file = addjob_img.files[0];
            fileToDataUrl(file).then((imgurl)=>{
                let obj={
                    title: addjob_title.value,
                    image: imgurl,
                    start: addjob_startat.value,
                    description:addjob_description.value
                }
        
                return fetch('http://localhost:'+BACKEND_PORT+'/job',{
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body: JSON.stringify(obj)
                })
            }).then(json => {
                return json.json()
            }).then(data=>{
                if(data.error){
                    alert(data.error)
                }
                else{
                    alert('Adding job success!')
                }
                
            })
            }

         

       

    }


    //2.5.2. Updating & deleting a 
    

    //selecting job

    

    fetch('http://localhost:'+BACKEND_PORT+'/user?userId='+myuserid,{
    method: 'GET',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${token}`
    }
    }).then(json => {
    return json.json()
    }).then(data=>{
        if(document.querySelectorAll('#select_job_ul li').length>0){
            let elementsArray = Array.prototype.slice.call(document.querySelectorAll('#select_job_ul li'));
                    // Loop over the array of elements
                    elementsArray.forEach(function(elem){
                        document.getElementById('select_job_ul').removeChild(elem);
                    // Assign an event handler
                    })

        }

        if(data.jobs.length==0){
            let li=document.createElement('li');
            li.innerText='You did not post any jobs before!'
            document.getElementById('select_job_ul').appendChild(li)

        }
        else{
            for(let i=0; i<data.jobs.length; i++){
                let li=document.createElement('li');
                let li_a=document.createElement('a');
                li_a.href="#"
                li_a.innerText=`Job ${i+1}: `+data.jobs[i].title
                li_a.dataset.bsToggle="collapse"

                document.getElementById('select_job_ul').appendChild(li)
                
                li.appendChild(li_a)

                let updatingOption_div = document.createElement('div')
                updatingOption_div.classList.add('collapse')
                
                updatingOption_div.id="updatingOption_div"+i

                

                li_a.dataset.bsTarget="#"+updatingOption_div.id
                li.appendChild(updatingOption_div)


                let updatingOption_div_btn1 = document.createElement('button')
                updatingOption_div_btn1.dataset.bsToggle="modal"
                updatingOption_div_btn1.classList.add("btn")
                let updatingOption_div_btn2=updatingOption_div_btn1.cloneNode(true)
                updatingOption_div_btn1.classList.add('btn-danger')
                updatingOption_div_btn2.classList.add('btn-primary')
                updatingOption_div_btn1.innerText="Delete"
                updatingOption_div_btn2.innerText="Update"
                updatingOption_div_btn1.dataset.bsTarget="#deletejob_modal"
                updatingOption_div_btn2.dataset.bsTarget="#updatejob_modal"
                updatingOption_div.appendChild(updatingOption_div_btn1)
                updatingOption_div.appendChild(updatingOption_div_btn2)

                


                updatingOption_div_btn1.addEventListener('click', function(){
                    localStorage.setItem('select_jobid',data.jobs[i].id)
                })
                updatingOption_div_btn2.addEventListener('click', function(){
                    localStorage.setItem('select_jobid',data.jobs[i].id)
                })


                
                
            }
        }
    })

    //updating job


    const update_title=document.getElementById('update_title')
    const updatejob_img=document.getElementById('updatejob_img')
    const updatejob_startat=document.getElementById('updatejob_startat')
    const updatejob_description=document.getElementById('updatejob_description')
    const updatejob_btn=document.getElementById('updatejob_btn')

    updatejob_btn.onclick=() => {

        

        if(updatejob_img.files.length!=0){
            const file = updatejob_img.files[0];
            fileToDataUrl(file).then((imgurl)=>{
                let obj={
                    id:localStorage.getItem('select_jobid'),
                    title: update_title.value,
                    image: imgurl,
                    start: updatejob_startat.value,
                    description:updatejob_description.value
                }
        
                return fetch('http://localhost:'+BACKEND_PORT+'/job',{
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body: JSON.stringify(obj)
                })
            }).then(json => {
                return json.json()
            }).then(data=>{
                if(data.error){
                    alert(data.error)
                }
                else{
                    alert('Updating job success!')
                }
                
            })
            }
        else{
            alert('Please upload the image!')
        }

         

       

    }

    //deleting job

    const deletejob_btn=document.getElementById('deletejob_btn')

    deletejob_btn.onclick=function(){

        let obj={
            id:localStorage.getItem('select_jobid')

        }

        fetch('http://localhost:'+BACKEND_PORT+'/job',{
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body: JSON.stringify(obj)
                }).then(json => {
                    return json.json()
                }).then(data=>{
                    if(data.error){
                        alert(data.error)
                    }
                    else{
                        alert('Deleting job success!')
                    }
                    
                })
                


        

    }


    
    let myinterval=setInterval(function(){
        fetch('http://localhost:'+BACKEND_PORT+'/job/feed?start=0',{
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
            })
            .then(json => {
                return json.json()
            }).then(data => {
                if(!data.error) {
                    if(job_arr.length!=data.length){
                        setTimeout(() =>{},1000)
                        if(job_arr.length>data.length){
                            alert('Some one delete a job!')
                            
                            refreshPage(job_arr,myuserid,token)
                            
                           }
                           else if(job_arr.length<data.length){
                            alert('Some one post a job!')
                            refreshPage(job_arr,myuserid,token)
                            
                           }
                    }
                   
                }
                
            })
    },1000)

    localStorage.setItem("myinterval"+myuserid,myinterval)

    





    






// end of tojob()
}



function dateFormat(createdAt_str){
    // createdAt_str="2023-03-22T01:30:15.850Z"
    const createdDate=new Date(createdAt_str)
    const today = new Date()           //today

    

    if (createdDate.getFullYear()==today.getFullYear()&&createdDate.getMonth()==today.getMonth()&&createdDate.getDate()==today.getDate()){
        
        let ms=today.getTime()-createdDate.getTime()
        let hour=Math.floor(ms/1000/60/60)
        let minute=Math.floor((ms/1000/60/60-hour)*60)
        if(hour==0){
            return minute+' minute(s) before'
        }
        else{
            return hour+' hour(s) '+minute+' minute(s) before'
        }
        
    }
    else{
        const year_str=createdDate.getFullYear().toString()
        let month_str=(createdDate.getMonth()+1).toString()
        month_str=createdDate.getMonth()+1 <10?'0'+month_str:month_str;
        let day_str=(createdDate.getDate().toString())
        day_str=createdDate.getDate() <10?'0'+day_str:day_str;
        return day_str+'/'+month_str+'/'+year_str
        
    }
}

function otherProfile(userid,token,jobdata,myuserid){
    let others_modal_Label=document.getElementById('others_modal_Label');
    fetch('http://localhost:'+BACKEND_PORT+'/user?userId='+userid,{
    method: 'GET',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${token}`
    }
    }).then(json => {
    return json.json()
    }).then(data => {
        
        let modal_name=document.getElementById('modal_name');
        let modal_email=document.getElementById('modal_email');
        let modal_job=document.getElementById('modal_job');
        let modal_img=document.getElementById('modal_img');
        let modal_watchee=document.getElementById('modal_watchee');
        modal_name.innerText="name: ";
        modal_email.innerText="email: ";
        modal_job.innerText="Posted job: ";
        modal_watchee.innerText=""
        others_modal_Label.innerText=data.name+" 's profile"

        if(document.querySelectorAll("#modal_img>img").length!=0){
            modal_img.removeChild(document.querySelector("#modal_img>img"))
        }
        if(data.image!=undefined){
            
                let img=document.createElement('img');
                img.style.height="200px"
                img.style.width="200px"
                img.src=data.image
                modal_img.append(img)

        }
        
        

        modal_name.innerText+=data.name;
        modal_email.innerText+=data.email;


        if(data.jobs.length==0){
            modal_job.innerText+="No job posted"
        }
        else{
            for(let i=0; i<data.jobs.length; i++){
                if(i>=1){
                    modal_job.innerText+=", "
                }
                modal_job.innerText+=data.jobs[i].title
                
            }
        }    
        let watcheelist=data.watcheeUserIds

        //2.4.4. Watching / Unwatching

        const watch_btn=document.getElementById('watch_btn')

        let watchflag=true

        for(let i in watcheelist){
            if(watcheelist[i]==myuserid){
                watchflag=false
            }
        }

        watch_btn.onclick=()=>{

            let obj={
                email: data.email,
                turnon:watchflag
            }
            fetch('http://localhost:'+BACKEND_PORT+'/user/watch',{
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify(obj)
            }).then(json => {
                return json.json()
            }).then(data=>{
                if(data.error){
                    alert(data.error)
                }
                else{
                    if(watchflag==true){
                        alert('watching success!')
                    }
                    else{
                        alert('unwatching success!')
                    }
                    
                }
            })
        }



        if(watcheelist.length==0){
            modal_watchee.innerText+="No one watch him/her"
        }

        for(let i=0; i<watcheelist.length;i++){
            let watcheeId=watcheelist[i];

            fetch('http://localhost:'+BACKEND_PORT+'/user?userId='+watcheeId,{
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
                }
            }).then(json => {
            return json.json()
            }).then(data => {
                modal_watchee.appendChild(nameformat2(data))
                let modal_watchee_txt=document.createElement('span')
                if(i==watcheelist.length-1){
                    modal_watchee_txt.innerText=`(${watcheelist.length} ${watcheelist.length==1?"person":"people"}) watching him/her`
                }
                else{
                    modal_watchee_txt.innerText+=", "
                }
                modal_watchee.appendChild(modal_watchee_txt)


                {

                    let elements = document.querySelectorAll(".username");
                    // Convert the node list into an Array so we can
                    // safely use Array methods with it
                    let elementsArray = Array.prototype.slice.call(elements);
            
                    // Loop over the array of elements
                    elementsArray.forEach(function(elem){
            
                    // Assign an event handler

                    if(elem.dataset.newmodal_flag=='true'){
                        elem.addEventListener("click", function(){
                            let userid=Number(elem.dataset.userid)
                            otherProfile(userid,token,jobdata,myuserid)
                            
                        });
                    }   
                    
                    
                    });
                    
                    
                }

                

                

                
                
            })

        }
        
    })

    
}

function refreshPage(job_arr,userid,token){
    clearInterval(localStorage.getItem("myinterval"+userid))
    fetch('http://localhost:'+BACKEND_PORT+'/job/feed?start=0',{
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
            }).then(json => {
                return json.json()
            }).then(data => {
                if(!data.error) {
                    for(let i = job_arr.length-1;i>0;i--){
                        document.getElementById('job_ul').removeChild(document.querySelectorAll(".joblist_li")[i])
                    }
                    tojob(data,userid,token);
                }
                
            })
}


function isEmail(str){ 
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; 
    return reg.test(str); 
    } 

function randomNum(minNum,maxNum){ 
        switch(arguments.length){ 
            case 1: 
                return parseInt(Math.random()*minNum+1,10); 
            break; 
            case 2: 
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
            break; 
                default: 
                    return 0; 
                break; 
        } 
    } 

function logout(token,job_arr){
    fetch('http://localhost:'+BACKEND_PORT+'/job/feed?start=0',{
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
            }).then(json => {
                return json.json()
            }).then(data => {
                if(!data.error) {
                    for(let i = job_arr.length-1;i>0;i--){
                        document.getElementById('job_ul').removeChild(document.querySelectorAll(".joblist_li")[i])
                    }
                }
            })
    document.getElementById('profile_content').style.display="none"
    document.getElementById('addUpdate').style.display="none"
    document.getElementById('job').style.display="none";
    document.getElementById('logout_btn').style.display="none";
    document.getElementById('login').style.display="block";
}
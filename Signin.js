import React,{useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../../StoryApp';
import M from 'materialize-css';

const Signin = () =>{
        const {state, dispatch} = useContext(UserContext);
        const history = useHistory();
       const [email, setEmail] = useState("");
       const [password, setPassword] = useState("");
       const PostData = () =>{
         if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
           M.toast({html: "Opps..Invalid Email", classes:"#c62828 red darken-3"});
           return
         }
   
           fetch("/signin", {
               method:"post",
                headers:{
                  "Content-Type" : "application/json"
                },
                body: JSON.stringify({

                  email,
                  password
                })
               })
               .then(res=>res.json())
               .then(data=>{
                   console.log(data);

                 if(data.error){
                   M.toast({html: data.error, classes:"#c62828 red darken-3"})
                  
                 }
                 else{
                   localStorage.setItem("jwt", data.token);
                   localStorage.setItem("user", JSON.stringify(data.user))
                   dispatch({type:"USER", payload:data.user})
                   M.toast({html: "Yupp!!..Successfuly Signed-in..", classes:"#388e3c green darken-2"})
                   history.push("/");
                 }
   
               })
               .catch(err=>{
                console.log(err)
               })
       
   
       }
    return(
        <div className ="mycard">
            <div className="card auth-card input-field">
          <h3>StoryTales</h3>
          <input 
          type ="text" placeholder = "email"
          value={email}
          onChange = {(e) => setEmail(e.target.value)}
          />

        <input 
          type ="password" placeholder = "password"
          value={password}
          onChange = {(e) => setPassword(e.target.value)}
          />
          <button className="btn waves-effect waves-light"
          onClick={()=>PostData()}>
              Login
         </button>
         <h5>
             <Link to="/signup">
                 Opps!! Don't have an Account??
             </Link>
         </h5>
         <h6>
                <Link to="/reset">Forgot password ?</Link>
            </h6>
      </div>
        </div>
    );
}

export default Signin;
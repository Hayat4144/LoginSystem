import {React, useState} from 'react'

function Register() {
   const  [username,setName] = useState('');
   const  [password,setPassword] = useState('');
    
   const NameChange = (e)=>{
       setName(e.target.value);
   }
   const passwordChange = (e)=>{
       setPassword(e.target.value);
   }
   const register=  async (e) =>{
        e.preventDefault();
        const response = await fetch('http://localhost:11000/register', {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({
                username,
                password,
            })
        } ).then((res)=> res.json());
        if(response.status==='ok'){
            console.log('successfule')
        }
        else{
            // alert(response.error);
            const errorShow = document.getElementById('demo');
            errorShow.innerText = response.error;
        }
   }
    return (
        <>
                <h1>Register</h1>
                <p id="demo" style={{color:'red'}}></p>
                <form action="/register" onSubmit={register} method="POST" id="register">
                    Username:
                    <input type="text" name="username" value={username} onChange={NameChange} id="username" placeholder="Enter your name"/>
                    Password:
                    <input type="password" value={password} name="password" onChange={passwordChange} id="password" placeholder="Enter your password"/>
                    <button type="submit" id="register">Register</button>
                </form>
        </>
    )
}

export default Register

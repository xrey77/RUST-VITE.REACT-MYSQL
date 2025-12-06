import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Mfa from "./Mfa.tsx";
import jQuery from "jquery";
import axios from 'axios';

const api = axios.create({
  baseURL: "http://127.0.0.1:3000",
  headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'}
})

export default function Login() {
   const [username, setUsername] = useState<string>('');
   const [password, setPassword] = useState<string>('')
   const [message, setMessage] = useState<string>('');
   const [isdiabled, setIsdisabled] = useState(false);
   const navigate = useNavigate();

   const submitLogin = async (event: any) => {
    event.preventDefault();
    setMessage('please wait...');
    setIsdisabled(true);
    const jsonData =JSON.stringify({ username: username, password: password });
    await api.post("auth/signin", jsonData)
    .then((res: any) => {
            setMessage(res.data.message);
            if (res.data.qrcodeurl != null) {
                window.sessionStorage.setItem('USERID',res.data.id);
                window.sessionStorage.setItem('TOKEN',res.data.token);
                window.sessionStorage.setItem('ROLE',res.data.roles);
                window.sessionStorage.setItem('USERPIC',res.data.userpic);
                jQuery("#loginReset").trigger("click");
                setIsdisabled(false);
                jQuery("#mfaModal").trigger("click");
            } else {
                window.sessionStorage.setItem('USERID',res.data.id);
                window.sessionStorage.setItem('USERNAME',res.data.username);
                window.sessionStorage.setItem('TOKEN',res.data.token);                        
                window.sessionStorage.setItem('ROLE',res.data.roles);
                let pix: any = `http://127.0.0.1:3000/assets/users/${res.data.userpic}`;
                window.sessionStorage.setItem('USERPIC',pix);
                setIsdisabled(false);
                jQuery("#loginReset").trigger('"click')
                closeLogin;
                navigate('/'); 
                location.reload();
            }
      }, (error: any) => {
          if (error.response) {
            setMessage(error.response.data.message);
          } else {
            setMessage(error.message);
          }
          setTimeout(() => {
              setMessage('');
              setIsdisabled(false);
            }, 3000);
            return;
    });    
  }

  const closeLogin = (event: any) => {
    event.preventDefault();
    setIsdisabled(false);    
    setMessage('');
    setUsername('');
    setPassword('');
  }

  return (
    <>
<div className="modal fade" id="staticLogin" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticLoginLabel" aria-hidden="true">
  <div className="modal-dialog modal-sm modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header bg-violet">
        <h1 className="modal-title text-white fs-5" id="staticLoginLabel">User's Login</h1>
        <button onClick={closeLogin} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form onSubmit={submitLogin} autoComplete="off">
        <div className="mb-3">
          <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="form-control border-secondary border-emboss" disabled={isdiabled} autoComplete='off' placeholder="enter Username"/>
        </div>          
        <div className="mb-3">
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="form-control border-secondary border-emboss" disabled={isdiabled} autoComplete='off' placeholder="enter Password"/>
        </div>          
        <div className="mb-3">
          <button type="submit" className="btn btn-violet text-white mx-2" disabled={isdiabled}>login</button>
          <button id="loginReset" onClick={closeLogin} type="reset" className="btn btn-violet text-white">reset</button>
          <button id="mfaModal" type="button" className="btn btn-warning d-none" data-bs-toggle="modal" data-bs-target="#staticMfa">mfa</button>

          </div>
        </form>
      </div>
      <div className="modal-footer">
        <div className="w-100 text-danger">{message}</div>
      </div>
    </div>
  </div>
</div>    
<Mfa/>
</>
  )
}

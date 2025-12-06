import { useState } from "react"
import jQuery from "jquery";
import axios from 'axios';

const api = axios.create({
   baseURL: "http://127.0.0.1:3000",
   headers: {'Accept': 'application/json',
             'Content-Type': 'application/json'}
})

export default function Mfa() {
  const [otp, setOtp] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const submitMfa = (event: any) => {
    event.preventDefault();

    const userid = sessionStorage.getItem('USERID');
    const token = sessionStorage.getItem('TOKEN');

    setMessage('please wait..');
    const jsonData =JSON.stringify({otp: parseInt(otp,10) });
    api.patch(`auth/mfa/verifytotp/${userid}`, jsonData, {headers: {
      Authorization: `Bearer ${token}`
  }})
    .then((res: any) => {
          setMessage(res.data.message);
            sessionStorage.setItem("USERNAME", res.data.username);
            window.setTimeout(() => {
              setMessage('');
              jQuery("#mfaReset").trigger('click');
              window.location.reload();
            }, 3000);
      }, (error: any) => {
        if (error.response) {
          setMessage(error.response.data.message);            
        } else {
            setMessage(error.message);            
        }
        window.setTimeout(() => {
              setMessage('');
        }, 3000);
        return;

    });        
  }

  const closeMfa = (event: any) => {
    event.preventDefault();
    setMessage('');
    setOtp('');
    sessionStorage.removeItem('USERID');
    sessionStorage.removeItem('USERNAME');
    sessionStorage.removeItem('USERPIC');
    sessionStorage.removeItem('TOKEN');
    location.href="/";
    location.reload();
  }

  const resetMfa = () => {
    setMessage('');
    setOtp('');    
  }

  return (
    <div className="modal fade" id="staticMfa" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticMfaLabel" aria-hidden="true">
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-info">
            <h1 className="modal-title fs-5 text-dark" id="staticMfaLabel">Multi-Factor Authenticator</h1>
            <button onClick={closeMfa} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
          <form onSubmit={submitMfa} autoComplete="off">
            <div className="mb-3">
              <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} className="form-control border-dark" id="otp" placeholder="enter 6-digin OTP code"/>
            </div>          
            <div className="mb-3">
              <button type="submit" className="btn btn-info mx-2 text-dark">submit</button>
              <button onClick={resetMfa} type="reset" className="btn btn-info text-dark">reset</button>
            </div>
          </form>            
          </div>
          <div className="modal-footer">
            <div className="w-100 text-center text-danger">{message}</div>
          </div>
        </div>
      </div>
    </div>    
  )
}
        

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import { loginWithOTP, sendOtp,sendOtpLogin, resendOtp} from "./../Redux/Actions/userActions";


const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(60);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendTimerId, setResendTimerId] = useState(null);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo, isOtpSent, isOtpResend } = userLogin;


  useEffect(() => {
    if (userInfo) {
      history.push("/");
    }
  }, [userInfo, history]);

  useEffect(() => {
    return () => {
      clearInterval(resendTimerId);
    };
  }, [resendTimerId]);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateOTP = () => {
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setOtpError("OTP must be a 6-digit number");
      return false;
    }
    setOtpError("");
    return true;
  };

  const sendOtpHandler = async (e) => {
    e.preventDefault();
    if (validateEmail()) {
      const isOtpSentSuccessfully = await dispatch(sendOtpLogin(email));
      if (isOtpSentSuccessfully) {
        startResendTimer();
        setOtp("");
      }
    }
  };

  const resendOtpHandler = async (e) => {
    e.preventDefault();
    if (validateEmail()) {
      const isOtpResentSuccessfully = await dispatch(resendOtp(email));
    if (isOtpResentSuccessfully) {
      startResendTimer();
      setOtp("");
    }
    }
  };


  const startResendTimer = () => {
    setResendDisabled(true);
  
    let timerId = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  
    // Store the timer ID in the state
    setResendTimerId(timerId);
  
    setTimeout(() => {
      clearInterval(timerId);
      setResendDisabled(false);
      setResendTimer(60);
    }, 60000);

  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (validateOTP()) {
      dispatch(loginWithOTP(email, otp));
      setOtp("");
    }
    
  };

  return (
    <>
            
      <div className="container d-flex flex-column justify-content-center align-items-center login-center">
     
        {error && <Message variant="alert-danger">{error}</Message>}
        
        {!(isOtpSent || isOtpResend) ? (
          <form className="Login col-md-8 col-lg-4 col-11" onSubmit={sendOtpHandler}autoComplete="on"> 
          
             <img alt="logo" src="https://cattaingroup.com/wp-content/uploads/2021/08/Cattain-White-Text-Logo-1.png" ></img>
              <br></br>
              <br></br>
              <h2 style={{ color: "white" }}>Employee Login</h2>
             {loading && <Loading />}
            <input
              type="email"
              placeholder="Enter Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderColor: emailError ? 'red' : 'initial' }}
            />
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
            <button type="submit">Send OTP</button>
          </form>
        ) : (

          <form className="Login col-md-8 col-lg-4 col-11" onSubmit={submitHandler}>
            <img alt="logo" src="https://cattaingroup.com/wp-content/uploads/2021/08/Cattain-White-Text-Logo-1.png" ></img>
            <p><b>OTP sent to Email</b></p>
            <input
              type="email"
              placeholder={email}
              disabled
              
            />
            {loading && <Loading />}
            <input
              type="number"
              placeholder="Enter OTP"
              minLength={6}
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ borderColor: otpError ? 'red' : 'initial' }}
            />
            
            {otpError && <p style={{ color: "red" }}>{otpError}</p>}
            <button type="submit">Verify OTP</button>
            <button
              type="button"
              onClick={resendOtpHandler} 
              disabled={resendDisabled}
              style={{ opacity: resendDisabled ? 0.5 : 1 }}
            >
              Resend OTP ({resendTimer}s)
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Login;

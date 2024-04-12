import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import { sendOtp, registerWithOTP, loginWithOTP, resendOtp } from "./../Redux/Actions/userActions";
import Header from "./../components/Header";

const Register = ({ location, history }) => {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(60);

  const dispatch = useDispatch();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo, isOtpSent, isOtpResend } = userLogin;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateMobile = () => {
    const mobileRegex = /^[0-9]{10}$/; // Assuming a 10-digit mobile number
    if (!mobileRegex.test(mobile)) {
      setMobileError("Invalid mobile number");
      return false;
    }
    setMobileError("");
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
    if (validateEmail() && validateMobile()) {
      await dispatch(sendOtp(name, email, mobile));
      startResendTimer();
    }
  };

  const resendOtpHandler = async (e) => {
    e.preventDefault();
    if (validateEmail()) {
      await dispatch(resendOtp(email));
      startResendTimer();
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (validateOTP()) {
      dispatch(loginWithOTP(email, otp));
      setOtp("");
    }
  };

  const startResendTimer = () => {
    setResendDisabled(true);
    let timerId = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    setTimeout(() => {
      clearInterval(timerId);
      setResendDisabled(false);
      setResendTimer(60);
    }, 60000);
  };

  return (
    <>
      
      <div className="container d-flex flex-column justify-content-center align-items-center login-center">
        {error && <Message variant="alert-danger">{error}</Message>}
        

        {!isOtpSent ? (
          <form
            className="Login col-md-8 col-lg-4 col-11"
            onSubmit={sendOtpHandler}
            autoComplete="on"
          >
            <img alt="logo" src="https://cattaingroup.com/wp-content/uploads/2021/08/Cattain-White-Text-Logo-1.png" style={{ height:"180px"}}></img>
            <h2 style={{ color: "white" }}>Register</h2>
             {loading && <Loading />}
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ borderColor:  "initial" }}
              required="true"
            />
            <input
              type="number"
              placeholder="Mobile"
              value={mobile}
              minLength={10}
              maxLength={10}
              onChange={(e) => setMobile(e.target.value)}
              style={{ borderColor: emailError ? "red" : "initial" }}
              required="true"
            />
            {mobileError && <p style={{ color: "red" }}>{mobileError}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderColor: emailError ? "red" : "initial" }}
            />
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
            

            <button type="submit">Send Email OTP</button>
            <p>
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
              >
                Have An Account ? <strong>Login</strong>
              </Link>
            </p>
          </form>
        ) : (
          <form
            className="Login col-md-8 col-lg-4 col-11"
            onSubmit={submitHandler}
          >
            <img alt="logo" src="/images/logo.svg" style={{ height:"140px"}}></img>
             <p><b>OTP sent to Email</b></p>
             
            {loading && <Loading />}
            <input
               type="email"
               placeholder="Email"
               value={email}
              disabled
            />

            

            <input
              type="number"
              placeholder="Enter OTP"
              minLength={6}
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ borderColor: otpError ? "red" : "initial" }}
            />
            {otpError && <p style={{ color: "red" }}>{otpError}</p>}
            <button type="submit">Verify OTP</button>
            <button
              type="button"
              onClick={resendOtpHandler}
              disabled={resendDisabled}
              style={{ marginBottom: "10px" }}
            >
              Resend OTP ({resendTimer}s)
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Register;

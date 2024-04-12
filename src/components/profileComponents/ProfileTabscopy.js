import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateUserProfile, getUserDetails } from "../../Redux/Actions/userActions";
import Message from "../LoadingError/Error";
import Toast from "../LoadingError/Toast";
import Loading from "../LoadingError/Loading";
import { toast } from "react-toastify";

const LoginButton = ({ onLogin, onLogout, isLogged, index, loginTime, logoutTime, status, saved, onSave }) => {
  const handleLogin = () => {
    const currentTime = new Date().toLocaleTimeString(); // Get current time
    onLogin(currentTime, index); // Call parent component function to update login time
  };

  const handleLogout = () => {
    const currentTime = new Date().toLocaleTimeString(); // Get current time
    onLogout(currentTime, index); // Call parent component function to update logout time
  };

  return (
    <button className="btn btn-primary" onClick={isLogged ? handleLogout : handleLogin} disabled={ logoutTime !== "" }>
      {loginTime ? "Logout" : "Login"} <br />
     
    </button>
  );
};

const ProfileTabscopy = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [toastId, setToastId] = useState(null); // State to hold toast ID
  const [isLogged, setIsLogged] = useState(false); // State to track login status
  const [savedRows, setSavedRows] = useState([]); // State to track saved rows
  const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
  };

  const dispatch = useDispatch();
  const { id } = useParams();

  const userDetails = useSelector((state) => state.userDetails) || {};
  const { loading, error, user } = userDetails;

  const userUpdateProfileState = useSelector((state) => state.userUpdateProfile);
  const { loading: updateLoading } = userUpdateProfileState || {};

  useEffect(() => {
    dispatch(getUserDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setMobile(user.mobile);
      
      if (user.attendance && Array.isArray(user.attendance)) {
        const formattedAttendance = user.attendance.map(entry => ({
          date: new Date(entry.date).toISOString().split('T')[0], // Convert date to ISO string format (YYYY-MM-DD)
          status: entry.status,
          loginTime: entry.loginTime || "", // Add loginTime property with default value
          logoutTime: entry.logoutTime || "", // Add logoutTime property with default value
          saved: false // Add saved property with default value
        }));
        setAttendanceData(formattedAttendance);
      }
    }
  }, [user]);

  const handleAttendanceChange = (index, key, value) => {
    const updatedAttendance = [...attendanceData];
    updatedAttendance[index][key] = value;
    setAttendanceData(updatedAttendance);
  };

  const handleAddAttendanceRow = () => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceData([...attendanceData, { date: today, status: "", loginTime: "", logoutTime: "", saved: false }]);
  };

  const handleRemoveAttendanceRow = (index) => {
    const updatedAttendance = [...attendanceData];
    updatedAttendance.splice(index, 1);
    setAttendanceData(updatedAttendance);
  };

  const onLogin = (time, index) => {
    setIsLogged(true); // Set login status to true
    const updatedAttendance = [...attendanceData];
    updatedAttendance[index].loginTime = time; // Update login time
    setAttendanceData(updatedAttendance); // Update attendance data
  };

  const onLogout = (time, index) => {
    setIsLogged(false); // Set login status to false
    const updatedAttendance = [...attendanceData];
    updatedAttendance[index].logoutTime = time; // Update logout time
    setAttendanceData(updatedAttendance); // Update attendance data
  };

  const onSave = (index) => {
    const updatedAttendance = [...attendanceData];
    updatedAttendance[index].saved = true; // Set saved status to true
    setAttendanceData(updatedAttendance); // Update attendance data
    setSavedRows([...savedRows, index]); // Add index to savedRows
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ id: user._id, name, email, mobile, password, attendance: attendanceData }));
    if (!toast.isActive(toastId)) {
      setToastId(toast.success("Attendance Updated", Toastobjects));
    }
    // Disable Save buttons and Date/Status fields of saved rows
    const updatedAttendance = [...attendanceData];
    savedRows.forEach(index => {
      updatedAttendance[index].saved = false; // Reset saved status
    });
    setAttendanceData(updatedAttendance); // Update attendance data
    setSavedRows([]); // Clear saved rows
  };

  return (
    <>
      <Toast />
      {error && <Message variant="alert-danger">{error}</Message>}
      {loading && <Loading />}
      {updateLoading && <Loading />}
      <form className="row form-container" onSubmit={submitHandler}>

        {/* Attendance table */}
        <div className="col-md-12">
          <h3>Attendance</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Login Time</th> {/* New column */}
                <th>Logout Time</th> {/* New column */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((attendance, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="date"
                      value={attendance.date}
                      onChange={(e) =>
                        handleAttendanceChange(index, "date", e.target.value)
                      }
                      disabled={attendance.status} // Disable if saved
                    />
                  </td>
                  <td>
                    <select
                      value={attendance.status}
                      onChange={(e) =>
                        handleAttendanceChange(index, "status", e.target.value)
                      }
                      disabled={attendance.status} // Disable if saved
                    >
                      <option value="">Select Status</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={attendance.loginTime}
                      onChange={(e) =>
                        handleAttendanceChange(index, "loginTime", e.target.value)
                      }
                      disabled={true}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={attendance.logoutTime}
                      onChange={(e) =>
                        handleAttendanceChange(index, "logoutTime", e.target.value)
                      }
                      disabled={true}
                    />
                  </td>
                  <td>
                    <LoginButton
                      onLogin={onLogin}
                      onLogout={onLogout}
                      isLogged={isLogged}
                      index={index}
                      loginTime={attendance.loginTime}
                      logoutTime={attendance.logoutTime}
                      status={attendance.status} // Pass status as prop to LoginButton
                      saved={attendance.saved} // Pass saved status as prop to LoginButton
                      onSave={() => onSave(index)} // Pass onSave function as prop to LoginButton
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={handleAddAttendanceRow}>
            Add Row
          </button>
        </div>
        
        <button type="submit" className="btn btn-primary" >Save</button>
      </form>
    </>
  );
};

export default ProfileTabscopy;

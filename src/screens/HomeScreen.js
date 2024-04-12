import React from "react";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import ProfileScreen from "./ProfileScreen";


const HomeScreen = ({ match }) => {
  window.scrollTo(0, 0);
  const keyword = match.params.keyword;
  const pagenumber = match.params.pagenumber;

  return (
    <div>
      <Header />
      <ProfileScreen/>
      <Footer />
    </div>
  );
};

export default HomeScreen;

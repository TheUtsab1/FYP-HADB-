import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useAuthStore from "../src/store/useAuthStore";
import { AboutUs, SpecialMenu } from "./container";

// import { Navbar } from "./components";
import "./App.css";
// import api from "./api";
import Login from "./components/routes/Login";


import { Applayout } from "./Applayout";
import { LandingPage } from "./Page/LandingPage";
import Signup from "./components/routes/Signup";
import VerifyEmail from "./components/routes/VerifyEmail";
import CateringForm from "./container/Laurels/CateringForm";
import Cart from "./container/Cart/Cart";
import Booking from "./container/Booking/Booking";
import Aboutus from "./container/About-Us/about-us";
import FoodDetail from "./container/FoodDetail/FoodDetail";
import TableBooking from "./container/Table-Booking/table-booking";
import Profile from "./container/Profile/Profile";

const App = () => {
    const { setIsUserAuthenticated } = useAuthStore();
  
    useEffect(() => {
      const access = localStorage.getItem("access");
      if (access) {
        setIsUserAuthenticated(true);
      }
    }, [setIsUserAuthenticated]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Applayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="Signup" element={<Signup />} />
            <Route path="Verify" element={<VerifyEmail />} />
            <Route path="Login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            <Route path="aboutUs" element={<AboutUs />} />
            <Route path="about-us" element={<Aboutus />} />
            <Route path="Booking" element={<Booking />} />
            <Route path="table-booking" element={<TableBooking />} />
            <Route path="specialMenu" element={<SpecialMenu />} />
            <Route path="/food/:food_slug" element={<FoodDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="CateringForm" element={<CateringForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>

    // <div>
    //   {/* <Navbar />
    //   <Header />
    //   <AboutUs />
    //   <SpecialMenu />
    //   <Chef />
    //   <Intro />
    //   <Laurels />
    //   <Gallery />
    //   <FindUs />
    //   <Footer />
    //   <SignInPage />
    //   <SignUpPage /> */}
    // </div>
  );
};

export default App;

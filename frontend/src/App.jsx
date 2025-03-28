import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AboutUs, SpecialMenu } from "./container";

// import { Navbar } from "./components";
import "./App.css";
import Login from "./components/routes/Login";

import { Applayout } from "./Applayout";
import { LandingPage } from "./Page/LandingPage";
import Signup from "./components/routes/Signup";
import CateringForm from "./container/Laurels/CateringForm";
import Cart from "./container/Cart/Cart";
import Booking from "./container/Booking/Booking";
import Aboutus from "./container/About-Us/about-us";
import FoodDetail from "./container/FoodDetail/FoodDetail";
import TableBooking from "./container/Table-Booking/table-booking"

const App = () => {
  // const [loggedIn, setLoggedIn] = React.useState(
  //   !!localStorage.getItem("token")
  // );
  // // const [isToken, setIsToken] = React.useState(false)

  // console.log(loggedIn);
  // const token = localStorage.getItem("token");
  // // Check login status from localStorage
  // React.useEffect(() => {
  //   console.log("Checking login status...");
  //   console.log("Token: ", token);
  //   setLoggedIn(!!token); // If token exists and is not empty, set loggedIn to true
  // }, [loggedIn]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Applayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="Signup" element={<Signup />} />
            <Route path="Login" element={<Login />} />
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

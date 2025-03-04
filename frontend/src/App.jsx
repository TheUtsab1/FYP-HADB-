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

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Applayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="Signup" element={<Signup />} />
          <Route path="Login" element={<Login />} />
          <Route path="aboutUs" element={<AboutUs />} />
          <Route path="Booking" element={<Booking />} />
          <Route path="specialMenu" element={<SpecialMenu />} />
          <Route path="Cart" element={<Cart />} />
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

export default App;

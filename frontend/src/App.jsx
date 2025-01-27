import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  AboutUs,
} from "./container";

// import { Navbar } from "./components";
import "./App.css";
import SignInPage from "./components/Auth/LoginPage";
import SignUpPage from "./components/Auth/Register";
import { Applayout } from "./Applayout";
import { LandingPage } from "./Page/LandingPage";

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Applayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="aboutUs" element={<AboutUs />} />
        </Route>
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
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

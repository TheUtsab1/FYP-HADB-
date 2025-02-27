import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AboutUs, SpecialMenu } from "./container";

// import { Navbar } from "./components";
import "./App.css";
import Login from "./components/routes/LoginPage";
// import SignUpPage from "./components/Auth/Register";
import { Applayout } from "./Applayout";
import { LandingPage } from "./Page/LandingPage";
import Register from "./components/routes/Register";
import { MenuItem } from "./components";
import Table from "./components/Table/Table";

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Applayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="aboutUs" element={<AboutUs />} />
          <Route path="specialMenu" element={<SpecialMenu />} />
          <Route path="Table" element={<Table />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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

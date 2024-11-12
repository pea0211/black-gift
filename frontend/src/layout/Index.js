// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header.js';
import Footer from './Footer.js';
import { Outlet } from "react-router-dom";

function Index() {
  return (
      <div>
        <Header />
        <Outlet/>
        <Footer />
      </div>
  );
}

export default Index;

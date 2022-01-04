import * as React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./Header";
import Welcome from "./Welcome";
import Footer from "./Footer";
import Refreshing from "./Refreshing";

function App() {
  return (
    <div>
      <Header />
      <Refreshing />
      <Routes>
        <Route path="/" element={<Welcome />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

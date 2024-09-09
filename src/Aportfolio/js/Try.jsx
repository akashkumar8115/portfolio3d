import React, { useState, useEffect } from "react";
import "../css/Try.css";

const App = () => {
  return (
    <>
      <div className="containers">
        <div className="anim-text">
          {["A", "k", "a", "s", "h", " ", "K", "u", "m", "a", "r"].map(
            (letter, index) => (
              <span key={index}>{letter}</span>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default App;

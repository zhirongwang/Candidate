import { Button } from "@mui/material";
import "./App.css";
import { useState } from "react";
import axios from "axios";

import CandidateFilter from "./components/CandidateFilter";
import CandidateList from "./components/CandidateList";

const URL = "http://localhost:3000/candidate";

function App() {
  const [candidates, setCandidates] = useState([]); // State to manage candidates
  const [selectSkilles, setSelectSkilles] = useState([]); // State to manage selected skills

  const fetchCandidates = async (filters) => {
    const response = await axios.get(URL);
    const data = response.data; // Axios automatically parses JSON
    setCandidates(data.slice(0, 5)); // Update candidates state with fetched data
    console.log(data);
  };

  const fetchFilteredCandidates = async (filters) => {
    setSelectSkilles(filters.skills); // Update selected skills state
    try {
      const response = await axios.post(`${URL}/filter`, filters);

      const data = response.data;
      setCandidates(data.slice(0, 5)); // Update the state with filtered candidates
      console.log("Fetched candidates:", data); // Log the data for debugging
    } catch (error) {
      console.error("Error fetching candidates:", error); // Handle any error
    }
  };

  return (
    <div className="App">
      <CandidateFilter handleFilter={fetchFilteredCandidates} />
      <CandidateList candidates={candidates} selectSkilles={selectSkilles} />
    </div>
  );
}

export default App;

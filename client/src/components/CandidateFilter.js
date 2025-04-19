import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";

const CandidateFilter = ({ handleFilter }) => {
  const [education, setEducation] = useState(""); // Store selected education level
  const [experience, setExperience] = useState(""); // Store selected work experience
  const [skills, setSkills] = useState([]); // State to manage selected skills
  const [skillsList, setSkillsList] = useState([]); // State to manage skills list
  const [loading, setLoading] = useState(false);

  const fetchAvailableSkills = async () => {
    if (loading) return; // Prevent multiple calls if already loading
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/candidate/allskills"
      );
      const skillsList = response.data; // Axios automatically parses JSON
      setSkillsList(skillsList); // Update skills list state with fetched data
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // const fetchAvailableSkills = async () => {
  //   const response = await axios.get(
  //     "http://localhost:3000/candidate/allskills"
  //   );
  //   const skillsList = response.data; // Axios automatically parses JSON
  //   setSkillsList(skillsList); // Update skills list state with fetched data
  //   console.log("skillsList", skillsList);
  // };

  useEffect(() => {
    fetchAvailableSkills();
  }, []); // Empty dependency array to run once on mount

  const handleEducationChange = (event) => {
    setEducation(event.target.value); // Update selected education level
  };
  const handleExperienceChange = (event) => {
    setExperience(event.target.value); // Update selected work experience
  };
  const handleSkillsChange = (event, value) => {
    setSkills(value); // Update selected skills
  };

  return (
    <Grid container spacing={2} sx={{ padding: "1rem" }}>
      {/* Highest Education Dropdown */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Highest Education</InputLabel>
          <Select
            label="Highest Education"
            value={education} // Bind the value to state
            onChange={handleEducationChange} // Handle change event
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0.23);", // Border color styling
              },
              minWidth: 220, // Ensures proper width
            }}
          >
            <MenuItem value="">not required</MenuItem>
            <MenuItem value="High School Diploma">
              High School or higher
            </MenuItem>
            <MenuItem value="Associate's Degree">
              Associate's Degree or higher
            </MenuItem>
            <MenuItem value="Bachelor's Degree">
              Bachelor's Degree or higher
            </MenuItem>
            <MenuItem value="Master's Degree">
              Master's Degree or higher
            </MenuItem>
            <MenuItem value="Doctorate">Doctorate</MenuItem>
            <MenuItem value="Juris Doctor (J.D)">Juris Doctor (J.D)</MenuItem>
            {/* <MenuItem value="Doctorate">Doctorate Degree or higher</MenuItem>
            <MenuItem value="Doctorate">Juris Doctor (J.D) or higher</MenuItem> */}
          </Select>
        </FormControl>
      </Grid>

      {/* Work Experience Dropdown */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Work Experience</InputLabel>
          <Select
            label="Work Experience"
            value={experience} // Bind the value to state
            onChange={handleExperienceChange} // Handle change event
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0.23);", // Border color styling
              },
              minWidth: 220, // Ensures proper width
            }}
          >
            <MenuItem value="0">not required</MenuItem>
            <MenuItem value="1">1+ work experience</MenuItem>
            <MenuItem value="2">2+ work experience</MenuItem>
            <MenuItem value="3">3+ work experience</MenuItem>
            <MenuItem value="4">4+ work experience</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Skills Autocomplete */}
      <Grid item xs={12} sm={6}>
        <Autocomplete
          multiple
          id="skills"
          options={skillsList}
          value={skills}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.23);", // Border color styling
            },
            minWidth: 220, // Ensures proper width
          }}
          onChange={handleSkillsChange}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label="Skills" variant="outlined" />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option}>
                {option}
              </li>
            );
          }}
          // renderOption={(props, option) => (
          //   <li key={option} {...props}>
          //     {option}
          //   </li> // Correct: key is passed separately
          // )}
          disableCloseOnSelect
        />
      </Grid>

      {/* Filter Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleFilter({
              education,
              experience,
              skills,
            });
          }}
        >
          Get the top 5 candidates
        </Button>
      </Grid>
    </Grid>
  );
};

export default CandidateFilter;

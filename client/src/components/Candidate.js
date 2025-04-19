// import React from "react";
// import "./Candidate.css"; // Import the CSS file

// const Candidate = ({ candidate }) => {
//   return (
//     <div className="candidate-card">
//       <h2>{candidate.name}</h2>
//       <p>Email: {candidate.email}</p>
//       <p>Phone: {candidate.phone}</p>
//       <p>Location: {candidate.location}</p>
//       <p>Submitted At: {candidate.submitted_at}</p>
//       <p>Work Availability: {candidate.work_availability.join(", ")}</p>
//       <p>
//         Annual Salary Expectation (Full-time):{" "}
//         {candidate.annual_salary_expectation["full-time"]}
//       </p>
//       <h3>Education:</h3>
//       <ul>
//         <li>
//           <p>Highest Level: {candidate.education.highest_level}</p>
//         </li>
//         {candidate.education.degrees.map((degree, index) => (
//           <li key={index} className="degree-item">
//             <div className="degree-info">
//               <div className="degree-column">
//                 <strong>Degree:</strong> {degree.degree} ({degree.gpa})
//               </div>
//               <div className="degree-column">
//                 <strong>Subject:</strong> {degree.subject}
//               </div>
//               <div className="degree-column">
//                 <strong>School:</strong> {degree.school}
//                 <strong> {degree.isTop50 ? "(Top 50)" : ""} </strong>(
//                 {degree.startDate} - {degree.endDate})
//               </div>
//             </div>
//             <div className="degree-info">
//               <div className="degree-column">
//                 <strong>Original School:</strong> {degree.originalSchool}
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//       <h3>Skills:</h3>
//       <ul className="skills-list">
//         {candidate.skills.map((skill, index) => (
//           <li key={index}>{skill}</li>
//         ))}
//       </ul>
//       <h3>Work Experiences:</h3>
//       <ul>
//         {candidate.work_experiences.map((experience, index) => (
//           <li key={index} className="experience-item">
//             <div className="experience-details">
//               <p className="company">Company: {experience.company}</p>
//               <p className="role">Role: {experience.roleName}</p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Candidate;

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // To add an icon for expand/collapse
import "./Candidate.css"; // Import the CSS file

const Candidate = ({ candidate, selectSkilles }) => {
  return (
    <div className="candidate-card">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel1-content`}
          id={`panel1-header`}
        >
          <Typography variant="h6">
            {candidate.name ? candidate.name : "(Missing name)"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <p>
              <strong>Email:</strong> {candidate.email}
            </p>
            <p>
              <strong>Phone:</strong> {candidate.phone}
            </p>
            <p>
              <strong>Location:</strong> {candidate.location}
            </p>
            <p>
              <strong>Submitted At:</strong> {candidate.submitted_at}
            </p>
            <p>
              <strong>Work Availability:</strong>{" "}
              {candidate.work_availability.join(", ")}
            </p>
            <p>
              <strong>Annual Salary Expectation (Full-time):</strong>{" "}
              {candidate.annual_salary_expectation["full-time"]}
            </p>

            <h3>Education:</h3>
            <ul>
              <li>
                <p>
                  <strong>Highest Level:</strong>{" "}
                  {candidate.education.highest_level}
                </p>
              </li>
              {candidate.education.degrees.map((degree, index) => (
                <li key={index} className="degree-item">
                  <div className="degree-info">
                    <div className="degree-column">
                      <strong>Degree:</strong> {degree.degree} ({degree.gpa})
                    </div>
                    <div className="degree-column">
                      <strong>Subject:</strong> {degree.subject}
                    </div>
                    <div className="degree-column">
                      <strong>School:</strong> {degree.school}
                      <strong> {degree.isTop50 ? "(Top 50)" : ""} </strong>(
                      {degree.startDate} - {degree.endDate})
                    </div>
                  </div>
                  <div className="degree-info">
                    <div className="degree-column">
                      <strong>Original School:</strong> {degree.originalSchool}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <h3>Skills:</h3>
            {/* <ul className="skills-list">
              {candidate.skills.map((skill, index) => (
                <li key={index}>{skill} </li>
              ))}
            </ul> */}

            {/* <ul className="skills-list">
              {candidate.skills.map((skill, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: selectSkilles.includes(skill.tolowerCase())
                      ? "rgba(0, 123, 255, 0.2)" // Highlighted background color if selected
                      : "transparent", // Default background
                    padding: "5px 10px", // Padding for spacing
                    borderRadius: "4px", // Rounded corners for better look
                  }}
                >
                  {skill}
                </li>
              ))}
            </ul> */}
            <ul className="skills-list">
              {candidate.skills.map((skill, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: selectSkilles.some(
                      (selectSkilles) =>
                        selectSkilles.toLowerCase() === skill.toLowerCase()
                    )
                      ? "rgba(0, 123, 255, 0.2)" // Highlighted background color if selected
                      : "transparent", // Default background
                    padding: "5px 10px", // Padding for spacing
                    borderRadius: "4px", // Rounded corners for better look
                  }}
                >
                  {skill}
                </li>
              ))}
            </ul>
            <h3>Work Experiences:</h3>
            <ul>
              {candidate.work_experiences.map((experience, index) => (
                <li key={index} className="experience-item">
                  <div className="experience-details">
                    <p className="company">
                      <strong>Company:</strong> {experience.company}
                    </p>
                    <p className="role">
                      <strong>Role:</strong> {experience.roleName}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Candidate;

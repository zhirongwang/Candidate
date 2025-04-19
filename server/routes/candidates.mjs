import express from "express";
import db from "../db/conn.mjs";
// import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await db.collection("candidate");
  let results = await collection.find().limit(50).toArray();

  res.send(results).status(200);
});

router.get("/allskills", async (req, res) => {
  try {
    const collection = await db.collection("candidate");

    // Perform aggregation to extract all skills and return distinct values
    const results = await collection
      .aggregate([
        { $unwind: "$skills" }, // Unwind the skills array (flattens it)
        { $group: { _id: "$skills" } }, // Group by skills to get unique values
        { $project: { _id: 0, skill: "$_id" } }, // Rename _id to skill for readability and remove _id field
      ])
      .toArray();

    // Map the results to an array of skill names
    const skills = results.map((item) => item.skill.toLowerCase()); // Convert to lowercase

    // Send the response with the array of skills
    res.status(200).send(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

const HighestEducationScore = {
  "High School Diploma": 1,
  "Associate's Degree": 2,
  "Bachelor's Degree": 3,
  "Master's Degree": 4,
  Doctorate: 5,
  "Juris Doctor (J.D)": 5,
};

function getHiherEducationArray(education) {
  const educationScore = HighestEducationScore[education];
  const higherEducationArray = Object.keys(HighestEducationScore).filter(
    (key) => HighestEducationScore[key] >= educationScore
  );
  return higherEducationArray;
}

router.post("/filter", async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { education, experience, skills } = req.body;

    const filterCriteria = {};
    // Only proceed if a valid education is provided
    if (education && HighestEducationScore[education]) {
      const educationValue = HighestEducationScore[education];
      console.log("Filtering by education value:", education, educationValue);

      // Compare the database value to the corresponding value from HighestEducationScore
      filterCriteria["education.highest_level"] = {
        $in: getHiherEducationArray(education),
      };
    }

    // if (experience) {
    //   filterCriteria = experience;
    // }
    // Start building the aggregation pipeline
    const aggregationPipeline = [];

    // Add a stage to check the work_experiences array length
    if (experience) {
      aggregationPipeline.push({
        $addFields: {
          workExperienceCount: { $size: "$work_experiences" }, // Count number of experiences
        },
      });

      // Match candidates whose workExperienceCount is greater than or equal to the requested experience
      aggregationPipeline.push({
        $match: {
          workExperienceCount: { $gte: Number(experience) },
        },
      });
    }

    // Match documents based on filter criteria (education, experience, skills)
    if (Object.keys(filterCriteria).length > 0) {
      aggregationPipeline.push({
        $match: filterCriteria,
      });
    }

    // // Add a $project stage to calculate the number of matched skills
    if (skills && Array.isArray(skills) && skills.length > 0) {
      aggregationPipeline.push({
        $addFields: {
          matchingSkillsCount: {
            // Count how many skills match between the document's skills and the passed skills
            $size: {
              $filter: {
                input: "$skills", // The skills array in the document
                as: "docSkill", // Alias for each skill in the document
                cond: {
                  // Use a regex pattern to make the matching case-insensitive
                  $in: [
                    {
                      $toLower: "$$docSkill", // Convert document skill to lowercase
                    },
                    skills.map((skill) => skill.toLowerCase()), // Convert each filter skill to lowercase
                  ],
                },
              },
            },
          },
          skillMatchScore: {
            // Assign the number of matching skills as the score
            $size: {
              $filter: {
                input: "$skills", // The skills array in the document
                as: "docSkill", // Alias for each skill in the document
                cond: {
                  $in: [
                    {
                      $toLower: "$$docSkill", // Convert document skill to lowercase
                    },
                    skills.map((skill) => skill.toLowerCase()), // Convert each filter skill to lowercase
                  ],
                },
              },
            },
          },
        },
      });
    }

    // top50 score
    aggregationPipeline.push({
      $addFields: {
        top50Count: {
          $size: {
            $filter: {
              input: "$education.degrees", // The degrees array in the document
              as: "degree", // Alias for each degree in the array
              cond: {
                $eq: ["$$degree.isTop50", true], // Check if isTop50 is true
              },
            },
          },
        },
      },
    });

    // Add a $project stage to calculate the education score based on highest_level
    aggregationPipeline.push({
      $addFields: {
        educationDegreeScore: {
          $switch: {
            branches: [
              {
                case: {
                  $eq: ["$education.highest_level", "High School Diploma"],
                },
                then: HighestEducationScore["High School Diploma"],
              },
              {
                case: {
                  $eq: ["$education.highest_level", "Associate's Degree"],
                },
                then: HighestEducationScore["Associate's Degree"],
              },
              {
                case: {
                  $eq: ["$education.highest_level", "Bachelor's Degree"],
                },
                then: HighestEducationScore["Bachelor's Degree"],
              },
              {
                case: { $eq: ["$education.highest_level", "Master's Degree"] },
                then: HighestEducationScore["Master's Degree"],
              },
              {
                case: { $eq: ["$education.highest_level", "Doctorate"] },
                then: HighestEducationScore["Doctorate"],
              },
              {
                case: {
                  $eq: ["$education.highest_level", "Juris Doctor (J.D)"],
                },
                then: HighestEducationScore["Juris Doctor (J.D)"],
              },
            ],
            default: 0, // In case highest_level is not found
          },
        },
        gpaScore: {
          $let: {
            vars: {
              firstDegree: { $arrayElemAt: ["$education.degrees", 0] }, // Get the first element of the degrees array
            },
            in: {
              // Check if gpa exists, if not, assign 0 as the default value
              $toDouble: {
                $ifNull: [
                  {
                    $arrayElemAt: [
                      {
                        $split: ["$$firstDegree.gpa", "-"], // Split GPA range by dash
                      },
                      1, // Get the second part (upper bound)
                    ],
                  },
                  0, // Default value if gpa doesn't exist
                ],
              },
            },
          },
        },
      },
    });

    aggregationPipeline.push({
      $addFields: {
        totalScore: {
          $add: [
            { $toDouble: { $ifNull: ["$educationDegreeScore", 0] } }, // Default 0 if null
            { $toDouble: { $ifNull: ["$gpaScore", 0] } }, // Default 0 if null
            { $toDouble: { $ifNull: ["$top50Count", 0] } }, // Default 0 if null
            {
              $multiply: [
                { $toDouble: { $ifNull: ["$matchingSkillsCount", 0] } },
                10,
              ],
            }, // Default 0 if null
          ],
        },
      },
    });

    // Sort by totalScore in descending order and limit to top 10 candidates
    aggregationPipeline.push(
      {
        $sort: { totalScore: -1 }, // Sort by totalScore in descending order
      },
      {
        $limit: 10, // Limit the results to top 10 candidates
      }
    );
    console.log("aggregationPipeline", filterCriteria, aggregationPipeline);
    const candidates = await db
      .collection("candidate")
      .aggregate(aggregationPipeline)
      .toArray();

    if (candidates.length === 0) {
      return res.status(404).send({
        message: "No candidates found with the given filter criteria.",
      });
    }

    res.status(200).send(candidates); // Send filtered candidates
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export default router;

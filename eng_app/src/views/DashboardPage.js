import React, { useState, useEffect } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axiosInstance from "../axiosInstance";

import InteractionModal from "../modals/InteractionModal";
import AssessmentModal from "../modals/AssessmentModal";
import SubmissionModal from "../modals/SubmissionModal";

ChartJS.register(...registerables);

function DashboardPage() {
  // Count predictions for charts
  const [predictionCounts, setPredictionCounts] = useState({
    Pass: 0,
    Fail: 0,
    Withdrawn: 0,
    Distinction: 0,
  });

  // Generate organic and random data progression of clicks for the line graph
  const generateRandomData = () => {
    let data = [];
    let value = 0;
    for (let i = 0; i < 123; i++) {
      // Random increase, higher at the start and end
      let increase = Math.random() * 500 + 100;
      if (i < 20 || i > 100) increase *= 1.5; // Increase more at the start and end

      value += increase;
      value = Math.min(value, 43530); // Ensure it doesn't exceed the maximum
      data.push(value);
    }
    return data;
  };

  const lineGraphData = {
    labels: Array.from({ length: 123 }, (_, i) => i - 10), // Days from -10 to 112
    datasets: [
      {
        label: "Total Cumulative Interactions",
        data: generateRandomData(),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const commonChartData = {
    labels: ["Fail", "Withdrawn", "Pass", "Distinction"],
    datasets: [
      {
        data: ["Fail", "Withdrawn", "Pass", "Distinction"].map(
          (status) => predictionCounts[status] || 0
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
      },
    ],
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [StudentinteractionChartData, setStudentInteractionChartData] =
    useState(null);
  const [courseInteractions, setCourseInteractions] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseInteractions(
        selectedCourse.moduleCode,
        selectedCourse.presentationCode
      );
    }
  }, [selectedCourse]);

  useEffect(() => {
    axiosInstance
      .get("/api/courses")
      .then((response) => {
        const courses = response.data.accessible_courses.map((course) => ({
          moduleCode: course[0],
          presentationCode: course[1],
        }));
        setAvailableCourses(courses);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      const courseCompositeCode = `${selectedCourse.moduleCode}-${selectedCourse.presentationCode}`;
      fetchStudents(courseCompositeCode);
    }
  }, [selectedCourse]);

  const fetchCourseInteractions = (moduleCode, presentationCode) => {
    axiosInstance
      .get(
        `/api/courseinteractions?module_code=${moduleCode}&presentation_code=${presentationCode}`
      )
      .then((response) => {
        setCourseInteractions(response.data.interaction_data);
      })
      .catch((error) =>
        console.error("Error fetching course interactions:", error)
      );
  };

  const interactionChartData = {
    labels: courseInteractions.map((interaction) => interaction.date),
    datasets: [
      {
        label: "Interaction count per day",
        data: courseInteractions.map((interaction) => interaction.total_clicks),
        fill: false,
        borderColor: "rgb(53, 162, 235)",
        tension: 0.1,
      },
    ],
  };

  const handleCourseSelection = (courseCompositeCode) => {
    console.log("Handlecourse");
    const [moduleCode, presentationCode] = courseCompositeCode.split("-");
    const selected = availableCourses.find(
      (course) =>
        course.moduleCode === moduleCode &&
        course.presentationCode === presentationCode
    );
    setSelectedCourse(selected);
  };

  function handleShowInteractions(studentId) {
    fetchStudentInteractions(studentId).then((interactions) => {
      const chartData = prepareStudentInteractionChartData(interactions);
      console.log(chartData);
      setStudentInteractionChartData(chartData);
      setIsInteractionModalOpen(true);
    });
  }

  function prepareStudentInteractionChartData(interactions) {
    const aggregatedData = aggregateInteractionsByDay(interactions);
    const sortedLabels = Object.keys(aggregatedData).sort(
      (a, b) => parseFloat(a) - parseFloat(b)
    );

    return {
      labels: sortedLabels,
      datasets: [
        {
          label: "Interaction Clicks",
          data: sortedLabels.map((label) => aggregatedData[label]),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  }

  // Make interactions cumulative based on previous day, to show evolution of interactions
  function aggregateInteractionsByDay(interactions) {
    var prevday = -200;
    const result = {};
    interactions.forEach((interaction) => {
      const day = interaction.date;
      result[day] = (result[prevday] || 0) + interaction.sum_click;
      prevday = day;
    });
    console.log(result);
    return result;
  }

  // Fetch a students interaction history
  function fetchStudentInteractions(studentId) {
    return new Promise((resolve, reject) => {
      if (!selectedCourse) {
        reject("No selected course");
        return;
      }

      const url = `/api/studentinteractions?student_id=${studentId}&code_module=${selectedCourse.moduleCode}&code_presentation=${selectedCourse.presentationCode}`;

      axiosInstance
        .get(url)
        .then((response) => {
          resolve(response.data.student_interactions);
          console.log(response.data.student_interactions);
        })
        .catch((error) => {
          console.error("Error fetching interactions: ", error);
          reject(error);
        });
    });
  }

  function fetchStudents(courseCompositeCode) {
    const [moduleCode, presentationCode] = courseCompositeCode.split("-");
    setLoading(true);
    axiosInstance
      .get(
        `/api/studentids?module_code=${moduleCode}&presentation_code=${presentationCode}`
      )
      .then((response) => {
        const studentIDs = response.data.student_ids;

        axiosInstance
          .post("/api/predict", { student_ids: studentIDs })
          .then((predictionResponse) => {
            let studentsData = studentIDs.map((id, index) => ({
              id,
              finalResult: predictionResponse.data.student_ids[index],
            }));

            // Sort students by prediction, prioritizing "Withdrawn" and "Fail"
            studentsData.sort((a, b) => {
              if (a.finalResult === b.finalResult) return 0;
              if (a.finalResult === "Withdrawn" || a.finalResult === "Fail")
                return -1;
              if (b.finalResult === "Withdrawn" || b.finalResult === "Fail")
                return 1;
              return 0;
            });

            // Update chart data
            const newPredictionCounts = studentsData.reduce((acc, student) => {
              acc[student.finalResult] = (acc[student.finalResult] || 0) + 1;
              return acc;
            }, {});
            setPredictionCounts(newPredictionCounts);
            setStudents(studentsData);
          })
          .catch((predictionError) => {
            console.error("Error fetching predictions: ", predictionError);
          });
      })
      .catch((error) => {
        console.error("Error fetching student IDs: ", error);
        setError(error.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function fetchStudentSubmissions(studentId) {
    if (!selectedCourse) return;
    const url = `/api/submissions?student_id=${studentId}&code_module=${selectedCourse.moduleCode}&code_presentation=${selectedCourse.presentationCode}`;

    axiosInstance
      .get(url)
      .then((response) => {
        setStudentSubmissions(response.data.student_interactions);
      })
      .catch((error) => {
        console.error("Error fetching submissions: ", error);
      });
  }

  function fetchStudentPerformance(studentId) {
    if (!selectedCourse) return;
    const url = `/api/studentassessment?student_id=${studentId}&code_module=${selectedCourse.moduleCode}&code_presentation=${selectedCourse.presentationCode}`;

    axiosInstance
      .get(url)
      .then((response) => {
        console.log("data", response.data);
        setStudentPerformance(response.data?.student_assessments);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  return (
    <div style={{ padding: "20px" }}>
      <Grid container justifyContent="space-between" alignItems="center">
        {/* Dashboard Title */}
        <Grid item>
          <Typography variant="h4">Dashboard</Typography>
        </Grid>

        {/* Course Day Information */}
        <Grid item>
          <Typography variant="h5" align="center">
            132 days into the course
          </Typography>
        </Grid>

        {/* Course Selection Dropdown */}
        <Grid item>
          <FormControl variant="outlined" style={{ minWidth: 120 }}>
            <InputLabel id="course-selection-label">Select Course</InputLabel>
            <Select
              labelId="course-selection-label"
              id="course-selection"
              value={
                selectedCourse
                  ? `${selectedCourse.moduleCode}-${selectedCourse.presentationCode}`
                  : ""
              }
              onChange={(e) => handleCourseSelection(e.target.value)}
              label="Select Course"
            >
              {availableCourses.map((course, index) => (
                <MenuItem
                  key={index}
                  value={`${course.moduleCode}-${course.presentationCode}`}
                >
                  {course.moduleCode} - {course.presentationCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={6}>
          <Line data={interactionChartData} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ width: "50%" }}>
            <Pie data={commonChartData} />
          </div>
        </Grid>
      </Grid>

      <h2>Student Predictions, showing at-risk students first</h2>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table aria-label="Student predictions through LightGBM model, showing at-risk students first">
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell align="right">Predicted Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell component="th" scope="row">
                    {student.id}
                  </TableCell>
                  <TableCell align="right">{student.finalResult}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => {
                        fetchStudentPerformance(student.id);
                        setIsModalOpen(true);
                      }}
                    >
                      Show Assessments
                    </Button>
                    <Button onClick={() => handleShowInteractions(student.id)}>
                      Show Interactions
                    </Button>
                    <Button
                      onClick={() => {
                        fetchStudentSubmissions(student.id);
                        setIsSubmissionModalOpen(true);
                      }}
                    >
                      Show Submissions
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AssessmentModal
        open={isModalOpen}
        data={studentPerformance}
        onClose={() => setIsModalOpen(false)}
      />
      <InteractionModal
        open={isInteractionModalOpen}
        chartData={StudentinteractionChartData}
        onClose={() => setIsInteractionModalOpen(false)}
      />
      <SubmissionModal
        open={isSubmissionModalOpen}
        data={studentSubmissions}
        onClose={() => setIsSubmissionModalOpen(false)}
      />
    </div>
  );
}

export default DashboardPage;

import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
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
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "../axiosInstance";

ChartJS.register(...registerables);

function CustomModal({ data, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%", // Set a fixed width
          maxWidth: "80%", // Adjusted to 80% for better screen fit
          bgcolor: "white",
          border: "1px solid #ddd",
          borderRadius: 8,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          p: 4,
          overflowX: "auto", // Allow horizontal scrolling
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bgcolor="white"
        >
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="center"
            bgcolor="white"
          >
            <Typography variant="h6">Assessment History</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {Array.isArray(data) && data.length > 0 ? (
          <TableContainer
            style={{
              backgroundColor: "white",
              overflowX: "auto", // Allow horizontal scrolling
              maxHeight: "400px", // Set a fixed height
              overflowY: "auto", // Allow vertical scrolling
            }}
          >
            <Table stickyHeader aria-label="student performance data">
              <TableHead>
                <TableRow>
                  <TableCell>Assessment Type</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">ID Assessment</TableCell>
                  <TableCell align="right">Score</TableCell>
                  <TableCell align="right">Weight</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {item.assessment_type}
                    </TableCell>
                    <TableCell align="right">{item.date}</TableCell>
                    <TableCell align="right">{item.id_assessment}</TableCell>
                    <TableCell align="right">{item.score}</TableCell>
                    <TableCell align="right">{item.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No data available</p>
        )}
      </Box>
    </Modal>
  );
}

function DashboardPage() {
  // Generating student mock data
  const studentData = Array.from({ length: 20 }, (_, index) => ({
    id: Math.floor(Math.random() * (19999 - 11111 + 1)) + 11111,
    finalResult: ["Pass", "Fail", "Withdraw", "Distinction"][
      Math.floor(Math.random() * 4)
    ],
    confidence: Math.floor(Math.random() * 28) + 55, // Random confidence between 60-80
  }));

  // Count predictions for charts
  const predictionCounts = studentData.reduce((acc, student) => {
    acc[student.finalResult] = (acc[student.finalResult] || 0) + 1;
    return acc;
  }, {});

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
    labels: ["Fail", "Withdraw", "Pass", "Distinction"],
    datasets: [
      {
        data: ["Fail", "Withdraw", "Pass", "Distinction"].map(
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

  useEffect(() => {
    fetchStudents();
  }, []);

  function fetchStudents() {
    setLoading(true);
    axiosInstance
      .get("/api/studentids?module_code=FFF&presentation_code=2014B")
      .then((response) => {
        let studentsData = response.data.student_ids.map((id) => ({
          id,
          confidence: Math.floor(Math.random() * 28) + 55, // Random confidence between 55-82
          finalResult: ["Pass", "Fail", "Withdraw", "Distinction"][
            Math.floor(Math.random() * 4)
          ],
        }));
        setStudents(studentsData);
      })
      .catch((error) => {
        console.error("Error fetching student IDs: ", error);
        setError(error.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function fetchStudentPerformance(studentId, codeModule, codePresentation) {
    const url = `http://localhost:5000/api/studentassessment?student_id=${studentId}&code_module=${codeModule}&code_presentation=${codePresentation}`;
    const token = localStorage.getItem("token"); // Get token from localStorage

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token in Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setStudentPerformance(data?.student_assessments);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  return (
    <div style={{ padding: "20px" }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h4">Dashboard</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="center">
            Course day 112
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">Course code: AAA 2014J</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={6}>
          <Bar data={commonChartData} />
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

      <Typography variant="h6" align="center" style={{ marginTop: "20px" }}>
        Total Online Learning Environment interactions per day
      </Typography>
      <div style={{ maxWidth: "60%", margin: "auto" }}>
        <Line data={lineGraphData} />
      </div>

      <h2>Student Predictions</h2>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table aria-label="student predictions">
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell align="right">Confidence (%)</TableCell>
              <TableCell align="right">Predicted Result</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student.id}
                  onClick={() => {
                    fetchStudentPerformance(student?.id, "FFF", "2014B");
                    setIsModalOpen(true); // Open the modal here
                  }}
                >
                  <TableCell component="th" scope="row">
                    {student?.id}
                  </TableCell>
                  <TableCell align="right">{student.confidence}</TableCell>
                  <TableCell align="right">{student.finalResult}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <CustomModal
        open={isModalOpen}
        data={studentPerformance}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default DashboardPage;

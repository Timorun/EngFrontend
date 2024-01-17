import React from "react";
import {
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function AssessmentModal({ data, open, onClose }) {
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

export default AssessmentModal;

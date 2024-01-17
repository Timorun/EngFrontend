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

function InteractionModal({ data, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
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
            <Typography variant="h6">Student Interaction Data</Typography>
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
            <Table stickyHeader aria-label="student interaction data">
              <TableHead>
                <TableRow>
                  <TableCell>Days since Course started</TableCell>
                  <TableCell align="right">Interaction clicks sum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((interaction, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {interaction.date}
                    </TableCell>
                    <TableCell align="right">{interaction.sum_click}</TableCell>
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

export default InteractionModal;

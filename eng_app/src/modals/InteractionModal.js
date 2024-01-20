import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Line } from "react-chartjs-2";

function InteractionModal({ open, chartData, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Student Interactions</DialogTitle>
      <DialogContent>
        {chartData ? (
          <Line data={chartData} />
        ) : (
          <p>No interaction data available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InteractionModal;

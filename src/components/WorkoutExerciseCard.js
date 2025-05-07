// components/WorkoutExerciseCard.js
import React from "react";
import { Box, Typography, TextField } from "@mui/material";

const WorkoutExerciseCard = ({
  exercise,
  progress,
  onChange,
  gif,
  howTo,
  benefits,
}) => {
  return (
    <Box mt={2}>
      {gif && (
        <img
          src={gif}
          alt={exercise}
          style={{ width: "100%", maxWidth: "300px", borderRadius: "8px" }}
        />
      )}

      <TextField
        label="Sets"
        type="number"
        value={progress?.sets || ""}
        onChange={(e) => onChange("sets", e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Reps"
        type="text"
        value={progress?.reps || ""}
        onChange={(e) => onChange("reps", e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Weight (kg)"
        type="number"
        value={progress?.weight || ""}
        onChange={(e) => onChange("weight", e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />

      <Typography variant="body2" fontWeight="bold" mt={2}>
        How to Do It:
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {howTo}
      </Typography>

      <Typography variant="body2" fontWeight="bold" mt={2}>
        Benefits:
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {benefits}
      </Typography>
    </Box>
  );
};

export default WorkoutExerciseCard;

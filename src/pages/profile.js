import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Grid,
  Divider,
  Paper,
} from "@mui/material";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    age: "",
    sex: "",
    weight: "",
    height: "",
    activityLevel: "",
    fitnessGoal: "",
    experience: "", // ✅ already here
    trainingStyle: "",
    trainingDays: "",
    equipment: [],
    weakPoints: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setUserData((prev) => {
      let updatedEquipment = [...prev.equipment];
      if (checked) {
        updatedEquipment.push(value);
      } else {
        updatedEquipment = updatedEquipment.filter((item) => item !== value);
      }
      return { ...prev, equipment: updatedEquipment };
    });
  };

  const saveProgressSnapshot = (newData) => {
    const progressHistory = JSON.parse(localStorage.getItem('progressHistory')) || [];

    const snapshot = {
      date: new Date().toISOString(),
      weight: newData.weight,
      height: newData.height,
      activityLevel: newData.activityLevel,
      fitnessGoal: newData.fitnessGoal,
      experience: newData.experience,
      trainingDays: newData.trainingDays,
    };

    progressHistory.push(snapshot);
    localStorage.setItem('progressHistory', JSON.stringify(progressHistory));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        const refresh = await fetch(`/api/get-user?email=${updatedUser.email}`);
        const freshUser = await refresh.json();

        setUserData(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
        saveProgressSnapshot(freshUser);
        alert("✅ Profile updated successfully!");
      } else {
        alert("❌ Update failed.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={4} sx={{ mt: 5, p: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
          🧍‍♂️ My Fitness Profile
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleUpdate}>
          <Grid container spacing={4}>
            {/* Personal Info */}
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Full Name" name="name" value={userData.name} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth disabled label="Email (Locked)" name="email" value={userData.email} sx={{ mb: 2 }} />
              <TextField fullWidth label="Age" name="age" type="number" value={userData.age} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth label="Weight (kg)" name="weight" type="number" value={userData.weight} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth label="Height (cm)" name="height" type="number" value={userData.height} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth label="Training Days/Week" name="trainingDays" type="number" value={userData.trainingDays} onChange={handleChange} sx={{ mb: 2 }} />
            </Grid>

            {/* Preferences */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold" sx={{ mb: 1 }}>Sex</Typography>
                <RadioGroup row name="sex" value={userData.sex} onChange={handleChange}>
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold" sx={{ mb: 1 }}>Activity Level</Typography>
                <RadioGroup name="activityLevel" value={userData.activityLevel} onChange={handleChange}>
                  <FormControlLabel value="Sedentary" control={<Radio />} label="Sedentary" />
                  <FormControlLabel value="Active" control={<Radio />} label="Active" />
                  <FormControlLabel value="Very Active" control={<Radio />} label="Very Active" />
                </RadioGroup>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold" sx={{ mb: 1 }}>Fitness Goal</Typography>
                <RadioGroup name="fitnessGoal" value={userData.fitnessGoal} onChange={handleChange}>
                  <FormControlLabel value="Muscle Gain" control={<Radio />} label="Muscle Gain" />
                  <FormControlLabel value="Fat Loss" control={<Radio />} label="Fat Loss" />
                  <FormControlLabel value="Strength" control={<Radio />} label="Strength" />
                  <FormControlLabel value="Endurance" control={<Radio />} label="Endurance" />
                </RadioGroup>
              </Box>

              {/* ✅ NEW EXPERIENCE SECTION */}
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold" sx={{ mb: 1 }}>Experience Level</Typography>
                <RadioGroup name="experience" value={userData.experience} onChange={handleChange} row>
                  <FormControlLabel value="Beginner" control={<Radio />} label="Beginner" />
                  <FormControlLabel value="Intermediate" control={<Radio />} label="Intermediate" />
                  <FormControlLabel value="Advanced" control={<Radio />} label="Advanced" />
                </RadioGroup>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography fontWeight="bold" sx={{ mb: 1 }}>Training Style</Typography>
                <RadioGroup row name="trainingStyle" value={userData.trainingStyle} onChange={handleChange}>
                  <FormControlLabel value="Bodybuilding" control={<Radio />} label="Bodybuilding" />
                  <FormControlLabel value="Calisthenics" control={<Radio />} label="Calisthenics" />
                  <FormControlLabel value="Powerlifting" control={<Radio />} label="Powerlifting" />
                  <FormControlLabel value="CrossFit" control={<Radio />} label="CrossFit" />
                </RadioGroup>
              </Box>
            </Grid>

            {/* Equipment */}
            <Grid item xs={12}>
              <Typography fontWeight="bold" sx={{ mb: 1 }}>Available Equipment</Typography>
              <FormGroup row>
                {["Dumbbells", "Barbell", "Kettlebells", "Resistance Bands", "Bodyweight Only"].map((item) => (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox
                        checked={userData.equipment.includes(item)}
                        onChange={handleCheckboxChange}
                        value={item}
                      />
                    }
                    label={item}
                  />
                ))}
              </FormGroup>
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 3, p: 2, fontSize: "1.1rem", borderRadius: 3 }}>
                Save Profile
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;


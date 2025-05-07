import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [progressHistory, setProgressHistory] = useState([]);
  const [workoutProgress, setWorkoutProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [weightInput, setWeightInput] = useState("");

 useEffect(() => {
   const fetchProgress = async () => {
     const user = JSON.parse(localStorage.getItem("user"));
     if (!user?.email) {
       setLoading(false);
       return;
     }

     try {
       const res = await fetch(`/api/get-user?email=${user.email}`);
       const data = await res.json();

       if (data && !data.error) {
         setProgressHistory(data.progressHistory || []);
         setWorkoutProgress(data.progress || {});
         localStorage.setItem("user", JSON.stringify(data)); // update cache
       }
     } catch (err) {
       console.error("Error fetching progress:", err);
     } finally {
       setLoading(false);
     }
   };

   fetchProgress();
 }, []);


  const getLastSnapshot = () => {
    if (progressHistory.length === 0) return null;
    return progressHistory[progressHistory.length - 1];
  };

  const totalWorkoutsCompleted = () => {
    return Object.keys(workoutProgress).length;
  };

  const getWeightProgress = () => {
    if (progressHistory.length < 2) return "Not enough data yet.";
    const firstWeight = parseFloat(progressHistory[0].weight);
    const latestWeight = parseFloat(getLastSnapshot().weight);
    const diff = latestWeight - firstWeight;
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)} kg since starting`;
  };

 const handleLogWeight = async () => {
   const user = JSON.parse(localStorage.getItem("user"));
   if (!user?.email || !weightInput) return;

   const newEntry = {
     date: new Date().toISOString(),
     weight: parseFloat(weightInput),
     height: user.height,
     fitnessGoal: user.fitnessGoal,
     activityLevel: user.activityLevel,
     experience: user.experience,
     trainingDays: user.trainingDays,
   };

   const updatedHistory = [...progressHistory, newEntry];

   try {
     const res = await fetch("/api/save-progress", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         email: user.email,
         progress: workoutProgress,
         progressHistory: updatedHistory,
       }),
     });

     const data = await res.json();
     if (data.success) {
       setProgressHistory(updatedHistory);
       setWeightInput("");
       alert("Weight logged!");
     } else {
       alert("Failed to log weight");
     }
   } catch (error) {
     console.error("Error logging weight:", error);
     alert("Error logging weight");
   }
 };







  const formatExerciseProgressData = () => {
    return Object.entries(workoutProgress).map(([exercise, stats]) => ({
      exercise,
      weight: parseFloat(stats.weight) || 0,
    }));
  };

  return (
    <Container maxWidth="md">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📈 Your Progress Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your goals and see your improvements
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4} mt={3}>
          <Grid item xs={12} sm={6}>
            <Card elevation={6}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                  Current Stats
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {getLastSnapshot() ? (
                  <>
                    <Typography>
                      Weight: <strong>{getLastSnapshot().weight} kg</strong>
                    </Typography>
                    <Typography>
                      Height: <strong>{getLastSnapshot().height} cm</strong>
                    </Typography>
                    <Typography>
                      Goal: <strong>{getLastSnapshot().fitnessGoal}</strong>
                    </Typography>
                  </>
                ) : (
                  <Typography color="text.secondary">No profile data saved yet.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card elevation={6}>
              <CardContent>
                <Typography variant="h6" color="secondary" gutterBottom fontWeight="bold">
                  Weight Progress
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography>{getWeightProgress()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={6}>
              <CardContent>
                <Typography variant="h6" color="success.main" gutterBottom fontWeight="bold">
                  Total Exercises Logged
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h4">{totalWorkoutsCompleted()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Exercise Progress Chart now immediately after Total Exercises Logged */}
          {Object.keys(workoutProgress).length > 0 && (
            <Grid item xs={12}>
              <Card elevation={6}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Exercise Progress Chart
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={formatExerciseProgressData()}
                      layout="vertical"
                      margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        label={{ value: "Weight (kg)", position: "insideBottom", offset: -5 }}
                      />
                      <YAxis type="category" dataKey="exercise" width={120} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="weight" fill="#2196f3" name="Weight Used (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Weight Chart appears just above the input box */}
          {progressHistory.length > 0 && (
            <Grid item xs={12}>
              <Card elevation={6}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Weight Progress Chart
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={progressHistory.map((p) => ({
                        date: new Date(p.date).toLocaleDateString(),
                        weight: parseFloat(p.weight),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={["auto", "auto"]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#1976d2"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Weight Input Below Chart */}
          <Grid item xs={12}>
            <Card elevation={6}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Log Today's Weight
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Enter weight (kg)"
                    className="weight-input"
                    style={{
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      minWidth: "180px",
                      color: "black",
                      backgroundColor: "white",
                      WebkitTextFillColor: "black",
                    }}
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                  />

                  <Button variant="contained" onClick={handleLogWeight}>
                    Log Weight
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;




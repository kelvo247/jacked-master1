import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";

const exercises = {
  "Bench Press": {
    sets: 4,
    reps: "8-12",
    gif: "https://v2.exercisedb.io/image/iqp1jTSfrjuZqa",
    description: `Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.
    1. Grasp the barbell with an overhand grip slightly wider than shoulder-width apart.
    2. Lift the barbell off the rack and hold it directly above your chest with your arms fully extended.
    3. Lower the barbell slowly towards your chest, keeping your elbows tucked in.
    4. Pause for a moment when the barbell touches your chest.
    5. Push the barbell back up to the starting position by extending your arms.
    6. Repeat for the desired number of repetitions.`
  },
  "Incline Dumbbell Press": {
    sets: 4,
    reps: "8-12",
    gif: "https://v2.exercisedb.io/image/XrPHNRx-UCjtpY",
    description: `Sit on an exercise ball with a dumbbell in each hand, palms facing forward.
  Slowly walk your feet forward, rolling your body down the ball until your head, neck, and upper back are supported on the ball.
  Hold the dumbbells at shoulder level, elbows bent and pointing out to the sides.
  Press the dumbbells upward, extending your arms fully.
  Pause for a moment at the top, then slowly lower the dumbbells back to the starting position.
  Repeat for the desired number of repetitions.`
  },

  "Pull-ups": {
    sets: 3,
    reps: "Max Reps",
    gif: "https://v2.exercisedb.io/image/WQ5-QRdODbnGoa",
    description: `Hang from a pull-up bar with a neutral grip (palms facing each other) and your arms fully extended.
    1. Engage your core and squeeze your shoulder blades together.
    2. Pull your body up towards the bar by bending your elbows and driving your elbows down towards your hips.
    3. Continue pulling until your chin is above the bar.
    4. Pause for a moment at the top, then slowly lower your body back down to the starting position with control.
    5. Repeat for the desired number of repetitions.`

  },
  "Barbell Rows": {
    sets: 4,
    reps: "8-12",
    gif: "https://v2.exercisedb.io/image/YnWpyJCnBitJqx",
   description: `Set up an incline bench at a 45-degree angle.
   1. Lie face down on the bench with your chest against the pad and your feet flat on the ground.
   2. Grasp the barbell with an overhand grip, slightly wider than shoulder-width apart.
   3. Keep your back straight and your core engaged.
   4. Pull the barbell towards your chest, squeezing your shoulder blades together.
   5. Pause for a moment at the top, then slowly lower the barbell back to the starting position.
   6. Repeat for the desired number of repetitions.`

  },
  "Squats": {
    sets: 4,
    reps: "10-15",
    gif: "https://v2.exercisedb.io/image/5HeIXdgEkd8Vu9",
    description: `Stand with your feet shoulder-width apart, toes slightly turned out.
    1. Hold the barbell across your upper back, resting it on your traps or rear delts.
    2. Engage your core and keep your chest up as you begin to lower your body down.
    3. Bend at the knees and hips, pushing your hips back and down as if sitting into a chair.
    4. Lower yourself until your thighs are parallel to the ground or slightly below.
    5. Keep your knees in line with your toes and your weight in your heels.
    6. Drive through your heels to stand back up, extending your hips and knees.
    7. Repeat for the desired number of repetitions.`
    },

  "Leg Press": {
    sets: 4,
    reps: "10-15",
    gif: "https://v2.exercisedb.io/image/YlfhFxjdOzbf0w",
    description: `Adjust the seat of the leg press machine so that your knees are slightly bent when your feet are on the footplate.
    1. Sit on the machine with your back against the backrest and your feet flat on the footplate, shoulder-width apart.
    2. Place your toes and the balls of your feet on the footplate, keeping your heels off the edge.
    3. Release the safety handles and push the footplate away from you by extending your knees.
    4. Once your knees are fully extended, slowly lower your heels by flexing your calves.
    5. Pause for a moment at the bottom, then push the footplate back up by extending your calves.
    6. Repeat for the desired number of repetitions.`

  },
  "Overhead Press": {
    sets: 4,
    reps: "8-12",
    gif: "https://v2.exercisedb.io/image/awLpqZ0g5An66T",
    description: "Works shoulders and triceps."
  },
  "Lateral Raises": {
    sets: 3,
    reps: "15-20",
    gif: "https://v2.exercisedb.io/image/5OjXnBTTakjnDQ",
    description: "Isolates the lateral deltoids for broader shoulders."
  },
  "Barbell Curls": {
    sets: 3,
    reps: "12-15",
    gif: "https://v2.exercisedb.io/image/xmgkJkI021fmB7",
    description: "Targets the biceps for arm development."
  },
  "Tricep Dips": {
    sets: 3,
    reps: "12-15",
    gif: "https://v2.exercisedb.io/image/oq2sM6YdfGxOjK",
    description: "Builds triceps and lower chest."
  },
  "Push-ups": {
    sets: 3,
    reps: "Max Reps",
    gif: "https://v2.exercisedb.io/image/S1Uc6FdK5IxqiH",
    description: `Start in a high plank position with your hands wider than shoulder-width apart.
    1. Keep your body in a straight line from head to toe.
    2. Lower your chest towards the ground by bending your elbows, keeping them close to your sides.
    3. Push through your palms to extend your arms and return to the starting position.
    4. Repeat for the desired number of repetitions.`
  },
  "Bodyweight Squats": {
    sets: 3,
    reps: "Max Reps",
    gif: "https://v2.exercisedb.io/image/myHzD0e6bwxRLl",
    description: "Leg strength and endurance with just body weight."
  },
  "Muscle-ups": {
    sets: 3,
    reps: "5-8",
    gif: "https://v2.exercisedb.io/image/kpQEBlRzkC4v0a",
    description: "Advanced upper body explosive strength movement."
  },
  "Pistol Squats": {
    sets: 3,
    reps: "6-10 each leg",
    gif: "https://v2.exercisedb.io/image/0Ey3H0pYHLPr5w",
    description: "Unilateral squat that targets balance and strength."
  },
  "Handstand Practice": {
    sets: 3,
    reps: "Hold as long as possible",
    gif: "https://v2.exercisedb.io/image/qzSVHShW3ue1Ym",
    description: "Improves balance, shoulder stability, and control."
  },
  "Front Lever Drills": {
    sets: 3,
    reps: "Hold or progression",
    gif: "https://v2.exercisedb.io/image/F2QhsdtbM30SL1",
    description: "Core, lat, and upper back tension training."
  },
  "Light Resistance Bands": {
    sets: 3,
    reps: "15-20",
    gif: "https://v2.exercisedb.io/image/UHRaKvAzzHtcsK",
    description: "Warmup or rehab tool for activation and mobility."
  },
  "Stretching": {
    sets: 3,
    reps: "Hold 30s each",
    gif: "https://v2.exercisedb.io/image/a3Xfai3TA7kpH4",
    description: `Stand tall with your feet shoulder-width apart.
    1. Extend your right arm across your chest, placing your left hand on your right elbow.
    2. Gently pull your right arm towards your left shoulder, feeling a stretch in your right shoulder.
    3. Hold the stretch for 15-30 seconds, then release.
    4. Repeat on the other side.`

  },
  "Walking": {
    sets: 1,
    reps: "30 min",
    gif: "https://v2.exercisedb.io/image/4nVClYIPXoZ0bA",
    description: "Low impact cardio that promotes recovery."
  },
  "Core Activation": {
    sets: 3,
    reps: "Plank 30-60s",
    gif: "https://v2.exercisedb.io/image/J2ojCrvZJ6UQx9",
    description: "Activates deep abdominal muscles for stability."
  },
  "Light Dumbbells": {
    sets: 3,
    reps: "12-15 reps",
    gif: "https://v2.exercisedb.io/image/AHtzNHHc0V5F8W",
    description: "Good for warm-up or beginners targeting control."
  },
  "Mobility Work": {
    sets: 3,
    reps: "Dynamic Stretching",
    gif: "https://v2.exercisedb.io/image/Br8LfPhCGjwB41",
    description: `Stand with your feet shoulder-width apart and your hands on your hips.
    1. Bend your knees slightly and lift your heels off the ground, balancing on the balls of your feet.
    2. Keeping your knees bent, rotate your knees in a circular motion, first clockwise and then counterclockwise.
    3. Perform the movement for the desired number of repetitions.`

  }
};
  // ... [rest of the exercises from the updated list] ...



const TrainingPlan = () => {
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});
  const [progressHistory, setProgressHistory] = useState([]);
  const [injured, setInjured] = useState(false);

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem("progress")) || {};
    const storedHistory = JSON.parse(localStorage.getItem("progressHistory")) || [];
    setProgress(storedProgress);
    setProgressHistory(storedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem("progress", JSON.stringify(progress));
    localStorage.setItem("progressHistory", JSON.stringify(progressHistory));
  }, [progress, progressHistory]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      setError("No user found. Please update your profile.");
      setLoading(false);
      return;
    }

    fetch(`/api/get-user?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        generateWorkoutPlan(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        setError("Failed to load training plan.");
        setLoading(false);
      });
  }, [injured]);

  const generateWorkoutPlan = (user) => {
    if (!user) return;
    const { fitnessGoal, trainingStyle, activityLevel, experience } = user;
    let plan = [];

    const powerLiftingDays = [
      { day: "Monday", workout: ["Squats", "Barbell Rows"] },
      { day: "Wednesday", workout: ["Bench Press", "Overhead Press"] },
      { day: "Friday", workout: ["Deadlifts", "Pull-ups"] },
    ];

    const beginnerBodybuilding = [
      { day: "Monday", workout: ["Push-ups", "Incline Dumbbell Press"] },
      { day: "Wednesday", workout: ["Bodyweight Squats", "Pull-ups"] },
      { day: "Friday", workout: ["Overhead Press", "Tricep Dips"] },
    ];

    const intermediateBodybuilding = [
      { day: "Monday", workout: ["Bench Press", "Incline Dumbbell Press", "Push-ups"] },
      { day: "Tuesday", workout: ["Pull-ups", "Barbell Rows"] },
      { day: "Wednesday", workout: ["Squats", "Leg Press"] },
      { day: "Thursday", workout: ["Overhead Press", "Lateral Raises"] },
      { day: "Friday", workout: ["Barbell Curls", "Tricep Dips"] },
    ];

    const endurancePlan = [
      { day: "Monday", workout: ["Push-ups", "Bodyweight Squats", "Walking"] },
      { day: "Wednesday", workout: ["Core Activation", "Mobility Work"] },
      { day: "Friday", workout: ["Stretching", "Light Resistance Bands"] },
    ];

    const calisthenicsAdvanced = [
      { day: "Monday", workout: ["Pull-ups", "Push-ups"] },
      { day: "Tuesday", workout: ["Dips", "Bodyweight Squats"] },
      { day: "Thursday", workout: ["Muscle-ups", "Pistol Squats"] },
      { day: "Saturday", workout: ["Handstand Practice", "Front Lever Drills"] },
    ];

    const rehabPlan = [
      { day: "Monday", workout: ["Mobility Work", "Stretching"] },
      { day: "Wednesday", workout: ["Light Resistance Bands", "Walking"] },
      { day: "Friday", workout: ["Core Activation", "Stretching"] },
    ];

    if (injured) {
      plan = rehabPlan;
    } else {
      if (experience === "Beginner") {
        if (fitnessGoal === "Endurance" || activityLevel === "Sedentary") {
          plan = endurancePlan;
        } else {
          plan = beginnerBodybuilding;
        }
      } else if (experience === "Intermediate") {
        if (fitnessGoal === "Muscle Gain" || trainingStyle === "Bodybuilding") {
          plan = intermediateBodybuilding;
        } else if (fitnessGoal === "Strength" || trainingStyle === "Powerlifting") {
          plan = powerLiftingDays;
        }
      } else if (experience === "Advanced") {
        if (trainingStyle === "Calisthenics") {
          plan = calisthenicsAdvanced;
        } else if (fitnessGoal === "Strength" || trainingStyle === "Powerlifting") {
          plan = powerLiftingDays;
        } else {
          plan = intermediateBodybuilding;
        }
      }
    }

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const fullPlan = daysOfWeek.map(day => {
      const dayWorkout = plan.find(p => p.day === day);
      if (dayWorkout) return dayWorkout;
      if (day === "Saturday" || day === "Sunday") {
        return { day, workout: ["Rest or Active Recovery"] };
      }
      return { day, workout: ["Optional Light Cardio"] };
    });

    setWorkoutPlan(fullPlan);
  };


  const handleProgressChange = (exercise, field, value) => {
    setProgress(prev => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [field]: value,
      },
    }));
  };
const handleSaveProgress = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.email) {
    alert("User not found");
    return;
  }

  const snapshot = {
    date: new Date().toISOString(),
    weight: user.weight,
    height: user.height,
    fitnessGoal: user.fitnessGoal,
    progress: { ...progress },
  };

  const updatedHistory = [...progressHistory, snapshot];

  try {
    const response = await fetch("/api/save-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        progress,
        progressHistory: updatedHistory,
        trainingSession: snapshot, // ✅ this line makes it save to trainingSessions
      }),
    });

    const data = await response.json();
    if (data.success) {
      alert("Progress saved!");
      setProgressHistory(updatedHistory);
    } else {
      alert("Failed to save progress.");
    }
  } catch (error) {
    console.error("Error saving progress:", error);
    alert("An error occurred");
  }
};


  return (
    <Container maxWidth="md">
      <Box mt={5} p={3} textAlign="center">
        <Typography variant="h4" fontWeight="bold">Your Training Plan</Typography>
      </Box>

      <FormControlLabel
        control={<Checkbox checked={injured} onChange={(e) => setInjured(e.target.checked)} />}
        label="I am currently injured"
      />

      <Button variant="contained" color="primary" onClick={handleSaveProgress} sx={{ mt: 2, mb: 2 }}>
        Save Progress
      </Button>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress size={60} /></Box>
      ) : error ? (
        <Typography color="error" textAlign="center" mt={4}>{error}</Typography>
      ) : (
        <Grid container spacing={3} mt={4}>
          {workoutPlan.map((session, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardHeader title={session.day} sx={{ textAlign: "center" }} />
                <CardContent>
                  {session.workout.map((exercise, exIndex) => (
                    <Box key={exIndex} mb={3}>
                      <Button fullWidth variant="outlined" onClick={() => setExpanded(expanded === exercise ? null : exercise)}>
                        {exercise}
                      </Button>
                      <Collapse in={expanded === exercise}>
                        <Box mt={2}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Box
                                sx={{
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  padding: 2,
                                  backgroundColor: "#f9f9f9",
                                  height: "100%",
                                }}
                              >
                                <Typography variant="h6" gutterBottom>
                                  About this exercise
                                </Typography>
                                <Typography variant="body2">
                                  {exercises[exercise]?.description || "No description available."}
                                </Typography>
                              </Box>
                            </Grid>
                            {exercises[exercise]?.gif?.trim() && (
                              <Grid item xs={12} sm={6}>
                                <img
                                  src={exercises[exercise].gif}
                                  alt={exercise}
                                  style={{ width: "100%", borderRadius: "8px" }}
                                />
                              </Grid>
                            )}
                          </Grid>

                          <TextField
                            label="Sets"
                            type="number"
                            value={progress[exercise]?.sets || ""}
                            onChange={(e) => handleProgressChange(exercise, "sets", e.target.value)}
                            fullWidth sx={{ mt: 2 }}
                          />
                          <TextField
                            label="Reps"
                            type="text"
                            value={progress[exercise]?.reps || ""}
                            onChange={(e) => handleProgressChange(exercise, "reps", e.target.value)}
                            fullWidth sx={{ mt: 2 }}
                          />
                          <TextField
                            label="Weight (kg)"
                            type="number"
                            value={progress[exercise]?.weight || ""}
                            onChange={(e) => handleProgressChange(exercise, "weight", e.target.value)}
                            fullWidth sx={{ mt: 2 }}
                          />
                        </Box>
                      </Collapse>

                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default TrainingPlan;
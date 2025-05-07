import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  weight: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  activityLevel: {
    type: String,
    enum: ['Sedentary', 'Active', 'Very Active'],
    default: 'Sedentary',
  },
  fitnessGoal: {
    type: String,
    enum: ['Muscle Gain', 'Fat Loss', 'Strength', 'Endurance'],
    required: true,
  },
  experience: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  trainingStyle: {
    type: String,
    enum: ['Bodybuilding', 'Calisthenics', 'Powerlifting', 'CrossFit'],
    required: true,
  },
  trainingDays: { type: Number, min: 1, max: 7, required: true },
  equipment: { type: [String], default: [] },
  weakPoints: { type: [String], default: [] },
  trainingPlan: { type: Object, default: {} },
  mealPlan: { type: Object, default: {} },

  // ✅ Workout progress per exercise
  progress: {
    type: Map,
    of: {
      weight: Number,
      reps: Number,
      date: { type: Date, default: Date.now },
    },
    default: {},
  },

  // ✅ Add this inside the schema!
  progressHistory: [
    {
      date: { type: Date, default: Date.now },
      weight: Number,
      height: Number,
      activityLevel: String,
      fitnessGoal: String,
      experience: String,
      trainingDays: Number,
    },
  ],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

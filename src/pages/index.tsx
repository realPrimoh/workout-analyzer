import { useState } from 'react';
import { Grid, Typography, List, ListItem, ListItemText, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Papa from 'papaparse';
import { createTheme } from "@material-ui/core/styles";
import { v4 as uuidv4 } from 'uuid';

interface Week {
  number: number;
  startDate: Date;
  endDate: Date;
  sets: number;
  dates: Set<Date>;
  year: number;
  primaryMusclesWorked: Map<String, number>;
  secondaryMusclesWorked: Map<String, number>;
}

interface Exercise {
  exercise_name: String;
  primary_muscle: String;
  secondary_muscle: String;
  equipment_needed: String;
}

const exercises = new Map<String, Exercise>([
  ["Overhead Press (Barbell)", { exercise_name: "Overhead Press (Barbell)", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "Barbell" }],
  ["Overhead Press (Dumbbell)", { exercise_name: "Overhead Press (Dumbbell)", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "Dumbbell" }],
  ["Triceps Dip", { exercise_name: "Triceps Dip", primary_muscle: "Triceps", secondary_muscle: "Chest, Shoulders", equipment_needed: "Bodyweight" }],
  ["Bicep Curl (Dumbbell)", { exercise_name: "Bicep Curl (Dumbbell)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Dumbbell" }],
  ["Triceps Extension", { exercise_name: "Triceps Extension", primary_muscle: "Triceps", secondary_muscle: "Shoulders", equipment_needed: "Barbell, EZ-Bar" }],
  ["Bicep Curl (Machine)", { exercise_name: "Bicep Curl (Machine)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Machine" }],
  ["Tricep Pushdown", { exercise_name: "Tricep Pushdown", primary_muscle: "Triceps", secondary_muscle: "None", equipment_needed: "Cable" }],
  ["Chin Up", { exercise_name: "Chin Up", primary_muscle: "Lats", secondary_muscle: "Biceps, Shoulders", equipment_needed: "Bar" }],
  ["Pull Up", { exercise_name: "Pull Up", primary_muscle: "Lats", secondary_muscle: "Biceps, Shoulders", equipment_needed: "Bar" }],
  ["Shrug (Barbell)", { exercise_name: "Shrug (Barbell)", primary_muscle: "Traps", secondary_muscle: "None", equipment_needed: "Barbell" }],
  ["Deadlift (Barbell)", { exercise_name: "Deadlift (Barbell)", primary_muscle: "Back", secondary_muscle: "Glutes, Hamstrings", equipment_needed: "Barbell" }],
  ["Seated Row (Cable)", { exercise_name: "Seated Row (Cable)", primary_muscle: "Lats", secondary_muscle: "Biceps, Shoulders", equipment_needed: "Cable" }],
  ["Incline Bench Press (Barbell)", { exercise_name: "Incline Bench Press (Barbell)", primary_muscle: "Chest", secondary_muscle: "Shoulders, Triceps", equipment_needed: "Barbell" }],
  ["Close Grip Incline Press", { exercise_name: "Close Grip Incline Press", primary_muscle: "Chest", secondary_muscle: "Triceps", equipment_needed: "Barbell" }],
  ["Incline Dumbbell Press", { exercise_name: "Incline Dumbbell Press", primary_muscle: "Chest", secondary_muscle: "Shoulders", equipment_needed: "Dumbbell" }],
  ["Deadlift High Pull (Barbell)", { exercise_name: "Deadlift High Pull (Barbell)", primary_muscle: "Back", secondary_muscle: "Legs", equipment_needed: "Barbell" }],
  ["Strict Military Press (Barbell)", { exercise_name: "Strict Military Press (Barbell)", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "Barbell" }],
  ["Behind-the-Neck Press", { exercise_name: "Behind-the-Neck Press", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "Barbell" }],
  ["Arnold Press (Dumbbell)", { exercise_name: "Arnold Press (Dumbbell)", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "Dumbbell" }],
  ["Hammer-Grip Pull Up", { exercise_name: "Hammer-Grip Pull Up", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Pull-up Bar" }],
  ["Lateral Raise (Dumbbell)", { exercise_name: "Lateral Raise (Dumbbell)", primary_muscle: "Shoulders", secondary_muscle: "None", equipment_needed: "Dumbbell" }],
  ["Lat Pulldown (Cable)", { exercise_name: "Lat Pulldown (Cable)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Cable machine" }],
  ["Seated Row (Cable, One-Arm)", { exercise_name: "Seated Row (Cable, One-Arm)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Cable machine" }],
  ["Crunch (Machine)", { exercise_name: "Crunch (Machine)", primary_muscle: "Abdominals", secondary_muscle: "None", equipment_needed: "Machine" }],
  ["Incline Bench Press (Dumbbell)", { exercise_name: "Incline Bench Press (Dumbbell)", primary_muscle: "Chest", secondary_muscle: "Triceps", equipment_needed: "Dumbbell" }],
  ["Bench Press - Close Grip (Barbell)", {
    exercise_name: "Bench Press - Close Grip (Barbell)",
    primary_muscle: "Chest",
    secondary_muscle: "Triceps",
    equipment_needed: "Barbell"
  }],
  ["Hammer Curl (Dumbbell)", {
    exercise_name: "Hammer Curl (Dumbbell)",
    primary_muscle: "Biceps",
    secondary_muscle: "Forearms",
    equipment_needed: "Dumbbell"
  }],
  ["Reverse Curl (Barbell)", {
    exercise_name: "Reverse Curl (Barbell)",
    primary_muscle: "Forearms",
    secondary_muscle: "Biceps",
    equipment_needed: "Barbell"
  }],
  ["Incline Lying Triceps Extension", {
    exercise_name: "Incline Lying Triceps Extension",
    primary_muscle: "Triceps",
    secondary_muscle: "Chest",
    equipment_needed: "None"
  }],
  ["Triceps Extension (Dumbbell)", {
    exercise_name: "Triceps Extension (Dumbbell)",
    primary_muscle: "Triceps",
    secondary_muscle: "None",
    equipment_needed: "Dumbbell"
  }],
  ["Bicep Curl (Barbell)", {
    exercise_name: "Bicep Curl (Barbell)",
    primary_muscle: "Biceps",
    secondary_muscle: "Forearms",
    equipment_needed: "Barbell"
  }],
  ["Triceps Pushdown (Cable - Straight Bar)", {
    exercise_name: "Triceps Pushdown (Cable - Straight Bar)",
    primary_muscle: "Triceps",
    secondary_muscle: "None",
    equipment_needed: "Cable machine"
  }],
  ["Bent Over Row - Underhand (Barbell)", {
    exercise_name: "Bent Over Row - Underhand (Barbell)",
    primary_muscle: "Back",
    secondary_muscle: "Biceps",
    equipment_needed: "Barbell"
  }],
  ["Front Crunch", {
    exercise_name: "Front Crunch",
    primary_muscle: "Abdominals",
    secondary_muscle: "None",
    equipment_needed: "None"
  }],
  ["Bench Press (Barbell)", {
    exercise_name: "Bench Press (Barbell)",
    primary_muscle: "Chest",
    secondary_muscle: "Triceps",
    equipment_needed: "Barbell"
  }],
  ["Preacher Curl (Machine)", {
    exercise_name: "Preacher Curl (Machine)",
    primary_muscle: "Biceps",
    secondary_muscle: "Forearms",
    equipment_needed: "Weight machine"
  }],
  ["Seated Dip", {
    exercise_name: "Seated Dip",
    primary_muscle: "Triceps",
    secondary_muscle: "Chest",
    equipment_needed: "Dip machine"
  }],
  ["Cable Kickback", {
    exercise_name: "Cable Kickback",
    primary_muscle: "Triceps",
    secondary_muscle: "None",
    equipment_needed: "Cable machine"
  }],
  ["Seated Leg Raise (Ball)", {
    exercise_name: "Seated Leg Raise (Ball)",
    primary_muscle: "Abdominals",
    secondary_muscle: "Hip flexors",
    equipment_needed: "Exercise ball"
  }],
  ['Face Pull (Cable)', { exercise_name: 'Face Pull (Cable)', primary_muscle: 'Rear Delts', secondary_muscle: 'Traps', equipment_needed: 'Cable Machine' }],
  ['Lateral Raise (Cable)', { exercise_name: 'Lateral Raise (Cable)', primary_muscle: 'Lateral Deltoids', secondary_muscle: 'None', equipment_needed: 'Cable Machine' }],
  ['Preacher Curl (Dumbbell)', { exercise_name: 'Preacher Curl (Dumbbell)', primary_muscle: 'Biceps', secondary_muscle: 'Brachialis', equipment_needed: 'Dumbbell and Preacher Bench' }],
  ['Dumbbell Crunch', { exercise_name: 'Dumbbell Crunch', primary_muscle: 'Rectus Abdominis', secondary_muscle: 'Obliques', equipment_needed: 'Dumbbell' }],
  ['Squat (Barbell)', { exercise_name: 'Squat (Barbell)', primary_muscle: 'Quadriceps', secondary_muscle: 'Glutes, Hamstrings, Calves', equipment_needed: 'Barbell and Power Rack' }],
  ['Bicep Curl (Cable)', { exercise_name: 'Bicep Curl (Cable)', primary_muscle: 'Biceps', secondary_muscle: 'Brachialis', equipment_needed: 'Cable Machine' }],
  ['Lateral Raise (One-Arm)', { exercise_name: 'Lateral Raise (One-Arm)', primary_muscle: 'Lateral Deltoids', secondary_muscle: 'None', equipment_needed: 'Dumbbell' }],
  ['Bicep Curl (One-Arm, Cable)', { exercise_name: 'Bicep Curl (One-Arm, Cable)', primary_muscle: 'Biceps', secondary_muscle: 'Brachialis', equipment_needed: 'Cable Machine' }],
  ['Triceps Extension (Cable)', { exercise_name: 'Triceps Extension (Cable)', primary_muscle: 'Triceps', secondary_muscle: 'None', equipment_needed: 'Cable Machine' }],
  ['Running (Treadmill)', { exercise_name: 'Running (Treadmill)', primary_muscle: 'Cardio', secondary_muscle: 'None', equipment_needed: 'Treadmill' }],
  ['Lateral Raise 1.5 (Dumbell)', { exercise_name: 'Lateral Raise 1.5 (Dumbell)', primary_muscle: 'Lateral Deltoids', secondary_muscle: 'None', equipment_needed: 'Dumbbell' }],
  ['Lat Pulldown (Hammer-grip)', { exercise_name: 'Lat Pulldown (Hammer-grip)', primary_muscle: 'Lats', secondary_muscle: 'Biceps, Middle Back', equipment_needed: 'Cable Machine' }],
  ["Reverse Fly (Dumbbell)", { exercise_name: "Reverse Fly (Dumbbell)", primary_muscle: "Rear Deltoids", secondary_muscle: "Rhomboids", equipment_needed: "Dumbbell" }],
  ["Handstand Push Up", { exercise_name: "Handstand Push Up", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "None" }],
  ["Overhead Press (Dumbell, One-Arm)", { exercise_name: "Overhead Press (Dumbell, One-Arm)", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "Dumbbell" }],
  ["Squat Row (Band)", { exercise_name: "Squat Row (Band)", primary_muscle: "Upper Back", secondary_muscle: "Legs", equipment_needed: "Resistance Band" }],
  ["Bent Over Row (Barbell)", { exercise_name: "Bent Over Row (Barbell)", primary_muscle: "Upper Back", secondary_muscle: "Biceps", equipment_needed: "Barbell" }],
  ["Close Grip push-up", { exercise_name: "Close Grip push-up", primary_muscle: "Triceps", secondary_muscle: "Chest", equipment_needed: "None" }],
  ["Skullcrusher (Barbell)", { exercise_name: "Skullcrusher (Barbell)", primary_muscle: "Triceps", secondary_muscle: "None", equipment_needed: "Barbell" }],
  ["Triceps Extension (Barbell)", { exercise_name: "Triceps Extension (Barbell)", primary_muscle: "Triceps", secondary_muscle: "None", equipment_needed: "Barbell" }],
  ["Band Triceps Pushdown", { exercise_name: "Band Triceps Pushdown", primary_muscle: "Triceps", secondary_muscle: "None", equipment_needed: "Resistance Band" }],
  ["Triceps Extension (Dumbbell, One-Arm)", { exercise_name: "Triceps Extension (Dumbbell, One-Arm)", primary_muscle: "Triceps", secondary_muscle: "None", equipment_needed: "Dumbbell" }],
  ["Lateral Raise (Band)", { exercise_name: "Lateral Raise (Band)", primary_muscle: "Shoulders", secondary_muscle: "None", equipment_needed: "Resistance Band" }],
  ["Upright Row (Barbell)", { exercise_name: "Upright Row (Barbell)", primary_muscle: "Shoulders", secondary_muscle: "None", equipment_needed: "Barbell" }],
  ["Ab Wheel", { exercise_name: "Ab Wheel", primary_muscle: "Abdominals", secondary_muscle: "None", equipment_needed: "None" }],
  ["Ab Circuit", { exercise_name: "Ab Circuit", primary_muscle: "Abdominals", secondary_muscle: "", equipment_needed: "" }],
  ["Plank", { exercise_name: "Plank", primary_muscle: "Abdominals", secondary_muscle: "", equipment_needed: "" }],
  ["Close-Grip Bench Press (Slight Incline)", { exercise_name: "Close-Grip Bench Press (Slight Incline)", primary_muscle: "Triceps", secondary_muscle: "Chest", equipment_needed: "Barbell" }],
  ["Triceps Pushdown (One-arm)", { exercise_name: "Triceps Pushdown (One-arm)", primary_muscle: "Triceps", secondary_muscle: "", equipment_needed: "Gym Cable" }],
  ["Incline Curl (Dumbbell)", { exercise_name: "Incline Curl (Dumbbell)", primary_muscle: "Biceps", secondary_muscle: "", equipment_needed: "Dumbbell" }],
  ["Hammer Curl (One-Arm)", { exercise_name: "Hammer Curl (One-Arm)", primary_muscle: "Brachioradialis", secondary_muscle: "Biceps", equipment_needed: "Dumbbell" }],
  ["Standing Calf Raise (Dumbbell)", { exercise_name: "Standing Calf Raise (Dumbbell)", primary_muscle: "Calves", secondary_muscle: "", equipment_needed: "Dumbbell" }],
  ["Bent-Over Row (Barbell, Strapped)", { exercise_name: "Bent-Over Row (Barbell, Strapped)", primary_muscle: "Middle Back", secondary_muscle: "Biceps", equipment_needed: "Barbell" }],
  ["Triceps Pushdown (One-Arm, Gym Cable)", { exercise_name: "Triceps Pushdown (One-Arm, Gym Cable)", primary_muscle: "Triceps", secondary_muscle: "", equipment_needed: "Gym Cable" }],
  ["Face Pull (Gym Cable)", { exercise_name: "Face Pull (Gym Cable)", primary_muscle: "Middle Back", secondary_muscle: "Shoulders", equipment_needed: "Gym Cable" }],
  ["Leg Press", { exercise_name: "Leg Press", primary_muscle: "Quadriceps", secondary_muscle: "Hamstrings, Calves, Glutes", equipment_needed: "Machine" }],
  ["Lat Pulldown - Underhand (Cable)", { exercise_name: "Lat Pulldown - Underhand (Cable)", primary_muscle: "Lats", secondary_muscle: "Biceps", equipment_needed: "Cable" }],
  ["Iso-Lateral Chest Press (Machine)", { exercise_name: "Iso-Lateral Chest Press (Machine)", primary_muscle: "Chest", secondary_muscle: "Triceps", equipment_needed: "Machine" }],
  ["Iso-Lateral Row (Machine)", { exercise_name: "Iso-Lateral Row (Machine)", primary_muscle: "Middle Back", secondary_muscle: "", equipment_needed: "Machine" }],
  ["Triceps Extension (One-Arm, Gym Cable)", { exercise_name: "Triceps Extension (One-Arm, Gym Cable)", primary_muscle: "Triceps", secondary_muscle: "", equipment_needed: "Gym Cable" }],
  ["Reverse Fly (Machine)", { exercise_name: "Reverse Fly (Machine)", primary_muscle: "Rear Deltoids", secondary_muscle: "Rhomboids", equipment_needed: "Machine" }],
  ["Seated Overhead Press (Dumbbell)", { exercise_name: "Seated Overhead Press (Dumbbell)", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "Dumbbell" }],
  ["Iso-Lateral Shoulder Press", { exercise_name: "Iso-Lateral Shoulder Press", primary_muscle: "Shoulders", secondary_muscle: "", equipment_needed: "" }],
  ["Bicep Curl 21s", { exercise_name: "Bicep Curl 21s", primary_muscle: "Biceps", secondary_muscle: "", equipment_needed: "" }],
  ["Seated Lateral Raise", { exercise_name: "Seated Lateral Raise", primary_muscle: "Shoulders", secondary_muscle: "", equipment_needed: "" }],
  ["Seated Wide-Grip Row (Cable)", { exercise_name: "Seated Wide-Grip Row (Cable)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Cable" }],
  ["Seated Row (One-Arm, 24H Fitness, Hoist)", { exercise_name: "Seated Row (One-Arm, 24H Fitness, Hoist)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "24H Fitness, Hoist" }],
  ["Katana Extension (Cable Cross, One-Arm)", { exercise_name: "Katana Extension (Cable Cross, One-Arm)", primary_muscle: "Triceps", secondary_muscle: "", equipment_needed: "Cable Cross" }],
  ["Triceps Pushdown (Cable Cross, One-Arm)", { exercise_name: "Triceps Pushdown (Cable Cross, One-Arm)", primary_muscle: "Triceps", secondary_muscle: "", equipment_needed: "Cable Cross" }],
  ["Lateral Raise (Machine)", { exercise_name: "Lateral Raise (Machine)", primary_muscle: "Shoulders", secondary_muscle: "", equipment_needed: "Machine" }],
  ["Bicep Curl (One-Arm, Cable Cross)", { exercise_name: "Bicep Curl (One-Arm, Cable Cross)", primary_muscle: "Biceps", secondary_muscle: "", equipment_needed: "Cable Cross" }],
  ["Farmer Walk", { exercise_name: "Farmer Walk", primary_muscle: "Shoulders", secondary_muscle: "Core", equipment_needed: "Dumbbells" }],
  ["Reverse Wrist Curl (Barbell)", { exercise_name: "Reverse Wrist Curl (Barbell)", primary_muscle: "Forearms", secondary_muscle: "Grip", equipment_needed: "Barbell" }],
  ["Wrist Curl (Barbell)", { exercise_name: "Wrist Curl (Barbell)", primary_muscle: "Forearms", secondary_muscle: "Grip", equipment_needed: "Barbell" }],
  ["Hanging Leg Raise", { exercise_name: "Hanging Leg Raise", primary_muscle: "Abdominals", secondary_muscle: "Lower Back", equipment_needed: "Chin-Up Bar" }],
  ["Negative Concentration Curls", { exercise_name: "Negative Concentration Curls", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Dumbbell" }],
  ["Preacher Hammer Curl (Dumbbell)", { exercise_name: "Preacher Hammer Curl (Dumbbell)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Dumbbell" }],
  ["Behind the Back Wrist Curl", { exercise_name: "Behind the Back Wrist Curl", primary_muscle: "Forearms", secondary_muscle: "Grip", equipment_needed: "Barbell" }],
  ["Kneeling Lat Pulldown (One-Arm)", { exercise_name: "Kneeling Lat Pulldown (One-Arm)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Cable" }],
  ["Triceps Extension (Machine)", { exercise_name: "Triceps Extension (Machine)", primary_muscle: "Triceps", secondary_muscle: "Shoulders", equipment_needed: "Machine" }],
  ["Seated Row (Machine)", { exercise_name: "Seated Row (Machine)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Machine" }],
  ["Preacher Curl (Machine Plate-Loaded)", { exercise_name: "Preacher Curl (Machine Plate-Loaded)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Machine" }],
  ["Lat Pulldown (Single Arm, Plate Loaded Hammer Strength)", { exercise_name: "Lat Pulldown (Single Arm, Plate Loaded Hammer Strength)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Machine" }],
  ["Cross-Body Hammer Curl", { exercise_name: "Cross-Body Hammer Curl", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Dumbbells" }],
  ["Preacher Curl (Machine, SC 24H)", { exercise_name: "Preacher Curl (Machine, SC 24H)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Machine" }],
  ["Tricep Pushdown (SC 24H , straight Bar)", { exercise_name: "Tricep Pushdown (SC 24H , straight Bar)", primary_muscle: "Triceps", secondary_muscle: "Shoulders", equipment_needed: "Machine" }],
  ["Seated Hammer Curl (Dumbbell)", { exercise_name: "Seated Hammer Curl (Dumbbell)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Dumbbell" }],
  ["Lat Pulldown (Single Arm)", { exercise_name: "Lat Pulldown (Single Arm)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Cable" }],
  ["Triceps Pushdown (One-Arm, Keiser)", { exercise_name: "Triceps Pushdown (One-Arm, Keiser)", primary_muscle: "Triceps", secondary_muscle: "Shoulders", equipment_needed: "Machine" }],
  ["Preacher Curl (Machine, One-Arm)", { exercise_name: "Preacher Curl (Machine, One-Arm)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Machine" }],
  ["Seated Bicep Curl (Dumbbell)", { exercise_name: "Seated Bicep Curl (Dumbbell)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Dumbbell" }],
  ["Biceps Half Curl (Dumbbell)", { exercise_name: "Biceps Half Curl (Dumbbell)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Dumbbell" }],
  ["Straight Arm Pulldown", { exercise_name: "Straight Arm Pulldown", primary_muscle: "Back", secondary_muscle: "Triceps", equipment_needed: "Cable" }],
  ["Shoulder Press (Plate Loaded)", { exercise_name: "Shoulder Press (Plate Loaded)", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "Plate Loaded" }],
  ["High Incline Bench Press (Dumbbell, 60deg)", { exercise_name: "High Incline Bench Press (Dumbbell, 60deg)", primary_muscle: "Chest", secondary_muscle: "Shoulders", equipment_needed: "Dumbbell" }],
  ["Lying Leg Curl (Machine)", { exercise_name: "Lying Leg Curl (Machine)", primary_muscle: "Hamstrings", secondary_muscle: "Glutes", equipment_needed: "Machine" }],
  ["Lunge (Barbell)", { exercise_name: "Lunge (Barbell)", primary_muscle: "Glutes", secondary_muscle: "Quads", equipment_needed: "Barbell" }],
  ["Leg Press (Nautilus)", { exercise_name: "Leg Press (Nautilus)", primary_muscle: "Quads", secondary_muscle: "Glutes", equipment_needed: "Machine" }],
  ["Stiff Leg Deadlift (Barbell)", { exercise_name: "Stiff Leg Deadlift (Barbell)", primary_muscle: "Hamstrings", secondary_muscle: "Lower Back", equipment_needed: "Barbell" }],
  ["Standing Calf Raise (Machine)", { exercise_name: "Standing Calf Raise (Machine)", primary_muscle: "Calves", secondary_muscle: "Lower Legs", equipment_needed: "Machine" }],
  ["Reverse Fly (Machine, Nautilus)", { exercise_name: "Reverse Fly (Machine, Nautilus)", primary_muscle: "Rear Delts", secondary_muscle: "Traps", equipment_needed: "Machine" }],
  ["Tricep Side Extension (Cbum, One Arm, Gym Cable)", { exercise_name: "Tricep Side Extension (Cbum, One Arm, Gym Cable)", primary_muscle: "Triceps", secondary_muscle: "Shoulders", equipment_needed: "Cable" }],
  ["Ad Press (Dumbbell)", { exercise_name: "Ad Press (Dumbbell)", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "Dumbbell" }],
  ["Seated Row (Machine, One-Arm)", { exercise_name: "Seated Row (Machine, One-Arm)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Machine, One-Arm" }],
  ["Preacher Curl (Barbell)", { exercise_name: "Preacher Curl (Barbell)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Barbell" }],
  ["Seated Overhead Press (Barbell)", { exercise_name: "Seated Overhead Press (Barbell)", primary_muscle: "Shoulders", secondary_muscle: "Triceps", equipment_needed: "Barbell" }],
  ["Leg Press (Single Leg)", { exercise_name: "Leg Press (Single Leg)", primary_muscle: "Quadriceps", secondary_muscle: "Glutes", equipment_needed: "Machine" }],
  ["Bulgarian Split Squat", { exercise_name: "Bulgarian Split Squat", primary_muscle: "Quadriceps", secondary_muscle: "Glutes", equipment_needed: "Dumbbells/Barbell" }],
  ["Seated Leg Press (Machine, Single-Leg)", { exercise_name: "Seated Leg Press (Machine, Single-Leg)", primary_muscle: "Quadriceps", secondary_muscle: "Glutes", equipment_needed: "Machine, Single-Leg" }],
  ["Face Pull (Hoist)", { exercise_name: "Face Pull (Hoist)", primary_muscle: "Shoulders", secondary_muscle: "Upper Back", equipment_needed: "Hoist" }],
  ["Back Extension", { exercise_name: "Back Extension", primary_muscle: "Lower Back", secondary_muscle: "Glutes", equipment_needed: "Machine" }],
  ["Bicep Curl (Alternating Dumbbell)", { exercise_name: "Bicep Curl (Alternating Dumbbell)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Alternating Dumbbell" }],
  ["Triceps Pushdown (One-Arm, Hoist)", { exercise_name: "Triceps Pushdown (One-Arm, Hoist)", primary_muscle: "Triceps", secondary_muscle: "Forearms", equipment_needed: "One-Arm, Hoist" }],
  ["Seated Row (Machine, One-Arm, Hoist)", { exercise_name: "Seated Row (Machine, One-Arm, Hoist)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Machine, One-Arm, Hoist" }],
  ["Seated Leg Raise", { exercise_name: "Seated Leg Raise", primary_muscle: "Abdominals", secondary_muscle: "Hip Flexors", equipment_needed: "Machine" }],
  ["Wide-Grip T Bar Row (Precor)", { exercise_name: "Wide-Grip T Bar Row (Precor)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Precor" }],
  ["Leg Press (Precor)", { exercise_name: "Leg Press (Precor)", primary_muscle: "Quadriceps", secondary_muscle: "Glutes", equipment_needed: "Precor" }],
  ["Triceps Extension (Cable, Hoist, One-Arm)", { exercise_name: "Triceps Extension (Cable, Hoist, One-Arm)", primary_muscle: "Triceps", secondary_muscle: "Forearms", equipment_needed: "Cable, Hoist, One-Arm" }],
  ["Bicep Curl (Hoist, Cable, One-Arm)", { exercise_name: "Bicep Curl (Hoist, Cable, One-Arm)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Hoist, Cable, One-Arm" }],
  ["Incline Triceps Extension (Dumbbell, Skullcrusher, CBUM Style)", { exercise_name: "Incline Triceps Extension (Dumbbell, Skullcrusher, CBUM Style)", primary_muscle: "Triceps", secondary_muscle: "Shoulders", equipment_needed: "Dumbbell" }],
  ["Tricep Side Extension (One-Arm, Cable Face Level, CBUM-style)", { exercise_name: "Tricep Side Extension (One-Arm, Cable Face Level, CBUM-style)", primary_muscle: "Triceps", secondary_muscle: "Shoulders", equipment_needed: "One-Arm, Cable Face Level, CBUM-style" }],
  ["Block Pull", { exercise_name: "Block Pull", primary_muscle: "Back", secondary_muscle: "Glutes", equipment_needed: "Barbell" }],
  ["Low Row (Machine, Precor, One-Arm)", { exercise_name: "Low Row (Machine, Precor, One-Arm)", primary_muscle: "Back", secondary_muscle: "Biceps", equipment_needed: "Machine, Precor, One-Arm" }],
  ["Reverse Fly (Hoist)", { exercise_name: "Reverse Fly (Hoist)", primary_muscle: "Shoulders", secondary_muscle: "Upper Back", equipment_needed: "Hoist" }],
  ["Shrug (Machine)", { exercise_name: "Shrug (Machine)", primary_muscle: "Trapezius", secondary_muscle: "Upper Back", equipment_needed: "Machine" }],
  ["Lateral Raise (Cable Cross)", { exercise_name: "Lateral Raise (Cable Cross)", primary_muscle: "Shoulders", secondary_muscle: "Upper Back", equipment_needed: "Cable Cross" }],
  ["Seated Palms Up Wrist Curl (Dumbbell)", { exercise_name: "Seated Palms Up Wrist Curl (Dumbbell)", primary_muscle: "Forearms", secondary_muscle: "Biceps", equipment_needed: "Dumbbell" }],
  ["Concentration Curl (Dumbbell)", { exercise_name: "Concentration Curl (Dumbbell)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Dumbbell" }],
  ["Incline Dumbbell Curl Reverse 21s", { exercise_name: "Incline Dumbbell Curl Reverse 21s", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Dumbbell" }],
  ["Overhead Triceps Extension (One-Arm, Home Pulley)", { exercise_name: "Overhead Triceps Extension (One-Arm, Home Pulley)", primary_muscle: "Triceps", secondary_muscle: "Shoulders", equipment_needed: "One-Arm, Home Pulley" }],
  ["Scott Curl (Barbell)", { exercise_name: "Scott Curl (Barbell)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Barbell" }],
  ["Preacher Death Curl (Dumbbell)", { exercise_name: "Preacher Death Curl (Dumbbell)", primary_muscle: "Biceps", secondary_muscle: "Forearms", equipment_needed: "Dumbbell" }],
  ["Push-Up (Medicine Ball)", { exercise_name: "Push-Up (Medicine Ball)", primary_muscle: "Chest", secondary_muscle: "Shoulders", equipment_needed: "Medicine Ball" }]
])

export default function Home() {
  const theme = createTheme();

  const [weeks, setWeeks] = useState<Week[]>([]);
  const [files, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<String>('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [filteredWeeks, setFilteredWeeks] = useState<Week[]>([]);
  const [dragging, setDragging] = useState(false);

  const getDefault = async () => {
    try {
      const response = await fetch("/strong-march-2023.csv");
      const blob = await response.blob();
      const csvFile = new File([blob], "strong-march-2023.csv", { type: "text/csv" });
      setFile(csvFile);
      parseCSV(csvFile);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(event.target.files[0].name);
      setFile(file);
      parseCSV(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      setFileName(event.dataTransfer.files[0].name);
      setFile(file);
      parseCSV(file);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data.slice(1); // Remove header row
        const weeksMap = new Map();

        data.forEach((row: any) => {
          const date = new Date(row[0]); // Assuming the date column is the first column
          const exerciseName = row[3]; // Get exercise name
          const exerciseObject: Exercise | undefined = exercises.get(exerciseName);
          if (exerciseObject == undefined) {
            console.log('exercise name', exerciseName);
            console.log('row with failure', row);
          }
          const weekNumber = getWeekNumber(date);
          const weekYear = date.getFullYear();
          const weekNumPlusYear = weekNumber + "-" + weekYear;
          const week: Week = weeksMap.get(weekNumPlusYear) || { number: weekNumber, dates: new Set(), sets: 0, year: weekYear, primaryMusclesWorked: new Map(), secondaryMusclesWorked: new Map() };
          week.dates.add(date);
          if (exerciseObject?.primary_muscle) {
            week.primaryMusclesWorked.set(exerciseObject?.primary_muscle, (week.primaryMusclesWorked.get(exerciseObject?.primary_muscle) ?? 0) + 1)
          }
          if (exerciseObject?.secondary_muscle) {
            week.secondaryMusclesWorked.set(exerciseObject?.secondary_muscle, (week.secondaryMusclesWorked.get(exerciseObject?.secondary_muscle) ?? 0) + 1)
          }
          week.sets += 1;
          weeksMap.set(weekNumPlusYear, week);
        });

        const weeks = Array.from(weeksMap.values());
        setWeeks(weeks);
      }
    });
  };

  const getWeekNumber = (date: Date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  };

  const getFormattedDates = (dates: Set<Date>) => {
    const datesArr = Array.from(dates).sort((a, b) => a.getTime() - b.getTime());
    const startDate = datesArr[0];
    const endDate = datesArr[datesArr.length - 1];
    const startStr = startDate.toLocaleDateString();
    const endStr = endDate.toLocaleDateString();
    if (startStr === endStr) {
      return startStr;
    } else {
      return `${startStr} - ${endStr}`;
    }
  };

  const getYears = () => {
    const yearsSet = new Set<number>();
    weeks.forEach((week) => {
      yearsSet.add(week.dates.values().next().value.getFullYear());
    });
    return Array.from(yearsSet);
  };

  const handleYearClick = (year: number) => {
    const weeksOfYear = weeks.filter((week) => week.year === year);
    setFilteredWeeks(weeksOfYear);
  };

  const opacity = dragging ? 0.5 : 1;

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        {weeks.length > 0 ? (
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h6" align="center" gutterBottom>Workout Analyzer</Typography>
            <Grid container justifyContent="center" alignItems="center" spacing={2} style={{ marginBottom: '1rem' }}>
              {getYears().map((year) => (
                <Grid item key={year}>
                  <Button variant="contained" color="primary" onClick={() => handleYearClick(year)}>{year}</Button>
                </Grid>
              ))}
            </Grid>
            <List>
              {filteredWeeks.map((week: Week) => (
                <ListItem key={week.number}>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <ListItemText
                      primary={`Week ${week.number}: ${getFormattedDates(week.dates)}`}
                      secondary={`${week.sets} sets`}
                    />
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Primary Muscle</TableCell>
                            <TableCell>Number of Sets</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.from(week.primaryMusclesWorked.entries()).map(([muscle, count]) => (
                            <TableRow key={uuidv4()}>
                              <TableCell>{muscle}</TableCell>
                              <TableCell>{count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                marginBottom: -100,
                marginTop: -100
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Paper style={{
                padding: theme.spacing(3),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity
              }} component="label">
                <input
                  id="upload-file"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <Typography>Drag and drop a file or click to upload</Typography>
              </Paper>
            </div>
            <Paper className="container"
              onClick={() => getDefault()}
            >
              <Typography>
                Don't have a file to upload?
                Click this to use Priyam's data.
              </Typography>
            </Paper>
          </div>
        )}
      </Grid>
    </Grid>
  );
}

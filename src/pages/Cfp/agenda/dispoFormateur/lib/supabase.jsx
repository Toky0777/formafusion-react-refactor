

const supabaseUrl = "";
const supabaseAnonKey = "";

export const supabase = "";

export const Trainer = {
  id: " ",
  name: " ",
  email: " ",
  created_at: " ",
};

export const DailyAvailability = {
  id: " ",
  date: " ",
  trainer_id: "",
  utilization_percentage:" ",
  total_trainers_working:" ",
  total_trainers_available:" ",
  created_at: " ",
  updated_at: " ",
};

export const WorkingDaysPolicy = {
  id: " ",
  monday: " ",
  tuesday: " ",
  wednesday: " ",
  thursday: " ",
  friday: " ",
  saturday: " ",
  sunday: " ",
  created_at: " ",
  updated_at: " ",
};

export const Holiday = {
  id: " ",
  date: " ",
  name: " ",
  is_recurring: " ",
  created_at: " ",
};

export const TrainerAbsence = {
  id: " ",
  trainer_id: " ",
  start_date: " ",
  end_date: " ",
  reason: " ",
  created_at: " ",
};

export const TrainingSession = {
  id: " ",
  trainer_id: " ",
  title: " ",
  description: " ",
  session_date: " ",
  start_time: " ",
  end_time: " ",
  location: " ",
  participants_count:" ",
  status: 'planifié' | 'en cours' | 'terminé' | 'annulé',
  created_at: " ",
  updated_at: " ",
};
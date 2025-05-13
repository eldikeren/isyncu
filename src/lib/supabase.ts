import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://oapvkhzngfccdcyvolcw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hcHZraHpuZ2ZjY2RjeXZvbGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA2MzcsImV4cCI6MjA2MjY1NjYzN30._Lw7UQ8rH7-RBDmmgLU_EYp_W7zGXooePP9Bb_pvmHc';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
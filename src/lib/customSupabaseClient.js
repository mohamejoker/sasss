import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lehadyjjbdabjbpwmjwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaGFkeWpqYmRhYmpicHdtandsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTYyNzQsImV4cCI6MjA2NjE5MjI3NH0.ZL1jSzhnhCRLw2ZaXLjxIPjsc3GorzBEcaMRtKHtNgw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
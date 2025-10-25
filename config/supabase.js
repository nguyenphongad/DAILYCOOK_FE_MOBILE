import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://tmjgiocquihbupedxyxx.supabase.co'; // Thay bằng URL Supabase  
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtamdpb2NxdWloYnVwZWR4eXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNTE1ODIsImV4cCI6MjA3NjkyNzU4Mn0.VAbog_E133icj-8NvZMltPsoGMu7_foe7lkRCMjztQo'; // Thay bằng Anon Key  

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

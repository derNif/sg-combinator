import { createServerSupabaseClient } from './supabase-server';

export async function testSupabaseClient() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    console.log('Session test:', data ? 'Success' : 'No session');
    if (error) {
      console.error('Error:', error);
    }
    return { success: !error, data, error };
  } catch (err) {
    console.error('Test failed:', err);
    return { success: false, error: err };
  }
} 
import { createClient } from '@supabase/supabase-js';

// Supabase configuration using provided project credentials
export const SUPABASE_PROJECT_ID = 'kwsggrleduxypakhrvoo';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_ITV7IHtW1O9tt7EBHak13w_HhnsRh-v';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface BookingAppointment {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  project_type: string;
  budget: string;
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
  timeline?: string;
  status?: 'new' | 'confirmed' | 'in_review' | 'completed';
  created_at?: string;
  source?: string;
}

export interface BookingResult {
  success: boolean;
  data?: any;
  error?: string;
  targetTable?: string;
  persistedLocally?: boolean;
}

/**
 * Save booking or appointment details to Supabase.
 * Gracefully tries standard table names ('appointments', 'bookings', 'project_inquiries', 'inquiries')
 * and always stores a local copy in localStorage as a resilient fallback.
 */
export async function saveBookingToSupabase(
  booking: BookingAppointment
): Promise<BookingResult> {
  const payload = {
    name: booking.name.trim(),
    email: booking.email.trim(),
    phone: booking.phone?.trim() || null,
    project_type: booking.project_type,
    budget: booking.budget,
    message: booking.message?.trim() || null,
    preferred_date: booking.preferred_date || null,
    preferred_time: booking.preferred_time || null,
    timeline: booking.timeline || '2-4 Weeks',
    status: booking.status || 'new',
    created_at: new Date().toISOString(),
    source: booking.source || 'portfolio_website',
  };

  // Always keep a local resilient copy in browser storage
  try {
    const existing = JSON.parse(localStorage.getItem('nexora_saved_bookings') || '[]');
    existing.unshift({ ...payload, local_id: `local-${Date.now()}` });
    localStorage.setItem('nexora_saved_bookings', JSON.stringify(existing.slice(0, 50)));
  } catch (err) {
    console.warn('Could not cache locally:', err);
  }

  // Attempt insertion into Supabase tables
  const targetTables = ['appointments', 'bookings', 'project_inquiries', 'inquiries', 'contacts'];
  let lastError: any = null;

  for (const table of targetTables) {
    try {
      const { data, error } = await supabase.from(table).insert([payload]).select();

      if (!error) {
        return {
          success: true,
          data: data?.[0] || payload,
          targetTable: table,
        };
      }

      // If table does not exist (PGRST204 or 42P01 error code), try next table name
      lastError = error;
      console.warn(`Supabase insert to "${table}" returned:`, error.message);
    } catch (err: any) {
      lastError = err;
      console.warn(`Network exception inserting to "${table}":`, err?.message);
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Could not connect to database table. Saved locally.',
    persistedLocally: true,
  };
}

/**
 * Fetch past bookings if table is accessible (or return local copies)
 */
export async function getRecentBookings(): Promise<BookingAppointment[]> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    // fallback to local storage
  }

  try {
    return JSON.parse(localStorage.getItem('nexora_saved_bookings') || '[]');
  } catch {
    return [];
  }
}

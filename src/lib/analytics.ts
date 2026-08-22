import { createClient } from '@supabase/supabase-js';

// Supabase Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client if variables are present
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Metric key definitions
export interface AnalyticsData {
  home_visits: number;
  cv_views: number;
  portfolio_views: number;
  cv_downloads: number;
  portfolio_downloads: number;
  cv_duration_total: number;
  cv_duration_count: number;
  portfolio_duration_total: number;
  portfolio_duration_count: number;
}

// Initial mock/seed data to make the Bento grid dashboard look gorgeous immediately
const DEFAULT_SEED_DATA: AnalyticsData = {
  home_visits: 1240,
  cv_views: 482,
  portfolio_views: 739,
  cv_downloads: 184,
  portfolio_downloads: 295,
  cv_duration_total: 21690, // seconds spent in total
  cv_duration_count: 482,
  portfolio_duration_total: 44340,
  portfolio_duration_count: 739,
};

// Retrieve local storage key
const STORAGE_KEY = 'portfolio_telemetry_metrics';

/**
 * Formats a duration in seconds into a human-readable format (e.g. "1m 45s", "30s").
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0s';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

// Retrieve local metrics
export function getLocalMetrics(): AnalyticsData {
  if (typeof window === 'undefined') return DEFAULT_SEED_DATA;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
    return DEFAULT_SEED_DATA;
  }
  try {
    return JSON.parse(stored) as AnalyticsData;
  } catch {
    return DEFAULT_SEED_DATA;
  }
}

// Helper to save local metrics
function saveLocalMetrics(data: AnalyticsData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

/**
 * Increment a specific metric count.
 * In Supabase: attempts to increment in database table `analytics_metrics` matching `metric_name`.
 * Fallback: increments in localStorage.
 */
export async function trackEvent(metric: keyof Omit<AnalyticsData, 'cv_duration_total' | 'cv_duration_count' | 'portfolio_duration_total' | 'portfolio_duration_count'>) {
  console.log(`[Telemetry] Tracking event: ${metric}`);

  // 1. Local storage tracking (always update to keep visual sync and fallback ready)
  const current = getLocalMetrics();
  current[metric] += 1;
  saveLocalMetrics(current);

  // 2. Supabase tracking (if configured)
  if (supabase) {
    try {
      const { error } = await supabase.rpc('increment_metric', { metric_name: metric });
      if (error) {
        const { data } = await supabase.from('analytics_metrics').select('value').eq('metric_name', metric).single();
        if (data) {
          await supabase.from('analytics_metrics').update({ value: data.value + 1 }).eq('metric_name', metric);
        } else {
          await supabase.from('analytics_metrics').insert({ metric_name: metric, value: 1 });
        }
      }
    } catch (err) {
      console.warn('Supabase logging failed, fell back to localStorage:', err);
    }
  }
}

/**
 * Tracks time spent on specific page.
 * Increments duration_total and duration_count.
 */
export async function trackTimeSpent(page: 'cv' | 'portfolio', durationSeconds: number) {
  if (durationSeconds <= 0) return;
  const formattedDuration = formatDuration(durationSeconds);
  console.log(`[Telemetry] Tracked ${formattedDuration} spent on /${page}`);

  const totalKey = page === 'cv' ? 'cv_duration_total' : 'portfolio_duration_total';
  const countKey = page === 'cv' ? 'cv_duration_count' : 'portfolio_duration_count';

  // 1. Local Storage tracking
  const current = getLocalMetrics();
  current[totalKey] += durationSeconds;
  current[countKey] += 1;
  saveLocalMetrics(current);

  // 2. Supabase tracking (if configured)
  if (supabase) {
    try {
      const { data: totalData } = await supabase.from('analytics_metrics').select('value').eq('metric_name', totalKey).single();
      if (totalData) {
        await supabase.from('analytics_metrics').update({ value: totalData.value + durationSeconds }).eq('metric_name', totalKey);
      } else {
        await supabase.from('analytics_metrics').insert({ metric_name: totalKey, value: durationSeconds });
      }

      const { data: countData } = await supabase.from('analytics_metrics').select('value').eq('metric_name', countKey).single();
      if (countData) {
        await supabase.from('analytics_metrics').update({ value: countData.value + 1 }).eq('metric_name', countKey);
      } else {
        await supabase.from('analytics_metrics').insert({ metric_name: countKey, value: 1 });
      }
    } catch (err) {
      console.warn('Supabase logging time failed, fell back to localStorage:', err);
    }
  }
}

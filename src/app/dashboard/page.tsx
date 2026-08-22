'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  KeyRound,
  AlertCircle,
  Eye,
  Download,
  Clock,
  BarChart3,
  Database,
  RefreshCw,
  LogOut,
  Sparkles,
  CheckCircle2,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { verifyPassword, checkAuth, logout } from './actions';
import { getLocalMetrics, supabase, AnalyticsData } from '@/lib/analytics';

// Formatter to convert seconds into MM:SS format
function formatMinSec(seconds: number): string {
  if (seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function Dashboard() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<AnalyticsData | null>(null);
  const [simulationSuccess, setSimulationSuccess] = useState('');

  const isSupabaseActive = Boolean(supabase);

  const loadMetrics = useCallback(async () => {
    if (supabase) {
      try {
        const { data, error: dbError } = await supabase.from('analytics_metrics').select('*');
        if (dbError) throw dbError;

        if (data && data.length > 0) {
          const dbMetrics: Partial<AnalyticsData> = {};
          data.forEach((row: { metric_name: string; value: number }) => {
            dbMetrics[row.metric_name as keyof AnalyticsData] = row.value;
          });

          const fallback = getLocalMetrics();
          setMetrics({
            home_visits: dbMetrics.home_visits ?? fallback.home_visits,
            cv_views: dbMetrics.cv_views ?? fallback.cv_views,
            portfolio_views: dbMetrics.portfolio_views ?? fallback.portfolio_views,
            cv_downloads: dbMetrics.cv_downloads ?? fallback.cv_downloads,
            portfolio_downloads: dbMetrics.portfolio_downloads ?? fallback.portfolio_downloads,
            cv_duration_total: dbMetrics.cv_duration_total ?? fallback.cv_duration_total,
            cv_duration_count: dbMetrics.cv_duration_count ?? fallback.cv_duration_count,
            portfolio_duration_total: dbMetrics.portfolio_duration_total ?? fallback.portfolio_duration_total,
            portfolio_duration_count: dbMetrics.portfolio_duration_count ?? fallback.portfolio_duration_count,
          });
          return;
        }
      } catch (err) {
        console.warn('Could not fetch from Supabase, loading localStorage fallback instead:', err);
      }
    }
    setMetrics(getLocalMetrics());
  }, []);

  // Validate initial session and load data asynchronously
  useEffect(() => {
    let ignore = false;
    async function verifySessionAndData() {
      const isAuthed = await checkAuth();
      if (!ignore) {
        setAuthorized(isAuthed);
        if (isAuthed) {
          loadMetrics();
        }
      }
    }
    verifySessionAndData();
    return () => {
      ignore = true;
    };
  }, [loadMetrics]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await verifyPassword(password);
      if (success) {
        setAuthorized(true);
        loadMetrics();
      } else {
        setError('Access Denied. Invalid credentials.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAuthorized(false);
    setPassword('');
  };

  const handleResetMetrics = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolio_telemetry_metrics');
      loadMetrics();
      triggerSimulationAlert('Metrics reset to seed values.');
    }
  };

  const triggerSimulationAlert = (msg: string) => {
    setSimulationSuccess(msg);
    setTimeout(() => setSimulationSuccess(''), 3000);
  };

  const simulateEvent = (metric: keyof AnalyticsData, incrementBy = 1) => {
    if (!metrics) return;
    const updated = { ...metrics };
    updated[metric] += incrementBy;

    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_telemetry_metrics', JSON.stringify(updated));
    }
    setMetrics(updated);
    triggerSimulationAlert(`Simulated +${incrementBy} to ${metric.replace(/_/g, ' ')}!`);
  };

  // Metric calculation variables
  const homeVisits = metrics?.home_visits ?? 0;
  const cvViews = metrics?.cv_views ?? 0;
  const portViews = metrics?.portfolio_views ?? 0;
  const cvDownloads = metrics?.cv_downloads ?? 0;
  const portDownloads = metrics?.portfolio_downloads ?? 0;

  const totalViews = cvViews + portViews;
  const totalDownloads = cvDownloads + portDownloads;
  const conversionRate = totalViews > 0 ? Math.round((totalDownloads / totalViews) * 100) : 0;

  const avgCvTime = metrics && cvViews > 0
    ? Math.round(metrics.cv_duration_total / cvViews)
    : 0;

  const avgPortTime = metrics && portViews > 0
    ? Math.round(metrics.portfolio_duration_total / portViews)
    : 0;

  if (authorized === null) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-[var(--text-secondary)] font-medium">Validating security credentials...</p>
        </div>
      </div>
    );
  }

  // --- PASSWORD LOCK SCREEN ---
  if (!authorized) {
    return (
      <div className="flex-1 flex items-center justify-center py-10 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-2xl relative"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full">
              <Lock className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-center text-[var(--text-primary)] mb-2">
            Secure Telemetry Portal
          </h2>
          <p className="text-[var(--text-secondary)] text-xs md:text-sm text-center mb-6">
            Access restricted to verified administrators. Enter password.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[var(--text-secondary)]">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Password"
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/30 focus:border-blue-500 rounded-xl text-sm text-[var(--text-primary)] focus:outline-none transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Unlock Analytics'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
              * Note: Default administrator password is <span className="font-semibold text-[var(--text-primary)]">admin123</span>.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- SECURE BENTO DASHBOARD ---
  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            Analytics Deck
          </h1>
          <p className="text-[var(--text-secondary)] text-xs md:text-sm mt-1">
            Real-time telemetry and user-interaction statistics summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadMetrics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--glass)] border border-[var(--border)] rounded-lg text-xs font-semibold hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Connection and Simulation Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-[var(--bg-secondary)]/50 border border-[var(--border)] rounded-xl">
        <div className="flex items-center gap-2">
          <Database className={`w-4 h-4 ${isSupabaseActive ? 'text-emerald-500' : 'text-teal-400'}`} />
          <span className="text-xs font-medium">
            Database Status:{' '}
            <span className={isSupabaseActive ? 'text-emerald-500' : 'text-teal-400 font-semibold'}>
              {isSupabaseActive ? 'Supabase Connected' : 'Local Sandbox Engine (localStorage Active)'}
            </span>
          </span>
        </div>

        {simulationSuccess && (
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{simulationSuccess}</span>
          </div>
        )}
      </div>

      {/* --- ASYMMETRIC BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Visits */}
        <div className="md:col-span-2 bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500">Telemetry</span>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mt-1">Total Page Visits</h3>
            </div>
            <span className="p-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg">
              <Eye className="w-4 h-4 text-blue-500" />
            </span>
          </div>

          <div className="my-3">
            <span className="text-5xl font-black tracking-tight text-[var(--text-primary)]">
              {homeVisits.toLocaleString()}
            </span>
            <span className="text-teal-400 text-xs font-semibold ml-2 inline-flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Active Telemetry
            </span>
          </div>

          <p className="text-[11px] text-[var(--text-secondary)] font-light">
            Calculated across index entry loads, direct referrals, and campaigns.
          </p>
        </div>

        {/* Card 2: Conversion Rate */}
        <div className="bg-gradient-to-br from-blue-900/10 to-[var(--bg-secondary)]/30 border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between min-h-[200px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500">Conversion</span>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mt-1">Document Conversion</h3>
            </div>
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-5xl font-black text-[var(--text-primary)]">{conversionRate}%</span>
            <span className="text-[var(--text-secondary)] text-xs">downloads / views</span>
          </div>

          <div className="w-full bg-[var(--bg-primary)] rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, conversionRate)}%` }}
            />
          </div>

          <p className="text-[10px] text-[var(--text-secondary)]">
            Computed from total downloads relative to page views.
          </p>
        </div>

        {/* Card 3: CV Views */}
        <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">Views</span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">CV Views</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)]">
              /cv
            </span>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-[var(--text-primary)]">{cvViews}</span>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Total times Curriculum Vitae viewer loaded.
            </p>
          </div>
        </div>

        {/* Card 4: Portfolio Views */}
        <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">Views</span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">Portfolio Deck Views</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)]">
              /portfolio
            </span>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-[var(--text-primary)]">{portViews}</span>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Total times portfolio project deck loaded.
            </p>
          </div>
        </div>

        {/* Card 5: CV Downloads */}
        <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">Actions</span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">CV Downloads</h3>
            </div>
            <Download className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-[var(--text-primary)]">{cvDownloads}</span>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Clicks on CV document download action.
            </p>
          </div>
        </div>

        {/* Card 6: Portfolio Downloads */}
        <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">Actions</span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">Portfolio Downloads</h3>
            </div>
            <Download className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-[var(--text-primary)]">{portDownloads}</span>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Clicks on portfolio PDF deck download action.
            </p>
          </div>
        </div>

        {/* Card 7: Avg CV Duration */}
        <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">Engagement</span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">Avg CV Read Time</h3>
            </div>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-[var(--text-primary)]">{formatMinSec(avgCvTime)}</span>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Average read engagement spent on /cv.
            </p>
          </div>
        </div>

        {/* Card 8: Avg Portfolio Duration */}
        <div className="bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">Engagement</span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">Avg Portfolio Read Time</h3>
            </div>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-[var(--text-primary)]">{formatMinSec(avgPortTime)}</span>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Average read engagement spent on /portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* --- SANDBOX SIMULATOR CONTROLS --- */}
      <section className="w-full bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 mt-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2 mb-3">
          <Settings className="w-5 h-5 text-blue-500 animate-spin" />
          Sandbox Control Panel (Telemetry Simulator)
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
          Trigger simulated analytics events directly to verify live reactivity in your browser.
        </p>

        <div className="flex flex-wrap gap-2.5 mb-6">
          <button
            onClick={() => simulateEvent('home_visits', 1)}
            className="px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/40 text-xs font-semibold rounded-xl text-[var(--text-primary)] cursor-pointer"
          >
            +1 Home Visit
          </button>
          <button
            onClick={() => simulateEvent('cv_views', 1)}
            className="px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/40 text-xs font-semibold rounded-xl text-[var(--text-primary)] cursor-pointer"
          >
            +1 CV View
          </button>
          <button
            onClick={() => simulateEvent('portfolio_views', 1)}
            className="px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/40 text-xs font-semibold rounded-xl text-[var(--text-primary)] cursor-pointer"
          >
            +1 Portfolio View
          </button>
          <button
            onClick={() => simulateEvent('cv_downloads', 1)}
            className="px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/40 text-xs font-semibold rounded-xl text-[var(--text-primary)] cursor-pointer"
          >
            +1 CV Download
          </button>
          <button
            onClick={() => simulateEvent('portfolio_downloads', 1)}
            className="px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/40 text-xs font-semibold rounded-xl text-[var(--text-primary)] cursor-pointer"
          >
            +1 Portfolio Download
          </button>
          <button
            onClick={() => simulateEvent('cv_duration_total', 15)}
            className="px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/40 text-xs font-semibold rounded-xl text-[var(--text-primary)] cursor-pointer"
          >
            +15s CV Time
          </button>
          <button
            onClick={() => simulateEvent('portfolio_duration_total', 15)}
            className="px-3.5 py-2 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/40 text-xs font-semibold rounded-xl text-[var(--text-primary)] cursor-pointer"
          >
            +15s Portfolio Time
          </button>
        </div>

        <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
          <span className="text-xs text-[var(--text-secondary)]">Reset telemetry:</span>
          <button
            onClick={handleResetMetrics}
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold rounded-xl cursor-pointer transition-all"
          >
            Reset to Default Seed Values
          </button>
        </div>
      </section>
    </div>
  );
}

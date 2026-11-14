import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Sprout, 
  ArrowRight, 
  Wheat, 
  Layers, 
  FlaskConical, 
  Droplets, 
  Bug, 
  BotMessageSquare, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp,
  MapPin,
  Calendar,
  CloudSun
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const features = [
    {
      title: 'Contextual Crop Selection',
      description: 'Find the top 5 crops best suited to your specific soil type, pH, seasonal climate, and water availability.',
      icon: Wheat,
      color: 'emerald',
    },
    {
      title: 'Soil Health Interpretation',
      description: 'Receive actionable insights on soil texture, organic matter, and amendment needs without complex lab jargon.',
      icon: Layers,
      color: 'amber',
    },
    {
      title: 'Balanced Nutrient & Fertilizer Planning',
      description: 'Guidance on basal and top-dressing NPK split applications paired with farmyard compost and bio-fertilizers.',
      icon: FlaskConical,
      color: 'blue',
    },
    {
      title: 'Critical-Stage Irrigation Advisory',
      description: 'Plan water application according to crop phenological growth stages, drip efficiency, and local weather.',
      icon: Droplets,
      color: 'cyan',
    },
    {
      title: 'Integrated Pest & Disease Diagnostics',
      description: 'Describe visible plant symptoms to receive preliminary matches, preventive sanitation, and biological IPM controls.',
      icon: Bug,
      color: 'rose',
    },
    {
      title: 'Conversational Agricultural Chatbot',
      description: 'Ask farming questions in natural English or Hindi, getting transparent, responsible agricultural guidance.',
      icon: BotMessageSquare,
      color: 'purple',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Provide Farm Parameters',
      desc: 'Enter your state, district, soil type, water availability, and intended cropping season.',
      icon: MapPin,
    },
    {
      step: '02',
      title: 'AI Agro-Climatic Synthesis',
      desc: 'Our Gemini AI engine evaluates agronomic compatibility against verified regional farming principles.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Receive Tailored Advisory',
      desc: 'Review suitability scores, cultivation recommendations, irrigation intervals, and disease watchouts.',
      icon: Wheat,
    },
    {
      step: '04',
      title: 'Sustain & Track History',
      desc: 'Save your crop advisories to track field progress and consult the AI assistant anytime.',
      icon: Calendar,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold shadow-sm border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Next-Generation AI Agricultural Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Smarter Farming Decisions with{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                Contextual AI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Empowering farmers with personalized crop selection, soil health interpretation, 
              nutrient planning, and plant protection tailored to regional soil and weather conditions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to={user ? "/crop-advisory" : "/register"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition-all hover:shadow-lg"
              >
                <span>{user ? 'Launch Crop Advisory' : 'Start Advisory Consultation'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/chatbot"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm"
              >
                <BotMessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Ask Agriculture AI</span>
              </Link>
            </div>

            {/* Credibility highlights */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Fabricated Data</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Integrated Pest Management (IPM)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-emerald-600" />
                <span>Real-Time Weather Integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Platform Works */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Streamlined Workflow</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900">How KisanAI Works</p>
            <p className="mt-3 text-sm text-slate-600">
              A 4-step decision-support pipeline translating your land and soil characteristics into actionable agronomic guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
                  <div className="text-3xl font-black text-emerald-100 mb-4">{s.step}</div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-700 mb-4 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advisory Capabilities Grid */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Holistic Farming Modules</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900">Full-Spectrum Agricultural Advisory</p>
            <p className="mt-3 text-sm text-slate-600">
              Explore purpose-built advisory engines designed to tackle every dimension of modern crop cultivation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:border-emerald-200 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{feat.description}</p>
                  <Link
                    to="/crop-advisory"
                    className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-900 gap-1"
                  >
                    <span>Explore module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits for Farmers */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Measurable Impact</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Designed to Safeguard Farm Yields and Lower Input Costs
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                By synthesizing soil texture, nutrient thresholds, rainfall expectations, and crop maturity periods, KisanAI minimizes uncertainty before you invest in seeds, fertilizers, or irrigation infrastructure.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  'Avoid planting ill-suited crops on challenging soils or low water regimes',
                  'Calibrated nutrient split timing prevents excessive chemical leaching',
                  'Water conservation tips tailored to drip, furrow, and sprinkler setups',
                  'Early detection of symptoms prevents epidemic outbreaks',
                  'Saved consultation logs provide a year-on-year historical farming record'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/crop-advisory"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <span>Experience Advisory Workflow</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Interactive preview card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Sample Advisory Card</p>
                    <p className="text-[10px] text-emerald-400">Finger Millet (Ragi) • Score: 92/100</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Highly Suitable
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <p className="text-slate-400 text-[11px] font-semibold mb-1">Reason for Selection</p>
                  <p className="text-slate-200 leading-relaxed text-[11px]">
                    Ideal match for Red Loam soil and moderate water availability during Kharif. Excellent drought tolerance and strong local market demand.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Water Need</span>
                    <span className="font-semibold text-emerald-300">350 - 400 mm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Season Window</span>
                    <span className="font-semibold text-emerald-300">July 15 - August 10</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60">
                  <p className="text-emerald-400 text-[11px] font-semibold mb-1">Cultivation Note</p>
                  <p className="text-slate-300 text-[10px] leading-relaxed">
                    Treat seeds with Azospirillum biofertilizer at 25g/kg seed before line sowing at 22.5cm spacing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-green-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Start Your First Agricultural Advisory Today
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Free to use, built with mobile-first simplicity, and tailored for Indian agricultural ecosystems.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
            >
              <span>Create Farmer Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  Users, 
  Briefcase, 
  Compass, 
  GraduationCap, 
  Lock,
  Sparkles
} from 'lucide-react';
import { Badge, getBadgesList } from '../data/inductionContent';
import { t } from '../utils/i18n';

interface ApprenticeBadgesHUDProps {
  totalXp: number;
  lang?: 'es' | 'en';
}

const ICON_MAP: Record<string, React.ElementType> = {
  Award,
  ShieldCheck,
  HeartHandshake,
  Users,
  Briefcase,
  Compass,
  GraduationCap,
};

export const ApprenticeBadgesHUD: React.FC<ApprenticeBadgesHUDProps> = ({ totalXp, lang = 'es' }) => {
  const badges = getBadgesList(lang);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t[lang].badgesTitle}
          </h3>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">{totalXp} {t[lang].xpAccumulated}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {badges.map((badge: Badge) => {
          const isUnlocked = totalXp >= (badge.unlockedAtXp || 0);
          const IconComponent = ICON_MAP[badge.iconName] || Award;

          return (
            <div
              key={badge.id}
              className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center justify-between group relative ${
                isUnlocked
                  ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-2xs'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 opacity-60'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${
                isUnlocked
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
              }`}>
                {isUnlocked ? (
                  <IconComponent className="w-5 h-5" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
              </div>

              <div className="w-full">
                <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {badge.name}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 tabular-nums">
                  {isUnlocked ? (lang === 'en' ? 'Unlocked' : 'Desbloqueada') : `${badge.unlockedAtXp} XP`}
                </span>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-30 w-44 p-2 bg-slate-900 dark:bg-slate-800 text-white text-[11px] rounded-lg shadow-lg pointer-events-none text-left border border-slate-700">
                <p className="font-semibold">{badge.name}</p>
                <p className="text-slate-300 dark:text-slate-300 mt-0.5">{badge.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

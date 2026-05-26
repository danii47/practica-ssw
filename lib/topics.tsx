import type { ReactNode } from 'react';

export const TOPICS = [
  'Informática',
  'Idiomas',
  'Música',
  'Deporte',
  'Hogar',
  'Cocina',
  'Arte',
  'Mascotas',
] as const;

export type TopicKey = (typeof TOPICS)[number];

export interface TopicStyle {
  gradient: string;
  tintBg: string;
  tintBorder: string;
  tintText: string;
  iconColor: string;
  icon: ReactNode;
}

const iconCls = 'w-full h-full';

export const TOPIC_STYLES: Record<TopicKey, TopicStyle> = {
  'Informática': {
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    tintBg: 'bg-sky-50',
    tintBorder: 'border-sky-200',
    tintText: 'text-sky-700',
    iconColor: 'text-sky-600',
    icon: (
      <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  'Idiomas': {
    gradient: 'from-amber-300 via-amber-400 to-orange-500',
    tintBg: 'bg-amber-50',
    tintBorder: 'border-amber-200',
    tintText: 'text-amber-700',
    iconColor: 'text-amber-600',
    icon: (
      <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
  'Música': {
    gradient: 'from-pink-400 via-rose-500 to-fuchsia-600',
    tintBg: 'bg-pink-50',
    tintBorder: 'border-pink-200',
    tintText: 'text-pink-700',
    iconColor: 'text-pink-600',
    icon: (
      <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
      </svg>
    ),
  },
  'Deporte': {
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    tintBg: 'bg-emerald-50',
    tintBorder: 'border-emerald-200',
    tintText: 'text-emerald-700',
    iconColor: 'text-emerald-600',
    icon: (
      <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  'Hogar': {
    gradient: 'from-orange-300 via-orange-400 to-red-500',
    tintBg: 'bg-orange-50',
    tintBorder: 'border-orange-200',
    tintText: 'text-orange-700',
    iconColor: 'text-orange-600',
    icon: (
      <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  'Cocina': {
    gradient: 'from-rose-400 via-red-500 to-orange-600',
    tintBg: 'bg-rose-50',
    tintBorder: 'border-rose-200',
    tintText: 'text-rose-700',
    iconColor: 'text-rose-600',
    icon: (
      <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
  'Arte': {
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    tintBg: 'bg-violet-50',
    tintBorder: 'border-violet-200',
    tintText: 'text-violet-700',
    iconColor: 'text-violet-600',
    icon: (
      <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  'Mascotas': {
    gradient: 'from-teal-400 via-cyan-500 to-sky-600',
    tintBg: 'bg-teal-50',
    tintBorder: 'border-teal-200',
    tintText: 'text-teal-700',
    iconColor: 'text-teal-600',
    icon: (
      <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
};

export const FALLBACK_STYLE: TopicStyle = {
  gradient: 'from-slate-400 via-slate-500 to-slate-600',
  tintBg: 'bg-slate-50',
  tintBorder: 'border-slate-200',
  tintText: 'text-slate-700',
  iconColor: 'text-slate-600',
  icon: (
    <svg className={iconCls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

export function topicStyle(topic: string): TopicStyle {
  return TOPIC_STYLES[topic as TopicKey] ?? FALLBACK_STYLE;
}

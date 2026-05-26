'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Error al iniciar sesión.');
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      <aside className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative overflow-hidden text-white">
        <div className="absolute inset-0 gradient-brand" />
        <div className="absolute inset-0 bg-grid opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-noise opacity-40" />
        <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-[24rem] h-[24rem] rounded-full bg-fuchsia-400/30 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-14 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white text-brand rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-6 h-6" version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 377 304" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0,304) scale(0.1,-0.1)" fill="currentColor">
                  <path d="M1645 2861 c-89 -25 -182 -79 -255 -146 l-65 -61 -65 14 c-51 11 -82 12 -141 4 -191 -27 -337 -146 -425 -350 l-33 -77 -93 -47 c-254 -129 -378 -327 -378 -605 0 -182 50 -328 155 -455 122 -149 323 -238 534 -238 l67 0 28 -60 c99 -209 366 -296 611 -201 l78 30 57 -52 c68 -64 175 -121 261 -142 88 -20 237 -18 324 5 l70 18 35 -27 c47 -37 78 -95 96 -182 26 -126 70 -183 162 -210 36 -11 48 -10 76 4 76 36 125 155 133 323 l6 101 56 13 c124 27 232 99 299 200 60 89 82 169 82 294 l0 102 39 22 c102 58 193 197 210 324 21 150 -25 284 -136 397 -56 58 -64 70 -69 116 -17 144 -67 256 -149 340 -89 92 -221 151 -355 162 -75 6 -77 6 -96 40 -30 57 -139 150 -203 173 -108 41 -213 48 -289 19 -19 -7 -32 -1 -74 32 -66 52 -168 103 -245 123 -81 21 -230 20 -308 -3z" />
                </g>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">KnowledgExchange</span>
          </div>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Comunidad activa · +200 intercambios este mes
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.05] mb-6">
              El valor de tu tiempo<br />
              <span className="bg-gradient-to-r from-sky-200 to-fuchsia-200 bg-clip-text text-transparent">sin barreras económicas.</span>
            </h1>
            <p className="text-white/85 text-base xl:text-lg leading-relaxed">
              Ofrece lo que mejor sabes hacer y consigue lo que necesitas. Una red basada en confianza, valoraciones reales y trueque directo de habilidades.
            </p>

            <ul className="mt-8 space-y-3 text-white/90 text-sm">
              {[
                'Publica tus servicios en minutos',
                'Encuentra intercambios cerca de ti o totalmente online',
                'Construye reputación con valoraciones verificadas',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-white/70 text-xs font-medium">
            © 2026 Grupo 34 · SSW
          </div>
        </div>
      </aside>

      <main className="w-full lg:w-[56%] xl:w-[58%] flex items-center justify-center p-6 sm:p-10 bg-canvas relative overflow-y-auto">
        <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />
        <div className="w-full max-w-md relative animate-slide-up">
          <div className="bg-surface rounded-3xl shadow-lg border border-hairline p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-ink mb-2 tracking-tight">Te damos la bienvenida</h2>
              <p className="text-muted text-sm">
                Introduce tus credenciales para acceder a tu cuenta.
              </p>
            </div>

            {error && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 px-4 py-3 bg-danger-soft border border-red-200 rounded-xl text-sm text-red-700 font-medium animate-fade-in">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-ink-soft mb-2">
                  Correo electrónico
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-soft group-focus-within:text-brand transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3 border border-hairline bg-surface rounded-xl text-ink placeholder-muted-soft focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow text-sm"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-ink-soft mb-2">
                  Contraseña
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-soft group-focus-within:text-brand transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3 border border-hairline bg-surface rounded-xl text-ink placeholder-muted-soft focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-soft hover:text-ink-soft transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white gradient-brand shadow-brand hover:shadow-lg btn-press transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Iniciando sesión…
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-hairline" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface px-3 text-muted-soft font-medium tracking-wide uppercase">¿Eres nuevo?</span>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-hairline rounded-xl text-sm font-bold text-ink-soft hover:border-brand hover:text-brand hover:bg-brand-soft transition-all btn-press"
            >
              Crear una cuenta gratis
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Al continuar aceptas nuestras normas de comunidad y política de privacidad.
          </p>
        </div>
      </main>
    </div>
  );
}

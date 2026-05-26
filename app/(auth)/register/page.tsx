'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type FieldErrors = Record<string, string>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    surnames: '',
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    country: '',
    born_date: '',
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGlobalError('');
    setFieldErrors({});

    if (form.password !== form.password_confirm) {
      setFieldErrors({ password_confirm: 'Las contraseñas no coinciden.' });
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        surnames: form.surnames,
        username: form.username,
        email: form.email,
        password: form.password,
        country: form.country,
        born_date: form.born_date,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else if ((res.status === 422 || res.status === 409) && data.fields) {
      setFieldErrors(data.fields);
      setLoading(false);
    } else {
      setGlobalError(data.error ?? 'Error al crear la cuenta.');
      setLoading(false);
    }
  }

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 4);
  })();

  const strengthMeta = [
    { label: 'Muy débil', color: 'bg-danger' },
    { label: 'Débil', color: 'bg-orange-500' },
    { label: 'Aceptable', color: 'bg-amber-500' },
    { label: 'Fuerte', color: 'bg-emerald-500' },
    { label: 'Excelente', color: 'bg-emerald-600' },
  ];

  const inputBase =
    'block w-full pl-11 pr-3 py-2.5 border bg-surface rounded-xl text-ink placeholder-muted-soft focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow text-sm';
  const inputBaseNoIcon =
    'block w-full px-4 py-2.5 border bg-surface rounded-xl text-ink placeholder-muted-soft focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow text-sm';
  const errCls = 'border-red-300 bg-red-50/50';
  const okCls = 'border-hairline';

  function inputCls(field: string) {
    return `${inputBase} ${fieldErrors[field] ? errCls : okCls}`;
  }
  function inputClsNoIcon(field: string) {
    return `${inputBaseNoIcon} ${fieldErrors[field] ? errCls : okCls}`;
  }

  return (
    <div className="flex w-full min-h-screen">
      <main className="w-full lg:w-[56%] xl:w-[58%] flex items-center justify-center p-6 sm:p-10 bg-canvas relative overflow-y-auto">
        <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" />
        <div className="w-full max-w-lg relative animate-slide-up">
          <div className="bg-surface rounded-3xl shadow-lg border border-hairline p-8 sm:p-10">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-ink mb-2 tracking-tight">Únete a la comunidad</h2>
              <p className="text-muted text-sm">Crea tu cuenta gratis y empieza a intercambiar habilidades hoy mismo.</p>
            </div>

            {globalError && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 px-4 py-3 bg-danger-soft border border-red-200 rounded-xl text-sm text-red-700 font-medium animate-fade-in">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                </svg>
                {globalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ink-soft mb-1.5">Nombre</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-soft">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </span>
                    <input id="name" type="text" required maxLength={15} value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls('name')} placeholder="Ana" />
                  </div>
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span>{fieldErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="surnames" className="block text-sm font-semibold text-ink-soft mb-1.5">Apellidos</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-soft">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </span>
                    <input id="surnames" type="text" required maxLength={30} value={form.surnames} onChange={(e) => set('surnames', e.target.value)} className={inputCls('surnames')} placeholder="Silva Pérez" />
                  </div>
                  {fieldErrors.surnames && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span>{fieldErrors.surnames}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-ink-soft mb-1.5">Nombre de usuario</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-soft">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                    </svg>
                  </span>
                  <input id="username" type="text" required minLength={3} maxLength={20} value={form.username} onChange={(e) => set('username', e.target.value.toLowerCase().replace(/\s/g, '_'))} className={inputCls('username')} placeholder="ana_garcia" />
                </div>
                {fieldErrors.username && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span>{fieldErrors.username}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-ink-soft mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-soft">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls('email')} placeholder="ejemplo@correo.com" />
                </div>
                {fieldErrors.email && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span>{fieldErrors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-ink-soft mb-1.5">Contraseña</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-soft">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </span>
                    <input id="password" type={showPassword ? 'text' : 'password'} required minLength={8} value={form.password} onChange={(e) => set('password', e.target.value)} className={`${inputCls('password')} pr-11`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-soft hover:text-ink-soft" aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-hairline rounded-full overflow-hidden flex">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className={`flex-1 transition-colors ${i < passwordStrength ? strengthMeta[passwordStrength].color : 'bg-transparent'} ${i < 3 ? 'mr-0.5' : ''}`} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-muted">{strengthMeta[passwordStrength].label}</span>
                    </div>
                  )}
                  {fieldErrors.password && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span>{fieldErrors.password}</p>}
                </div>
                <div>
                  <label htmlFor="password_confirm" className="block text-sm font-semibold text-ink-soft mb-1.5">Confirmar</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-soft">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <input id="password_confirm" type="password" required value={form.password_confirm} onChange={(e) => set('password_confirm', e.target.value)} className={inputCls('password_confirm')} placeholder="••••••••" />
                  </div>
                  {fieldErrors.password_confirm && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span>{fieldErrors.password_confirm}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-ink-soft mb-1.5">País</label>
                  <select id="country" required value={form.country} onChange={(e) => set('country', e.target.value)} className={`appearance-none ${inputClsNoIcon('country')}`}>
                    <option value="">Selecciona…</option>
                    <option value="España">España</option>
                    <option value="México">México</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Chile">Chile</option>
                    <option value="Perú">Perú</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {fieldErrors.country && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span>{fieldErrors.country}</p>}
                </div>
                <div>
                  <label htmlFor="born_date" className="block text-sm font-semibold text-ink-soft mb-1.5">Fecha de nacimiento</label>
                  <input id="born_date" type="date" required value={form.born_date} onChange={(e) => set('born_date', e.target.value)} className={inputClsNoIcon('born_date')} />
                  {fieldErrors.born_date && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><span>⚠</span>{fieldErrors.born_date}</p>}
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white gradient-brand shadow-brand hover:shadow-lg btn-press transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creando cuenta…
                    </>
                  ) : (
                    <>
                      Crear Cuenta Gratis
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-bold text-brand hover:text-brand-dark transition-colors">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </main>

      <aside className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative overflow-hidden text-white">
        <div className="absolute inset-0 gradient-brand" />
        <div className="absolute inset-0 bg-grid opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-noise opacity-40" />
        <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-[24rem] h-[24rem] rounded-full bg-fuchsia-400/30 blur-3xl" />

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
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.05] mb-6">
              Empieza a formar<br />
              <span className="bg-gradient-to-r from-sky-200 to-fuchsia-200 bg-clip-text text-transparent">parte de la red.</span>
            </h1>
            <p className="text-white/85 text-base xl:text-lg leading-relaxed mb-8">
              Miles de personas dispuestas a compartir su talento contigo. Construye una red basada en confianza, intercambio mutuo y crecimiento personal.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { v: '+1.2k', l: 'Miembros activos' },
                { v: '+5k', l: 'Servicios' },
                { v: '4.8★', l: 'Valoración media' },
              ].map((s) => (
                <div key={s.l} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-extrabold">{s.v}</div>
                  <div className="text-xs text-white/80 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-white/70 text-xs font-medium">© 2026 Grupo 34 · SSW</div>
        </div>
      </aside>
    </div>
  );
}

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Section = 'profile' | 'account' | 'security' | 'danger';

interface ProfileData {
  name: string;
  surnames: string;
  username: string;
  description: string;
  location: string;
  country: string;
}

const COUNTRIES = ['España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Venezuela', 'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay', 'Otro'];

type Message = { type: 'success' | 'error'; text: string } | null;

function Banner({ msg }: { msg: Message }) {
  if (!msg) return null;
  const ok = msg.type === 'success';
  return (
    <div role="alert" className={`flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in border ${
      ok ? 'bg-success-soft border-emerald-200 text-emerald-700' : 'bg-danger-soft border-red-200 text-red-700'
    }`}>
      {ok ? (
        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
      )}
      {msg.text}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [section, setSection] = useState<Section>('profile');
  const [initialLoading, setInitialLoading] = useState(true);

  const [profile, setProfile] = useState<ProfileData>({ name: '', surnames: '', username: '', description: '', location: '', country: '' });
  const [accountEmail, setAccountEmail] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileFieldErrors, setProfileFieldErrors] = useState<Record<string, string>>({});

  const [savingEmail, setSavingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name ?? '',
          surnames: data.surnames ?? '',
          username: data.username ?? '',
          description: data.description ?? '',
          location: data.location ?? '',
          country: data.country ?? '',
        });
        setAccountEmail(data.email ?? '');
      }
      setInitialLoading(false);
    })();
  }, []);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    setProfileFieldErrors({});
    const res = await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setProfileMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
      router.refresh();
    } else if ((res.status === 422 || res.status === 409) && data.fields) {
      setProfileFieldErrors(data.fields);
      setProfileMessage({ type: 'error', text: 'Revisa los campos marcados.' });
    } else {
      setProfileMessage({ type: 'error', text: data.error ?? 'Error al guardar.' });
    }
    setSavingProfile(false);
  }

  async function saveEmail(e: FormEvent) {
    e.preventDefault();
    setSavingEmail(true);
    setEmailMessage(null);
    const res = await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: accountEmail }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setEmailMessage({ type: 'success', text: 'Correo actualizado.' });
    } else if (res.status === 409) {
      setEmailMessage({ type: 'error', text: 'Ese correo ya está en uso.' });
    } else {
      setEmailMessage({ type: 'error', text: data.error ?? 'Error al actualizar el correo.' });
    }
    setSavingEmail(false);
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 8 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }
    setSavingPassword(true);
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setPasswordMessage({ type: 'success', text: 'Contraseña actualizada.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage({ type: 'error', text: data.error ?? 'No se pudo cambiar la contraseña.' });
    }
    setSavingPassword(false);
  }

  async function deleteAccount() {
    setDeleteError('');
    setDeleting(true);
    const res = await fetch('/api/auth/me', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: deletePassword }),
    });
    if (res.ok) {
      router.push('/login');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setDeleteError(data.error ?? 'No se pudo eliminar la cuenta.');
      setDeleting(false);
    }
  }

  const inputCls = (field?: string) =>
    `w-full px-3 py-2.5 border rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow placeholder-muted-soft ${
      field && profileFieldErrors[field] ? 'border-red-300 bg-red-50/50' : 'border-hairline bg-surface'
    }`;

  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    {
      id: 'profile', label: 'Perfil',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>,
    },
    {
      id: 'account', label: 'Cuenta',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>,
    },
    {
      id: 'security', label: 'Seguridad',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>,
    },
    {
      id: 'danger', label: 'Zona de peligro',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
      </svg>,
    },
  ];

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-canvas">
      <header className="bg-surface border-b border-hairline shrink-0 z-10">
        <div className="px-6 md:px-10 py-5">
          <h1 className="text-2xl font-bold text-ink tracking-tight">Ajustes</h1>
          <p className="text-sm text-muted mt-0.5">Gestiona tu perfil, cuenta y seguridad.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-6 md:py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-10">

          <nav className="md:sticky md:top-6 self-start">
            <ul className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
              {navItems.map((item) => {
                const active = section === item.id;
                const isDanger = item.id === 'danger';
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setSection(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all btn-press whitespace-nowrap ${
                        active
                          ? isDanger
                            ? 'bg-danger-soft text-red-700'
                            : 'bg-brand-soft text-brand'
                          : isDanger
                          ? 'text-muted hover:bg-danger-soft hover:text-red-700'
                          : 'text-muted hover:bg-canvas hover:text-ink'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="min-w-0">
            {initialLoading ? (
              <div className="bg-surface rounded-2xl border border-hairline p-8 space-y-3">
                <div className="h-4 w-1/3 skeleton rounded" />
                <div className="h-10 w-full skeleton rounded-lg" />
                <div className="h-10 w-full skeleton rounded-lg" />
              </div>
            ) : section === 'profile' ? (
              <form onSubmit={saveProfile} className="bg-surface rounded-2xl border border-hairline p-6 md:p-8 space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-ink">Perfil público</h2>
                  <p className="text-sm text-muted mt-0.5">Esta información es visible para otros usuarios.</p>
                </div>

                <Banner msg={profileMessage} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-ink-soft mb-1.5">Nombre</label>
                    <input type="text" required maxLength={15} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputCls('name')} />
                    {profileFieldErrors.name && <p className="mt-1 text-xs text-red-600">⚠ {profileFieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink-soft mb-1.5">Apellidos</label>
                    <input type="text" required maxLength={30} value={profile.surnames} onChange={(e) => setProfile({ ...profile, surnames: e.target.value })} className={inputCls('surnames')} />
                    {profileFieldErrors.surnames && <p className="mt-1 text-xs text-red-600">⚠ {profileFieldErrors.surnames}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink-soft mb-1.5">Usuario</label>
                  <input type="text" required minLength={3} maxLength={20} value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/\s/g, '_') })} className={inputCls('username')} />
                  {profileFieldErrors.username && <p className="mt-1 text-xs text-red-600">⚠ {profileFieldErrors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink-soft mb-1.5">Descripción</label>
                  <textarea rows={3} maxLength={250} value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} placeholder="Cuéntale a la comunidad qué te apasiona…" className={`${inputCls('description')} resize-none`} />
                  <p className="text-[11px] text-muted-soft text-right mt-1">{profile.description.length}/250</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-ink-soft mb-1.5">Ubicación</label>
                    <input type="text" maxLength={100} value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="Madrid, España" className={inputCls('location')} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink-soft mb-1.5">País</label>
                    <select value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className={inputCls('country')}>
                      <option value="">Selecciona…</option>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-hairline-soft">
                  <button type="submit" disabled={savingProfile} className="px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-brand hover:shadow-lg transition-all btn-press disabled:opacity-60 flex items-center gap-2">
                    {savingProfile ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Guardando…
                      </>
                    ) : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            ) : section === 'account' ? (
              <form onSubmit={saveEmail} className="bg-surface rounded-2xl border border-hairline p-6 md:p-8 space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-ink">Cuenta</h2>
                  <p className="text-sm text-muted mt-0.5">Tu correo electrónico es privado y se usa para iniciar sesión.</p>
                </div>
                <Banner msg={emailMessage} />
                <div>
                  <label className="block text-sm font-bold text-ink-soft mb-1.5">Correo electrónico</label>
                  <input type="email" required value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} className={inputCls()} />
                </div>
                <div className="flex justify-end pt-2 border-t border-hairline-soft">
                  <button type="submit" disabled={savingEmail} className="px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-brand hover:shadow-lg transition-all btn-press disabled:opacity-60 flex items-center gap-2">
                    {savingEmail ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Guardando…
                      </>
                    ) : 'Actualizar correo'}
                  </button>
                </div>
              </form>
            ) : section === 'security' ? (
              <form onSubmit={changePassword} className="bg-surface rounded-2xl border border-hairline p-6 md:p-8 space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-ink">Seguridad</h2>
                  <p className="text-sm text-muted mt-0.5">Mantén tu cuenta segura cambiando tu contraseña con regularidad.</p>
                </div>
                <Banner msg={passwordMessage} />
                <div>
                  <label className="block text-sm font-bold text-ink-soft mb-1.5">Contraseña actual</label>
                  <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls()} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-ink-soft mb-1.5">Nueva contraseña</label>
                    <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls()} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-ink-soft mb-1.5">Confirmar nueva</label>
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls()} />
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t border-hairline-soft">
                  <button type="submit" disabled={savingPassword} className="px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl shadow-brand hover:shadow-lg transition-all btn-press disabled:opacity-60 flex items-center gap-2">
                    {savingPassword ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Cambiando…
                      </>
                    ) : 'Cambiar contraseña'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-surface rounded-2xl border-2 border-red-200 p-6 md:p-8 animate-fade-in">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-danger-soft flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-ink">Eliminar cuenta</h2>
                    <p className="text-sm text-muted mt-0.5">
                      Esta acción es permanente. Se eliminarán tu perfil, servicios, contactos e historial de intercambios. No se puede deshacer.
                    </p>
                  </div>
                </div>

                {!deleteConfirm ? (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="px-4 py-2.5 bg-danger-soft border border-red-200 text-red-700 text-sm font-bold rounded-xl hover:bg-danger hover:text-white hover:border-danger transition-all btn-press"
                  >
                    Quiero eliminar mi cuenta
                  </button>
                ) : (
                  <div className="space-y-4 bg-danger-soft border border-red-200 rounded-xl p-5">
                    <p className="text-sm font-bold text-red-700">Confirma tu contraseña para eliminar la cuenta.</p>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Tu contraseña"
                      className="w-full px-3 py-2.5 border border-red-300 bg-surface rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-danger"
                    />
                    {deleteError && (
                      <p className="text-sm text-red-700 font-medium flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                        </svg>
                        {deleteError}
                      </p>
                    )}
                    <div className="flex gap-2.5 justify-end">
                      <button
                        onClick={() => { setDeleteConfirm(false); setDeletePassword(''); setDeleteError(''); }}
                        className="px-4 py-2.5 text-sm font-bold text-ink-soft bg-surface rounded-xl hover:bg-hairline-soft transition-colors btn-press"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={deleteAccount}
                        disabled={deleting || !deletePassword}
                        className="px-4 py-2.5 text-sm font-bold text-white bg-danger rounded-xl hover:bg-red-600 transition-colors btn-press disabled:opacity-50 flex items-center gap-2"
                      >
                        {deleting ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Eliminando…
                          </>
                        ) : 'Eliminar permanentemente'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

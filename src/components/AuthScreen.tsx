import { useState, type FormEvent } from 'react';
import { api, type AuthSession } from '../api/client';
import nutritionImage from '../assets/landing/nutrition.png';
import trainingImage from '../assets/landing/training.png';
import mobilityImage from '../assets/landing/mobility.png';
import planningImage from '../assets/landing/planning.png';

const landingVisuals = [
  { src: nutritionImage, label: 'Personalized nutrition' },
  { src: trainingImage, label: 'Health-aware training' },
  { src: mobilityImage, label: 'Safe movement' },
  { src: planningImage, label: 'Built around you' },
];

export function AuthScreen({ demoUsers, onAuthenticated }: { demoUsers: AuthSession['demoUsers']; onAuthenticated: () => Promise<void> }) {
  const [register, setRegister] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  async function authenticate(path: string, values: unknown) {
    setPending(true); setError('');
    try { await api(path, 'POST', values); await onAuthenticated(); }
    catch (failure) { setError((failure as Error).message); }
    finally { setPending(false); }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (register && password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    void authenticate(register ? '/auth/register' : '/auth/login', Object.fromEntries(new FormData(event.currentTarget)));
  }
  const inputClass = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100';
  const passwordsDoNotMatch = register && passwordConfirmation.length > 0 && password !== passwordConfirmation;
  return <main className="flex h-[100dvh] min-h-0 items-center justify-center overflow-hidden bg-slate-50 p-0 text-slate-900 sm:p-5">
    <div className="grid h-full w-full overflow-hidden bg-white shadow-sm sm:max-h-[calc(100dvh-2.5rem)] sm:max-w-5xl sm:rounded-3xl sm:border sm:border-slate-200 lg:h-[min(820px,calc(100dvh-2.5rem))] lg:grid-cols-[0.9fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-teal-50 p-10 lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -left-32 -top-28 h-80 w-80 rounded-full bg-teal-200/70 blur-3xl" />
        <div className="relative"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">Health-aware planning</p><h2 className="mt-3 max-w-sm text-3xl font-extrabold leading-tight tracking-tight text-slate-900">Support for every meal, movement, and milestone.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">Build a plan that reflects your health profile and your daily life.</p></div>
        <div className="relative mt-auto grid grid-cols-2 gap-4 pt-8">{landingVisuals.map((visual) => <figure key={visual.label}><div className="aspect-square overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_12px_26px_rgba(15,23,42,0.12)]"><img src={visual.src} alt={visual.label} className="h-full w-full object-cover" /></div><figcaption className="mt-2 text-center text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">{visual.label}</figcaption></figure>)}</div>
      </aside>
      <section className="h-full min-h-0 w-full overflow-y-auto p-7 sm:p-10">
      <div className="mb-8 flex items-center gap-3"><img src="/favia-health-favicon.png" className="h-10 w-10" alt="" /><span className="text-xl font-bold">Favia Health</span></div>
      <div className="mb-7 grid grid-cols-4 gap-2 lg:hidden">{landingVisuals.map((visual) => <img key={visual.label} src={visual.src} alt={visual.label} className="aspect-square w-full rounded-xl border border-slate-100 object-cover shadow-sm" />)}</div>
      <h1 className="text-3xl font-bold">{register ? 'Create your account' : 'Welcome back'}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">Your meals, movement, and health profile in one place.</p>
      <form onSubmit={submit} className="mt-7 space-y-5" aria-busy={pending}>
        <fieldset disabled={pending} className="space-y-5 disabled:opacity-60">
          {register && <><label className="block text-sm font-medium">Name<input name="name" autoComplete="name" required maxLength={100} className={inputClass} /></label><label className="block text-sm font-medium">Username<input name="username" autoComplete="username" required minLength={3} maxLength={30} pattern="[a-zA-Z0-9_]+" title="Use 3–30 letters, numbers, or underscores." className={inputClass} /><span className="mt-2 block text-xs text-slate-500">Use 3–30 letters, numbers, or underscores.</span></label></>}
          {register ? <label className="block text-sm font-medium">Email<input name="email" type="email" autoComplete="email" required maxLength={255} className={inputClass} /></label> : <label className="block text-sm font-medium">Email or username<input name="identifier" autoComplete="username" required maxLength={255} className={inputClass} /></label>}
          <label className="block text-sm font-medium">Password<input name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={register ? 'new-password' : 'current-password'} required minLength={register ? 12 : undefined} maxLength={128} className={inputClass} />{register && <span className="mt-2 block text-xs text-slate-500">Use at least 12 characters.</span>}</label>
          {register && <label className="block text-sm font-medium">Confirm password<input name="password_confirmation" type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} autoComplete="new-password" required aria-invalid={passwordsDoNotMatch} aria-describedby={passwordsDoNotMatch ? 'password-match-error' : undefined} className={`${inputClass} ${passwordsDoNotMatch ? 'border-rose-500 focus:border-rose-600 focus:ring-rose-100' : ''}`} />{passwordsDoNotMatch && <span id="password-match-error" role="alert" className="mt-2 block text-xs font-medium text-rose-600">Passwords do not match.</span>}</label>}
          {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <button disabled={passwordsDoNotMatch} className="w-full cursor-pointer rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300">{pending ? 'Please wait…' : register ? 'Create account' : 'Log in'}</button>
        </fieldset>
      </form>
      <button disabled={pending} onClick={() => { setRegister(!register); setError(''); setPassword(''); setPasswordConfirmation(''); }} className="mt-5 w-full cursor-pointer text-sm font-medium text-teal-700 disabled:cursor-not-allowed">{register ? 'Already have an account? Log in' : 'New to Favia? Sign up'}</button>
      {!register && demoUsers.length > 0 && <div className="mt-8 border-t border-slate-200 pt-5"><p className="text-sm font-semibold">Quick login</p><p className="mt-1 text-xs leading-5 text-slate-500">Open a shared demo account without entering a password.</p><div className="mt-3 flex gap-2">{demoUsers.map(user => <button key={user.email} disabled={pending} onClick={() => void authenticate('/auth/demo', { email: user.email })} className="flex-1 cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50">{user.name}</button>)}</div></div>}
      </section>
    </div>
  </main>;
}

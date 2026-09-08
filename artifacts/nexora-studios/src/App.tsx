import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateInquiry, useHealthCheck } from '@workspace/api-client-react';
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, CircleArrowUp, ExternalLink, Instagram, Linkedin, Menu, Minus, Plus, X } from 'lucide-react';
import editorialImage from '../attached_assets/generated_images/nexora-editorial.jpg';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const health = useHealthCheck();
  const createInquiry = useCreateInquiry();
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({
    businessName: '', contactName: '', email: '', phone: '', website: '',
    projectType: '', projectReason: '', referralSource: '', message: '',
  });

  const update = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createInquiry.mutate({ data: {
      ...form,
      phone: form.phone || undefined,
      website: form.website || undefined,
    }}, {
      onSuccess: (inquiry) => {
        setSubmittedId(inquiry.id);
        setSubmitted(true);
        window.setTimeout(() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' }), 50);
      },
    });
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="top" className="nexora-noise min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-foreground/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-5 lg:px-10">
          <button data-testid="button-brand-home" onClick={() => scrollTo('top')} className="group flex items-center gap-3 text-left">
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden bg-primary text-primary-foreground">
              <span className="font-display text-[25px] leading-none">N</span>
              <span className="absolute bottom-0 right-0 h-2 w-2 bg-accent" />
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[.18em]">Nexora<br />Studios</span>
          </button>
          <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">
            <button data-testid="button-nav-work" onClick={() => scrollTo('work')} className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground transition-colors hover:text-primary">Work</button>
            <button data-testid="button-nav-method" onClick={() => scrollTo('method')} className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground transition-colors hover:text-primary">Method</button>
            <button data-testid="button-nav-contact" onClick={() => scrollTo('contact')} className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground transition-colors hover:text-primary">Start a project</button>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex" data-testid="status-studio-availability">
              <span className={`pulse-dot h-2 w-2 rounded-full ${health.isError ? 'bg-destructive' : 'bg-accent'}`} />
              <span className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">{health.isError ? 'Offline' : 'Booking Q3'}</span>
            </div>
            <button data-testid="button-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center border border-foreground/15 md:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen && <div className="border-t border-foreground/10 bg-background px-5 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {['work', 'method', 'contact'].map((id) => <button data-testid={`button-mobile-nav-${id}`} key={id} onClick={() => scrollTo(id)} className="text-left font-mono text-[11px] uppercase tracking-[.18em]">{id === 'contact' ? 'Start a project' : id}</button>)}
          </div>
        </div>}
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[760px] max-w-[1380px] items-center gap-12 px-5 pb-24 pt-36 lg:grid-cols-[1.12fr_.88fr] lg:px-10 lg:pb-32 lg:pt-44">
          <div className="relative z-10">
            <div className="reveal mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <span className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">Independent digital partner · 2025</span>
            </div>
            <h1 className="reveal reveal-delay-1 max-w-[800px] font-display text-[clamp(4.5rem,10vw,9.4rem)] leading-[.83] tracking-[-.06em] text-foreground">
              Websites<br /><em className="text-primary">with a point</em><br />of view.
            </h1>
            <p className="reveal reveal-delay-2 mt-10 max-w-[440px] text-[17px] leading-[1.6] text-muted-foreground">Nexora turns ambitious businesses into the obvious choice. Strategy, identity, and digital craft — in one sharp, accountable team.</p>
            <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center gap-5">
              <button data-testid="button-hero-start-project" onClick={() => scrollTo('contact')} className="group inline-flex items-center gap-5 bg-primary px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-primary-foreground transition-transform hover:-translate-y-1">
                Start a project <ArrowDownRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
              </button>
              <button data-testid="button-hero-see-work" onClick={() => scrollTo('work')} className="inline-flex items-center gap-2 border-b border-foreground/30 pb-1 font-mono text-[10px] font-bold uppercase tracking-[.16em] transition-colors hover:border-primary hover:text-primary">See selected work <ArrowUpRight size={14} /></button>
            </div>
          </div>
          <div className="relative mx-auto h-[440px] w-full max-w-[520px] lg:h-[570px]">
            <div className="absolute left-[8%] top-[11%] h-[75%] w-[72%] rotate-[-7deg] bg-secondary shadow-2xl hero-orbit" />
            <div className="absolute left-[13%] top-[4%] h-[76%] w-[72%] rotate-[4deg] border border-foreground/20 bg-[#e7cdb8] shadow-xl" />
            <div className="absolute left-[19%] top-[9%] h-[75%] w-[69%] overflow-hidden bg-primary shadow-2xl">
              <img data-testid="img-hero-editorial" src={editorialImage} alt="Abstract vermilion and parchment geometric composition" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-45" />
              <div className="absolute -right-16 -top-10 h-56 w-56 rounded-full border-[1px] border-primary-foreground/30" />
              <div className="absolute -right-3 top-8 h-32 w-32 rounded-full border-[1px] border-primary-foreground/50" />
              <div className="absolute bottom-[-6%] left-[12%] font-display text-[15rem] leading-none text-primary-foreground/95">N</div>
              <div className="absolute bottom-8 left-7 right-7 flex items-end justify-between border-t border-primary-foreground/40 pt-3 text-primary-foreground">
                <span className="font-mono text-[9px] uppercase tracking-[.16em]">Signal / 001</span>
                <span className="font-mono text-[9px] uppercase tracking-[.16em]">Nexora</span>
              </div>
            </div>
            <div className="absolute bottom-[2%] right-0 w-[210px] border border-foreground/20 bg-background p-4 shadow-lg">
              <div className="mb-5 flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-[.16em]">Conversion index</span><span className="h-2 w-2 rounded-full bg-accent" /></div>
              <div className="flex items-end gap-3"><span className="font-display text-6xl leading-none">4.8</span><span className="mb-1 font-mono text-[9px] uppercase text-muted-foreground">× lift<br />avg. launch</span></div>
              <svg viewBox="0 0 180 34" className="mt-4 w-full" fill="none" aria-hidden="true"><path d="M1 31C18 29 17 24 29 25c13 1 11-9 23-7 12 2 10 9 21 5 11-4 18-20 29-15 11 5 14 8 25 1 11-7 18-8 26-7 11 1 13-1 25-1" stroke="hsl(var(--primary))" strokeWidth="2" className="line-draw" /></svg>
            </div>
            <div className="absolute left-0 top-[35%] -rotate-90 font-mono text-[9px] uppercase tracking-[.2em] text-muted-foreground">Designing the difference</div>
          </div>
        </section>

        <section className="border-y border-foreground/15 bg-muted/55">
          <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-6 px-5 py-7 lg:px-10">
            <span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Built for businesses<br />that mean business</span>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-foreground/65">
              <span className="font-display text-2xl italic">Morrow</span><span className="font-mono text-sm font-bold tracking-[-.08em]">FIELDNOTE</span><span className="text-lg font-semibold tracking-[-.08em]">arc/</span><span className="font-display text-2xl">Onda</span><span className="font-mono text-[11px] tracking-[.1em]">CIVIC HOUSE</span>
            </div>
          </div>
        </section>

        <section id="work" className="mx-auto max-w-[1380px] scroll-mt-20 px-5 py-28 lg:px-10 lg:py-40">
          <RevealOnScroll className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div><span className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">01 / Selected work</span><h2 className="mt-5 max-w-[680px] font-display text-6xl leading-[.92] tracking-[-.04em] md:text-8xl">Good taste is<br /><em>good business.</em></h2></div>
            <p className="max-w-[280px] text-sm leading-[1.55] text-muted-foreground">We find the clearest version of your value — then build the site that makes it impossible to miss.</p>
          </RevealOnScroll>
          <div className="grid gap-5 md:grid-cols-12">
            <article className="group relative min-h-[540px] overflow-hidden bg-secondary p-7 text-background md:col-span-7 md:min-h-[650px]">
              <div className="absolute -right-[14%] top-[13%] h-[72%] w-[70%] rotate-[12deg] border border-background/25 bg-[#596158] transition-transform duration-700 group-hover:rotate-[7deg] group-hover:scale-105">
                <div className="absolute inset-5 border border-background/30" /><div className="absolute bottom-6 left-6 font-display text-7xl leading-none">field<br /><em>notes</em></div>
              </div>
              <div className="relative z-10 flex h-full flex-col justify-between"><div className="flex justify-between font-mono text-[9px] uppercase tracking-[.16em] text-background/65"><span>01 — Fieldnote</span><span>Hospitality / NYC</span></div><div className="flex items-end justify-between"><div><h3 className="font-display text-5xl leading-none">A place<br /><em>to linger.</em></h3><p className="mt-4 max-w-[230px] text-sm text-background/65">A warm digital home for a new kind of neighbourhood restaurant.</p></div><ArrowUpRight size={25} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div></div>
            </article>
            <div className="grid gap-5 md:col-span-5">
              <article className="group relative min-h-[370px] overflow-hidden bg-accent p-7">
                <div className="absolute -bottom-20 -right-6 h-64 w-64 rounded-full border-[34px] border-secondary transition-transform duration-700 group-hover:scale-110" />
                <div className="relative flex h-full flex-col justify-between"><div className="flex justify-between font-mono text-[9px] uppercase tracking-[.16em] text-foreground/60"><span>02 — Morrow</span><span>Finance / London</span></div><div><h3 className="max-w-[300px] font-display text-5xl leading-[.86]">Money,<br /><em>made human.</em></h3><div className="mt-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.16em]">Brand + web <ArrowUpRight size={13} /></div></div></div>
              </article>
              <article className="group relative min-h-[280px] overflow-hidden border border-foreground/20 bg-[#d8a98a] p-7">
                <div className="absolute right-8 top-10 grid h-36 w-36 rotate-45 place-items-center border border-foreground/35 transition-transform duration-700 group-hover:rotate-[65deg]"><div className="h-24 w-24 bg-primary" /></div>
                <div className="relative flex h-full flex-col justify-between"><div className="flex justify-between font-mono text-[9px] uppercase tracking-[.16em] text-foreground/60"><span>03 — Onda</span><span>Wellness / LA</span></div><div className="flex items-end justify-between"><h3 className="font-display text-4xl leading-[.88]">Make room<br /><em>for better.</em></h3><ArrowUpRight size={22} /></div></div>
              </article>
            </div>
          </div>
          <div className="mt-10 flex justify-end"><button data-testid="button-all-work" onClick={() => scrollTo('contact')} className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.15em] text-primary">Have a project in mind? <span className="grid h-8 w-8 place-items-center border border-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><ArrowUpRight size={14} /></span></button></div>
        </section>

        <section id="method" className="scroll-mt-20 bg-secondary text-background">
          <div className="mx-auto max-w-[1380px] px-5 py-28 lg:px-10 lg:py-40">
            <RevealOnScroll className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]">
              <div><span className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">02 / The Nexora method</span><h2 className="mt-5 max-w-[450px] font-display text-6xl leading-[.9] tracking-[-.04em] md:text-8xl">No mystery.<br /><em>Just momentum.</em></h2><p className="mt-8 max-w-[330px] text-sm leading-[1.6] text-background/60">The work is collaborative, the steps are visible, and every decision points back to your next business goal.</p></div>
              <div className="divide-y divide-background/20 border-t border-background/20">
                {[
                  ['01', 'Find the signal', 'We get uncomfortably clear on what makes you valuable, who needs to hear it, and why they should care now.'],
                  ['02', 'Make it felt', 'Strategy becomes a visual system with a pulse — words, type, motion, and a point of view people remember.'],
                  ['03', 'Build for yes', 'A fast, flexible website that guides the right people from “interesting” to “let’s talk.”'],
                  ['04', 'Keep it moving', 'Launch is a beginning, not a hand-off. We stay close, learn what works, and tune the signal.'],
                ].map(([number, title, copy]) => <div key={number} className="group grid gap-5 py-7 md:grid-cols-[70px_1fr_1.2fr] md:items-start"><span className="font-mono text-[11px] text-accent">{number}</span><h3 className="font-display text-4xl leading-none transition-colors group-hover:text-accent">{title}</h3><p className="max-w-[330px] text-sm leading-[1.55] text-background/60">{copy}</p></div>)}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-5 py-28 lg:px-10 lg:py-40">
          <RevealOnScroll className="grid gap-12 lg:grid-cols-[1fr_.8fr] lg:items-center">
            <div className="relative border-l-2 border-primary pl-7 md:pl-12"><div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary" /><span className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">A note from the studio</span><blockquote className="mt-7 max-w-[800px] font-display text-5xl leading-[.98] tracking-[-.03em] md:text-7xl">“They didn’t just give us a better website. They gave us a sharper way to talk about the business.”</blockquote><div className="mt-8 flex items-center gap-3"><div className="grid h-9 w-9 place-items-center bg-accent font-mono text-[10px] font-bold">AM</div><div><p className="text-sm font-semibold">Ari Mendoza</p><p className="font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">Co-founder, Fieldnote</p></div></div></div>
            <div className="grid grid-cols-2 gap-3 border-t border-foreground/20 pt-5"><div><span className="font-display text-6xl text-primary md:text-8xl">4.8</span><p className="mt-1 font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">avg. conversion lift</p></div><div><span className="font-display text-6xl md:text-8xl">17</span><p className="mt-1 font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">launches shipped</p></div><div className="col-span-2 mt-8 border-t border-foreground/20 pt-5"><p className="max-w-[300px] text-sm leading-[1.55] text-muted-foreground">Small by design. Senior from day one. No layers between the thinking and the making.</p></div></div>
          </RevealOnScroll>
        </section>

        <section id="contact" className="scroll-mt-20 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-[1380px] px-5 py-24 lg:px-10 lg:py-36">
            <div className="grid gap-16 lg:grid-cols-[.78fr_1.22fr]">
              <div><span className="font-mono text-[10px] uppercase tracking-[.18em] text-primary-foreground/65">03 / Start a project</span><h2 className="mt-5 font-display text-7xl leading-[.83] tracking-[-.05em] md:text-9xl">Make the<br /><em>next move.</em></h2><p className="mt-8 max-w-[330px] text-sm leading-[1.6] text-primary-foreground/70">Tell us enough to start a smart conversation. We’ll reply within two working days with a point of view, not a sales script.</p><div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.14em]"><span className="h-2 w-2 rounded-full bg-accent" /> Currently booking Q3 2025</div></div>
              <div className="bg-background p-6 text-foreground md:p-10">
                {submitted ? <div className="flex min-h-[580px] flex-col justify-between">
                  <div><div className="mb-8 grid h-14 w-14 place-items-center bg-accent"><Check size={28} /></div><span className="font-mono text-[10px] uppercase tracking-[.17em] text-primary">Inquiry received · #{submittedId}</span><h3 className="mt-6 max-w-[520px] font-display text-6xl leading-[.9] md:text-8xl">Good things<br /><em>are moving.</em></h3><p className="mt-7 max-w-[390px] text-sm leading-[1.6] text-muted-foreground">Your brief is with the studio. Expect a thoughtful reply from us within two working days.</p></div>
                  <button data-testid="button-submit-another" onClick={() => { setSubmitted(false); setSubmittedId(null); setForm({ businessName: '', contactName: '', email: '', phone: '', website: '', projectType: '', projectReason: '', referralSource: '', message: '' }); }} className="inline-flex w-fit items-center gap-3 border-b border-foreground/30 pb-2 font-mono text-[10px] uppercase tracking-[.15em] hover:border-primary hover:text-primary">Send another inquiry <ArrowUpRight size={14} /></button>
                </div> : <form onSubmit={submitInquiry} className="space-y-7">
                  <div className="mb-10 flex items-start justify-between"><div><h3 className="font-display text-5xl leading-none">Let’s make<br /><em>something matter.</em></h3><p className="mt-3 text-sm text-muted-foreground">All fields marked * are required.</p></div><span className="font-mono text-[9px] text-muted-foreground">01 / 04</span></div>
                  <div className="grid gap-7 md:grid-cols-2">
                    <Field label="Business name *" value={form.businessName} onChange={update('businessName')} required testId="input-business-name" />
                    <Field label="Your name *" value={form.contactName} onChange={update('contactName')} required testId="input-contact-name" />
                    <Field label="Email address *" type="email" value={form.email} onChange={update('email')} required testId="input-email" />
                    <Field label="Phone number" value={form.phone} onChange={update('phone')} testId="input-phone" />
                    <Field label="Current website" value={form.website} onChange={update('website')} testId="input-website" />
                    <label className="block"><span className="mb-2 block font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground">Project type *</span><select data-testid="select-project-type" required value={form.projectType} onChange={update('projectType')} className="w-full border-b border-foreground/25 bg-transparent py-3 text-sm outline-none transition-colors focus:border-primary"><option value="">Choose one</option><option>New website</option><option>Website redesign</option><option>Brand identity + website</option><option>Ongoing digital partner</option></select></label>
                    <Field label="Why now? *" value={form.projectReason} onChange={update('projectReason')} required testId="input-project-reason" />
                    <Field label="How did you find us? *" value={form.referralSource} onChange={update('referralSource')} required testId="input-referral-source" />
                  </div>
                  <label className="block"><span className="mb-2 block font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground">A little about the project *</span><textarea data-testid="textarea-project-message" required minLength={10} rows={4} value={form.message} onChange={update('message')} placeholder="What are you building, and what would make this a great investment?" className="w-full resize-none border-b border-foreground/25 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary" /></label>
                  {createInquiry.isError && <p data-testid="status-inquiry-error" className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">Something interrupted the send. Check your details and try again.</p>}
                  <div className="flex flex-col gap-4 pt-3 sm:flex-row sm:items-center sm:justify-between"><span className="max-w-[260px] text-[11px] leading-[1.45] text-muted-foreground">By sending this form, you’re inviting a human conversation. No automated pitch deck.</span><button data-testid="button-submit-inquiry" type="submit" disabled={createInquiry.isPending} className="group inline-flex items-center justify-center gap-5 bg-secondary px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-background transition-transform hover:-translate-y-1 disabled:cursor-wait disabled:opacity-60">{createInquiry.isPending ? 'Sending brief…' : 'Send the brief'} <CircleArrowUp size={17} className="transition-transform group-hover:-translate-y-1" /></button></div>
                </form>}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-5 py-28 lg:px-10 lg:py-36">
          <RevealOnScroll className="grid gap-12 md:grid-cols-[.6fr_1.4fr]"><div><span className="font-mono text-[10px] uppercase tracking-[.18em] text-primary">04 / Good to know</span><h2 className="mt-5 font-display text-6xl leading-[.88] md:text-8xl">The short<br /><em>version.</em></h2></div><div className="border-t border-foreground/20">
            {[
              ['What kind of businesses do you work with?', 'Ambitious ones with something real to say. We work best with founders, teams, and operators who see their website as a growth asset — not a box to tick.'],
              ['How long does a project take?', 'Most launches take 8–12 weeks. The right pace gives us room to think clearly, build carefully, and leave you with something that works.'],
              ['Do you work with teams outside New York?', 'Yes. Nexora is based in New York and works with thoughtful teams everywhere. Good work travels well.'],
              ['What happens after I enquire?', 'A senior person from the studio reads every brief. If there’s a fit, we’ll set up a 30-minute working session and come prepared.'],
            ].map(([question, answer], index) => <div key={question} className="border-b border-foreground/20"><button data-testid={`button-faq-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left font-display text-3xl leading-none md:text-4xl"><span>{question}</span>{openFaq === index ? <Minus size={20} className="shrink-0 text-primary" /> : <Plus size={20} className="shrink-0 text-primary" />}</button>{openFaq === index && <p data-testid={`text-faq-answer-${index}`} className="max-w-[600px] pb-7 pr-10 text-sm leading-[1.6] text-muted-foreground">{answer}</p>}</div>)}
          </div></RevealOnScroll>
        </section>
      </main>
      <footer className="border-t border-foreground/15 bg-muted/55">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-12 px-5 py-12 lg:px-10"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><button data-testid="button-footer-home" onClick={() => scrollTo('top')} className="flex items-center gap-3 text-left"><span className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground"><span className="font-display text-[25px] leading-none">N</span></span><span className="font-mono text-[11px] font-bold uppercase tracking-[.18em]">Nexora<br />Studios</span></button><p className="mt-6 max-w-[250px] text-sm leading-[1.5] text-muted-foreground">Digital partners for businesses with somewhere better to go.</p></div><div className="flex gap-7"><a data-testid="link-instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="font-mono text-[10px] uppercase tracking-[.16em] hover:text-primary"><Instagram size={16} /></a><a data-testid="link-linkedin" href="https://linkedin.com" target="_blank" rel="noreferrer" className="font-mono text-[10px] uppercase tracking-[.16em] hover:text-primary"><Linkedin size={16} /></a><a data-testid="link-email" href="mailto:hello@nexora.studio" className="font-mono text-[10px] uppercase tracking-[.16em] hover:text-primary">Email us <ExternalLink size={12} className="ml-1 inline" /></a></div></div><div className="flex flex-col justify-between gap-3 border-t border-foreground/15 pt-5 font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground md:flex-row"><span>© 2025 Nexora Studios</span><span>Made with conviction in New York</span><button data-testid="button-back-to-top" onClick={() => scrollTo('top')} className="flex items-center gap-2 hover:text-primary">Back to top <ChevronDown size={13} className="rotate-180" /></button></div></div>
      </footer>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = false, testId }: { label: string; value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean; testId: string }) {
  return <label className="block"><span className="mb-2 block font-mono text-[9px] uppercase tracking-[.13em] text-muted-foreground">{label}</span><input data-testid={testId} type={type} required={required} value={value} onChange={onChange} className="w-full border-b border-foreground/25 bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary" /></label>;
}

function RevealOnScroll({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`scroll-reveal ${visible ? 'scroll-reveal-visible' : ''} ${className}`}>{children}</div>;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

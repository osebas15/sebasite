import { Component, For, Show } from 'solid-js';
import { profile } from '../content/profile';
import styles from './Home.module.css';
import { reveal } from './reveal';
import Barcode from './Barcode';
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons';
import teaPhoto from '../assets/sebas_w_tea_web.jpg';

const navLinks = [
  { href: '#work', label: 'Work' },
  { href: '#route', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#lab', label: 'Lab' },
  { href: '#contact', label: 'Contact' },
];

export const Nav: Component = () => (
  <nav class={styles.nav} aria-label="Main">
    <div class={`container ${styles.navInner}`}>
      <a href="#top" class={styles.navMark} aria-label={`${profile.name}, back to top`}>SA</a>
      <ul class={styles.navLinks}>
        <For each={navLinks}>
          {(link) => <li><a href={link.href}>{link.label}</a></li>}
        </For>
      </ul>
    </div>
  </nav>
);

const ContactActions: Component<{ primaryResume?: boolean }> = (props) => (
  <div class={styles.actions}>
    <a class={`btn ${props.primaryResume ? 'btn-primary' : ''}`} href={profile.resumePdf} target="_blank" rel="noopener noreferrer">
      <FileIcon /> Resume (PDF)
    </a>
    <a class={`btn ${props.primaryResume ? '' : 'btn-primary'}`} href={`mailto:${profile.email}`}>
      <MailIcon /> Email
    </a>
    <a class="btn" href={profile.links.linkedin.href} target="_blank" rel="noopener noreferrer">
      <LinkedInIcon /> LinkedIn
    </a>
    <a class="btn" href={profile.links.github.href} target="_blank" rel="noopener noreferrer">
      <GitHubIcon /> GitHub
    </a>
  </div>
);

export const Hero: Component = () => (
  <header id="top" class={`container ${styles.hero}`}>
    <div class={styles.heroLabel}>
      <div class={styles.heroMeta}>
        <span>Ship from · {profile.location}</span>
        <span>TRK SA-2014-2026</span>
      </div>
      <h1 class={styles.heroName}>
        Sebastian<br />Aguirre
      </h1>
      <p class={styles.heroRole}>{profile.title}</p>
      <p class={styles.heroLead}>{profile.tagline}</p>
      <dl class={styles.heroFields}>
        <div>
          <dt class="label">Based in</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt class="label">Shipping since</dt>
          <dd>2014</dd>
        </div>
        <div>
          <dt class="label">Specialty</dt>
          <dd>iOS · Web · Enterprise</dd>
        </div>
      </dl>
      <div class={styles.perforation} aria-hidden="true" />
      <ContactActions primaryResume />
    </div>
  </header>
);

export const ProofStrip: Component = () => (
  <section class={`container ${styles.section}`} aria-label="Highlights">
    <ul class={styles.proofStrip}>
      <For each={profile.proof}>
        {(item) => (
          <li class={styles.proofItem} ref={reveal}>
            <span class={styles.stamp}>{item.value}</span>
            <span class={styles.proofCaption}>{item.caption}</span>
          </li>
        )}
      </For>
    </ul>
  </section>
);

const SectionHeading: Component<{ label: string; title: string; id: string }> = (props) => (
  <div class={styles.sectionHeading}>
    <span class="label">{props.label}</span>
    <h2 id={props.id}>{props.title}</h2>
  </div>
);

export const RecentWork: Component = () => {
  const telus = profile.jobs[0];
  return (
    <section id="work" class={`container ${styles.section}`} aria-labelledby="work-title">
      <SectionHeading label={`${telus.company} · ${telus.dates}`} title="Recent work" id="work-title" />
      <p class={styles.sectionIntro}>{telus.role}</p>
      <div class={styles.clientGrid}>
        <For each={telus.clients}>
          {(client) => (
            <article class={styles.clientCard} ref={reveal}>
              <span class="label">Client</span>
              <h3>{client.client}</h3>
              <Show when={client.metric}>
                <p class={styles.metric}>{client.metric}</p>
              </Show>
              <ul class={styles.bullets}>
                <For each={client.bullets}>{(b) => <li>{b}</li>}</For>
              </ul>
              <div class={styles.chips}>
                <For each={client.stack}>{(s) => <span class="chip">{s}</span>}</For>
              </div>
            </article>
          )}
        </For>
      </div>
    </section>
  );
};

export const Route: Component = () => (
  <section id="route" class={`container ${styles.section}`} aria-labelledby="route-title">
    <SectionHeading label="2014 → 2026" title="The route so far" id="route-title" />
    <ol class={styles.route}>
      <For each={profile.jobs}>
        {(job, i) => (
          <li class={styles.stop} ref={reveal}>
            <span class={styles.stopNode} aria-hidden="true" />
            <div class={styles.stopDate}>{job.dates}</div>
            <div class={styles.stopBody}>
              <h3>
                {job.company}
                <Show when={job.location}>
                  <span class={styles.stopLocation}> · {job.location}</span>
                </Show>
              </h3>
              <Show when={job.role}>
                <p class={styles.stopRole}>{job.role}</p>
              </Show>
              <Show
                when={job.clients}
                fallback={
                  <Show when={job.bullets.length > 0}>
                    <details class={styles.details} open={i() < 2}>
                      <summary>Details</summary>
                      <ul class={styles.bullets}>
                        <For each={job.bullets}>{(b) => <li>{b}</li>}</For>
                      </ul>
                    </details>
                  </Show>
                }
              >
                <p class={styles.stopRole}>
                  Clients: {job.clients!.map((c) => c.client).join(', ')} — <a href="#work">see recent work</a>
                </p>
              </Show>
            </div>
          </li>
        )}
      </For>
    </ol>
  </section>
);

export const Skills: Component = () => (
  <section id="skills" class={`container ${styles.section}`} aria-labelledby="skills-title">
    <SectionHeading label="Manifest" title="What's in the box" id="skills-title" />
    <dl class={styles.skills}>
      <For each={profile.skills}>
        {(row) => (
          <div class={styles.skillRow}>
            <dt class="label">{row.label}</dt>
            <dd class={styles.chips}>
              <For each={row.items}>{(item) => <span class="chip">{item}</span>}</For>
            </dd>
          </div>
        )}
      </For>
    </dl>
  </section>
);

export const OffTheClock: Component = () => (
  <section class={`container ${styles.section}`} aria-labelledby="off-title">
    <div class={styles.offClock}>
      <figure class={styles.photoFrame}>
        <img src={teaPhoto} alt="Sebastian smiling at home with a mug of tea" loading="lazy" width="900" height="1176" />
      </figure>
      <div>
        <SectionHeading label="Off the clock" title="The person behind the commits" id="off-title" />
        <ul class={styles.personal}>
          <For each={profile.personal}>{(line) => <li>{line}</li>}</For>
        </ul>
      </div>
    </div>
  </section>
);

export const Footer: Component = () => (
  <footer id="contact" class={styles.footer}>
    <div class={`container ${styles.footerInner}`}>
      <span class="label">Contact</span>
      <h2 class={styles.footerTitle}>Let's ship something.</h2>
      <p class={styles.footerLead}>
        The fastest way to reach me is email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      <ContactActions />
      <Barcode value={profile.website} class={styles.barcode} />
      <div class={styles.footerMeta}>
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Last updated {profile.updated}</span>
      </div>
    </div>
  </footer>
);

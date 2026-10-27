import { Component, Show, onMount } from 'solid-js';
import { useParams } from '@solidjs/router';

import QRGenerator from './shared/components/QRCodeCreator';
import ShareListCreator from './shared/components/ShareListCreator';
import ShareList from './shared/components/sharelist/ShareList';
import ChatAppSolid from './resume_bot/ChatAppSolid';

import { Footer, Hero, Nav, OffTheClock, ProofStrip, RecentWork, Route, Skills } from './home/Sections';
import Parcel from './home/Parcel';
import styles from './home/Home.module.css';

const Home: Component = () => {
  const params = useParams();

  onMount(() => {
    if (params.list_id) {
      document.getElementById('lab')?.scrollIntoView();
    }
  });

  return (
    <>
      <a class={styles.skipLink} href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <ProofStrip />
        <RecentWork />
        <Route />
        <Skills />
        <section id="lab" class={`container ${styles.section}`} aria-labelledby="lab-title">
          <div class={styles.sectionHeading}>
            <span class="label">Lab</span>
            <h2 id="lab-title">Things you can try</h2>
          </div>
          <p class={styles.sectionIntro}>Small tools I built and host here. Ask the AI about my experience, share a checklist, or make a QR code.</p>
          <div class={styles.labGrid}>
            <Parcel number={1} title="Ask my resume" class={styles.labChat}>
              <ChatAppSolid />
            </Parcel>
            <Parcel number={2} title="Share a checklist">
              <Show when={params.list_id} keyed fallback={<ShareListCreator />}>
                {(listId) => <ShareList list_id={listId} />}
              </Show>
            </Parcel>
            <Parcel number={3} title="QR code">
              <QRGenerator placeholder="https://sebasite.netlify.app/" />
            </Parcel>
          </div>
        </section>
        <OffTheClock />
      </main>
      <Footer />
    </>
  );
};

export default Home;

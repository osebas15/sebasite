import { Component, JSX } from 'solid-js';
import styles from './Home.module.css';

interface ParcelProps {
  number: number;
  title: string;
  class?: string;
  children: JSX.Element;
}

const Parcel: Component<ParcelProps> = (props) => {
  const headingId = `parcel-${props.number}`;
  return (
    <section class={`${styles.parcel} ${props.class ?? ''}`} aria-labelledby={headingId}>
      <header class={styles.parcelHeader}>
        <span>Parcel {String(props.number).padStart(2, '0')}</span>
        <span aria-hidden="true">·</span>
        <h3 id={headingId}>{props.title}</h3>
      </header>
      <div class={styles.parcelBody}>{props.children}</div>
    </section>
  );
};

export default Parcel;

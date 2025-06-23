import styles from '@/app/common/styles.module.css'

export default function Home() {
  return (
    <>
      <article>
        <p>Quickly navigate to either <a href="/viewer" title="FormViewer example" className={styles.underlined}>FormViewer</a> or <a
          href="/builder" title="FormBuilder example" className={styles.underlined}>FormBuilder</a>.</p>
        <p>Links to the documentation are in the footer.</p>
      </article>
      <div className={styles.ctas}>
        <a
          className={styles.primary}
          href="/viewer"
        >
          FormViewer
        </a>
        <a
          href="/builder"
          className={styles.secondary}
        >
          FormBuilder
        </a>
      </div>
    </>
  )
}

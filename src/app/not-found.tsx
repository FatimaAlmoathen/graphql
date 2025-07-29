import Link from 'next/link';
import Image from 'next/image';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      {/* Background Image */}
      <div className={styles.backgroundImage}>
        <Image
          src="/pixelated-cloud.png"
          alt="Pixelated cloud background"
          style={{ objectFit: 'cover' }}
          priority
          quality={100}
          fill
        />
      </div>
      
      {/* 404 Content */}
      <div className={styles.notFoundContent}>
        <div className={styles.notFoundBox}>
          <h1 className={styles.notFoundTitle}>404</h1>
          <h2 className={styles.notFoundSubtitle}>Page Not Found</h2>
          <p className={styles.notFoundMessage}>
            The page you are looking for does not exist or has been moved.
          </p>
          
          <Link
            href="/profile"
            className={styles.homeButton}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
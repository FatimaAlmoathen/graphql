'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import pixelatedCloud from './pixelated cloud.png';
import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      {/* Background Image */}
      <div className={styles.backgroundImage}>
        <Image
          src={pixelatedCloud}
          alt="Pixelated cloud background"
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={100}
          placeholder="blur"
        />
      </div>
      
      {/* Error Content */}
      <div className={styles.errorContent}>
        <div className={styles.errorBox}>
          <h1 className={styles.errorTitle}>Oops!</h1>
          <h2 className={styles.errorSubtitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>
            {error.message || 'An unexpected error occurred'}
          </p>
          
          <div className={styles.errorActions}>
            <button
              onClick={reset}
              className={styles.tryAgainButton}
            >
              Try Again
            </button>
            <Link
              href="/"
              className={styles.homeLink}
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
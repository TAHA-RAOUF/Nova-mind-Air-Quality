import styles from '../style/dashboard.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Logo/Header Section */}
      <div className={styles.logoSection}>
        <span className={styles.logoIcon} />
        <span className={styles.logoText}>nafas</span>
      </div>

      {/* Navigation */}
      <nav className={styles.menuNav}>
        <button className={styles.menuActive}>
          <span className={styles.menuDot} />
          Dashboard
        </button>
        <div className={styles.menuGroup}>
          <div className={styles.menuLabel}>Account Management</div>
          <ul>
            <li>Account</li>
            <li>Organization</li>
            <li>User</li>
          </ul>
        </div>
        <div className={styles.menuGroup}>
          <div className={styles.menuLabel}>Organization Utilities</div>
          <ul>
            <li>Store</li>
            <li>Device</li>
          </ul>
        </div>
        <div className={styles.menuGroup}>
          <div className={styles.menuLabel}>Store Utilities</div>
          <ul>
            <li>Room</li>
            <li>Device</li>
          </ul>
        </div>
      </nav>

      {/* Status Card: Bottom Section */}
      <div className={styles.statusCard}>
        <div className={styles.co2}>
          <span className={styles.co2Value}>79</span>
          <span className={styles.co2Status}>CO₂ Normal</span>
        </div>
        <img className={styles.cardImage} src="/apartment.jpg" alt="Apartment" />
        <button className={styles.cardButton}>All Apartments</button>
      </div>
    </aside>
  );
}

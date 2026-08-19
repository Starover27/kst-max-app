import { Avatar } from './Avatar';
import styles from './DoctorCard.module.css'; // Импортируем модульный CSS

interface DoctorCardProps {
  name: string;
  specialty?: string;
  experience?: string;
  rating?: number;
  price?: string;
  avatar?: string;
}

export function DoctorCard({ name, specialty, experience, rating, price, avatar }: DoctorCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <Avatar src={avatar} size={64} /> {/* Передаю числовое значение */}
        <div className={styles.info}>
          <h3 className={styles.name}>{name}</h3>
          {specialty && <p className={styles.specialty}>{specialty}</p>}
          {experience && <p className={styles.experience}>{experience}</p>}
        </div>
        {rating !== undefined && (
          <div className={styles.rating}>
            <span>★</span> {rating.toFixed(1)}
          </div>
        )}
      </div>
      {price && <div className={styles.price}>{price}</div>}
    </article>
  );
}
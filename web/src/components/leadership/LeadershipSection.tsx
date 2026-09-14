import Image from "next/image";

import type { LeadershipMember } from "@/services/leadership";
import type { SiteLocale } from "@/types/cms";

import styles from "./LeadershipSection.module.css";

type Props = {
  locale: SiteLocale;
  members: LeadershipMember[];
};

function paragraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function LeadershipSection({ locale, members }: Props) {
  const isId = locale === "id";

  if (members.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.heading}>
          <span>{isId ? "Tim Kepemimpinan" : "Leadership Team"}</span>

          <h2>
            {isId
              ? "Pengalaman lintas fungsi yang menghubungkan strategi dan eksekusi."
              : "Cross-functional experience connecting strategy and execution."}
          </h2>
        </div>

        <div className={styles.grid}>
          {members.map((member, index) => (
            <article className={styles.profile} key={member.id}>
              <div className={styles.photo}>
                {member.photo?.src ? (
                  <Image
                    src={member.photo.src}
                    alt={member.photo.alt}
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                    className={styles.image}
                    unoptimized
                  />
                ) : (
                  <div className={styles.photoFallback}>{member.name.charAt(0)}</div>
                )}

                <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className={styles.profileBody}>
                <div className={styles.identity}>
                  <h3>{member.name}</h3>
                  <p>{member.position}</p>
                </div>

                <div className={styles.biography}>
                  {paragraphs(member.biography).map((paragraph, paragraphIndex) => (
                    <p key={`${member.id}-${paragraphIndex}`}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

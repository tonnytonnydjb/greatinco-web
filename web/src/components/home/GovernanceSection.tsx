import Image from "next/image";
import type { CertificationContent, HomepageSectionContent } from "@/types/cms";

type Props = {
  governance: HomepageSectionContent;
  certifications: CertificationContent[];
};

export function GovernanceSection({ governance, certifications }: Props) {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <section className="governance-section">
      <div className="gi-container governance-editorial">
        <div className="governance-intro">
          <div className="gi-eyebrow">{governance.eyebrow}</div>

          <h2>{governance.title}</h2>
          <p>{governance.description}</p>
        </div>

        <div className="governance-credentials">
          {certifications.map((item, index) => (
            <article className="governance-credential" key={item.id}>
              <div className="governance-credential-index">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="governance-logo-wrap">
                <div className="governance-logo-box">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="150px"
                    className="governance-logo"
                  />
                </div>
              </div>

              <div className="governance-credential-copy">
                <strong>{item.name}</strong>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

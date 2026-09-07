import Image from "next/image";
import type { ClientLogo } from "@/types/cms";

type Props = {
  clients: ClientLogo[];
  locale: "id" | "en";
};

export function ClientMarquee({ clients, locale }: Props) {
  if (clients.length === 0) {
    return null;
  }

  const marqueeClients = [...clients, ...clients];

  return (
    <section className="client-marquee-section">
      <div className="gi-container client-marquee-heading">
        <span>
          {locale === "id"
            ? "Dipercaya oleh institusi keuangan terkemuka"
            : "Trusted by leading financial institutions"}
        </span>
      </div>

      <div className="client-marquee">
        <div className="client-marquee-track">
          {marqueeClients.map((client, index) => (
            <div className="client-marquee-item" key={`${client.name}-${index}`}>
              <div className="client-marquee-logo-box">
                <Image
                  src={client.image.src}
                  alt={client.image.alt}
                  fill
                  sizes="180px"
                  className="client-marquee-logo"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

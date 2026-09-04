import Image from "next/image";
import type { ClientLogo } from "@/types/cms";

type Props = {
  clients: ClientLogo[];
  locale: "id" | "en";
};

export function ClientMarquee({ clients, locale }: Props) {
  const repeatedClients = [...clients, ...clients];

  return (
    <section className="client-marquee-section">
      <div className="gi-container client-marquee-heading">
        <span>
          {locale === "id"
            ? "Dipercaya oleh institusi keuangan terkemuka"
            : "Trusted by leading financial institutions"}
        </span>
      </div>

      <div className="client-marquee-viewport">
        <div className="client-marquee-track">
          {repeatedClients.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="client-logo-item"
              aria-hidden={index >= clients.length}
            >
              <Image
                src={client.logo.src}
                alt={index >= clients.length ? "" : client.logo.alt}
                width={180}
                height={72}
                sizes="180px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

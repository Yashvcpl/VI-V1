import Image from "next/image";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leadershipMembers as leadershipTable } from "@/lib/db/schema";

export async function TeamGridSection({ data, isFirstOnPage }: { data: { eyebrow?: string; heading: string }; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  const members: Array<{
    id: string;
    name: string;
    role?: string | null;
    photoUrl?: string | null;
    photoAlt?: string | null;
    bio?: string | null;
    linkedinUrl?: string | null;
  }> = await db
    .select()
    .from(leadershipTable)
    .orderBy(asc(leadershipTable.sortOrder))
    .catch(() => [] as Array<{
      id: string;
      name: string;
      role?: string | null;
      photoUrl?: string | null;
      photoAlt?: string | null;
      bio?: string | null;
      linkedinUrl?: string | null;
    }>);

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container-content">
        <div className="mx-auto max-w-3xl text-center">
          {data.eyebrow && <p className="eyebrow text-growth-700">{data.eyebrow}</p>}
          <Heading className="mt-3 text-3xl font-bold text-ledger sm:text-4xl">{data.heading}</Heading>
        </div>

        {members.length === 0 ? (
          <p className="mt-8 font-body text-ledger/60">Add team members in the admin to show them here.</p>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
              <li key={member.id} className="flip-card h-full min-h-[460px] xl:min-h-[480px]">
                <div className="flip-card-inner rounded-[28px] bg-transparent shadow-[0_26px_90px_-42px_rgba(16,48,80,0.2)] transition-transform duration-700">
                  <div className="flip-card-face flip-card-front overflow-hidden rounded-[28px] bg-paper">
                    {member.photoUrl ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={member.photoUrl}
                          alt={member.photoAlt ?? member.name}
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 45vw, 90vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-[28px] bg-growth-100 text-4xl font-semibold text-growth-700">
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                    )}
                  </div>

                  <div className="flip-card-face flip-card-back rounded-[28px] bg-paper">
                    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                      <h3 className="text-2xl font-semibold text-ledger">{member.name}</h3>
                      <p className="text-sm font-semibold text-growth-700">{member.role}</p>
                      {member.bio ? <p className="mt-2 text-sm leading-6 text-ledger/80">{member.bio}</p> : null}
                      {member.linkedinUrl ? (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 rounded-full bg-growth-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-growth-800"
                          aria-label={`${member.name} LinkedIn profile`}
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.337 1H3.663A2.68 2.68 0 001 3.663v12.674A2.68 2.68 0 003.663 19h12.674A2.68 2.68 0 0019 16.337V3.663A2.68 2.68 0 0016.337 1zM5.997 16.5H3.5V7.5h2.497v9zm-1.25-10.8a1.45 1.45 0 110-2.9 1.45 1.45 0 010 2.9zm10.753 10.8h-2.497v-4.65c0-1.11-.02-2.534-1.545-2.534-1.545 0-1.78 1.206-1.78 2.45v4.734H6.99V7.5h2.397v1.306h.034c.334-.634 1.15-1.303 2.366-1.303 2.53 0 3 1.665 3 3.834v5.163z" />
                          </svg>
                          LinkedIn
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

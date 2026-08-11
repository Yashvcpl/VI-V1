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

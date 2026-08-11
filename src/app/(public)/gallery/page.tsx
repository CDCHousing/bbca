import Image from "next/image";
import PageHero from "@/components/PageHero";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <>
      <PageHero title="Photo Archive" />

      <section className="bg-white py-14 pb-20">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="mb-10 text-center">
            <p className="text-[12.5px] font-bold uppercase tracking-[2px] mb-3 text-[#DA9028]">
              Photo Archive
            </p>
            <h2 className="text-[32px] font-extrabold text-[#1B2A52] leading-tight tracking-tight">
              Celebrating Our Community
            </h2>
          </div>

          {images.length === 0 ? (
            <p className="text-center text-[#6E7A8C] py-16">No photos yet.</p>
          ) : (
            <div className="[column-count:1] [column-gap:16px] sm:[column-count:2] lg:[column-count:3]">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group break-inside-avoid mb-4 rounded-xl overflow-hidden relative bg-[#c4cbd6]"
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.caption ?? "Gallery image"}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-105"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-[13px] font-medium leading-snug">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

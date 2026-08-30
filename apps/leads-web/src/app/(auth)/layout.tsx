import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#1C2A43] px-4 py-10 sm:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center sm:min-h-[calc(100vh-8rem)]">
        <div className="w-full rounded-3xl border border-white/10 bg-[#101d32]/90 px-6 py-10 shadow-2xl shadow-black/20 backdrop-blur-sm sm:px-12 sm:py-12">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/brand/logo.png"
              alt="ObraKit"
              width={128}
              height={128}
              priority
              className="h-28 w-28 object-contain sm:h-32 sm:w-32"
            />
          </div>

          {/* Section label */}
          <div className="mb-8 flex items-center gap-5">
            <div className="h-px flex-1 bg-white/10" />

            <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.22em] text-[#F19A06]">
              Acceso a ObraKit
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}

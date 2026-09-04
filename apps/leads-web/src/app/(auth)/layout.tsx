import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#1C2A43] px-4 py-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-xl items-center justify-center sm:min-h-[calc(100vh-4rem)]">
        <div className="w-full rounded-3xl border border-white/10 bg-[#101d32]/90 px-6 py-7 shadow-2xl shadow-black/20 backdrop-blur-sm sm:px-8 sm:py-8">
          {/* Logo */}
          <div className="mb-5 flex justify-center">
            <Image
              src="/images/brand/logo.png"
              alt="ObraKit"
              width={96}
              height={96}
              priority
              className="h-20 w-20 object-contain sm:h-24 sm:w-24"
            />
          </div>

          {/* Section label */}
          <div className="mb-6 flex items-center gap-4">
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

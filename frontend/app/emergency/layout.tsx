import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medix — Emergency Health Information",
  description: "Public emergency health record for first responders and paramedics.",
};

export default function EmergencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
}

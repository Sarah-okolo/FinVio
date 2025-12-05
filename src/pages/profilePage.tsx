import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const user = {
    name: "Sahra Elmi",
    email: "sahra.elmi@finvio.com",
    role: "Product Lead",
    joined: "Jan 2024",
  };

  const stats = [
    { label: "Pending invoices", value: 12 },
    { label: "Due invoices", value: 3 },
    { label: "Clients", value: 18 },
  ];

  return (
    <div className="space-y-6">
      <button
        className="font-bold mb-5 flex items-center gap-1 cursor-pointer"
        onClick={() => history.back()}
      >
        <ArrowLeft /> Go Back
      </button>

      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl mb-1">Profile</h1>
          <p className="text-muted-foreground font-medium">Account Overview</p>
        </div>

        <button className="rounded-full cursor-pointer bg-accent text-white px-4 py-2 font-semibold shadow-sm hover:scale-105 transition">
          Edit Profile
        </button>
      </header>

      <section className="bg-card p-6 md:p-8 rounded-xl shadow shadow-muted/10 flex flex-col md:flex-row gap-6 items-center">
        <img
          src="/profile-img.png"
          alt={`${user.name} profile`}
          className="size-20 md:size-24 rounded-full object-cover border border-muted-foreground/20"
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full">
          <div className="space-y-1">
            <p className="text-xl font-bold">{user.name}</p>
            <p className="text-muted-foreground font-semibold">{user.role}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
            <InfoPill label="Joined" value={user.joined} />
            <InfoPill label="Status" value="Active" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-secondary/40 rounded-xl p-4 border border-muted/10"
          >
            <p className="text-sm text-muted-foreground font-semibold">
              {stat.label}
            </p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="bg-card p-6 rounded-xl shadow shadow-muted/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">Preferences</p>
            <p className="text-muted-foreground text-sm">
              Keep your account details up to date
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PreferenceRow label="Default currency" value="USD ($)" />
          <PreferenceRow label="Language" value="English (US)" />
        </div>
      </section>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/20 border border-muted/10 rounded-lg px-3 py-2">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}

function PreferenceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg bg-secondary/40 border border-muted/10">
      <p className="text-sm text-muted-foreground font-semibold">{label}</p>
      <p className="font-bold mt-1">{value}</p>
    </div>
  );
}

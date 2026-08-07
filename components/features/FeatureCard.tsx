interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 transition duration-300 hover:-translate-y-2 hover:border-violet-500/50">
      <div className="mb-6 text-5xl">{icon}</div>

      <h3 className="mb-3 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="text-zinc-400">
        {description}
      </p>
    </div>
  );
}
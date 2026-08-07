interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export default function StepCard({
  number,
  title,
  description,
}: StepCardProps) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 text-center transition duration-300 hover:-translate-y-2 hover:border-violet-500/40">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-2xl font-bold text-white">
        {number}
      </div>

      <h3 className="mb-3 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="text-zinc-400">
        {description}
      </p>
    </div>
  );
}
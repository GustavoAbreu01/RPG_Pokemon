import { Progress } from "@/components/ui/progress";

export default function HealthBar({ current, max }) {
  return (
    <progress value={current} max={max}  className="w-40 h-3 rounded-full" />
  );
}

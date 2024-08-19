import { api } from "~/trpc/react";

export interface Props {
  inputName?: string;
  onChange?: (deity: string) => void;
}

export function DeityPicker({ inputName = "deity", onChange }: Props) {
  const deities = api.ai.getDeities.useQuery().data;

  return (
    <select
      name={inputName}
      defaultValue=""
      className="select select-bordered"
      required
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option disabled value="">
        Pick a deity:
      </option>

      {deities?.map((deity) => (
        <option key={deity.id} value={deity.id}>
          {deity.name}
        </option>
      ))}
    </select>
  );
}

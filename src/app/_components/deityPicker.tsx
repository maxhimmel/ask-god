"use client";

import { useDeities } from "~/app/hooks/chatHooks";

export interface Props {
  className?: string;
  inputName?: string;
  onChange?: (deity: string) => void;
}

export function DeityPicker({
  className,
  inputName = "deity",
  onChange,
}: Props) {
  const deities = useDeities();

  if (deities) {
    deities.sort((a, b) => sortAlphabetically(a.name, b.name));
  }

  return (
    <select
      name={inputName}
      defaultValue=""
      className={`select select-bordered ${className}`}
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

function sortAlphabetically(a: string, b: string) {
  // sort names alphabetically but ignore "the" at the beginning
  const nameA = a.replace(/^the /i, "");
  const nameB = b.replace(/^the /i, "");
  return nameA.localeCompare(nameB);
}

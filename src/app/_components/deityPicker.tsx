const deities = ["Jesus", "Buddha", "Krishna", "Allah"];

export interface Props {
  inputName?: string;
  onChange?: (deity: string) => void;
}

export function DeityPicker({ inputName = "deity", onChange }: Props) {
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

      {deities.map((deity) => (
        <option key={deity} value={deity}>
          {deity}
        </option>
      ))}
    </select>
  );
}

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select";

  import { toTitleCase } from "@/lib/utils";
  
  interface FilterDropdownProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }
  
  export default function FilterDropdown({
    label,
    value,
    options,
    onChange,
  }: FilterDropdownProps) {
    return (
      <div className="mb-4 flex items-center">
        <label className="mr-2 font-medium">{label}:</label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {options.map((item, index) => (
              <SelectItem key={index} value={item}>
                {toTitleCase(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  
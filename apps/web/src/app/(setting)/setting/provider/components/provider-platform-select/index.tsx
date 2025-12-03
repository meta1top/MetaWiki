"use client";

import Image from "next/image";

import { Select } from "@meta-1/design";
import { useProviderPlatform } from "@/hooks/use.provider.platform";

export type ProviderPlatformSelectProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  availablePlatforms?: string[];
};

export const ProviderPlatformSelect: React.FC<ProviderPlatformSelectProps> = (props) => {
  const { value, defaultValue, onChange, placeholder, availablePlatforms } = props;
  const platforms = useProviderPlatform();

  const filteredPlatforms = availablePlatforms
    ? platforms.filter((p) => availablePlatforms.includes(p.key))
    : platforms;

  const options = filteredPlatforms.map((platform) => ({
    value: platform.key,
    label: (
      <div className="flex items-center gap-2">
        <Image alt={platform.name} className="size-5 object-contain" height={20} src={platform.icon} width={20} />
        <span>{platform.name}</span>
      </div>
    ),
  }));

  return (
    <Select defaultValue={defaultValue} onChange={onChange} options={options} placeholder={placeholder} value={value} />
  );
};

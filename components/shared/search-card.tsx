"use client";

import { Search } from "lucide-react";
import { useId, useState } from "react";

type SearchCardProps = {
  placeholder: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
};

export function SearchCard({
  placeholder,
  defaultValue = "",
  onSearch,
}: SearchCardProps) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value.trim());
      }}
      className="flex min-h-[74px] items-center gap-4 rounded-lg border bg-card py-3.5 pr-6 pl-6"
    >
      <div className="flex flex-1 flex-col gap-2.5">
        <label htmlFor={id} className="text-xs font-medium text-[#1e1e1e]">
          Pesquisa
        </label>
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#9e9e9e]"
        />
      </div>
      <button
        type="submit"
        className="flex h-[46px] w-[130px] shrink-0 items-center justify-center gap-2 rounded-md bg-[#1c1d26] text-sm font-medium text-white transition-colors hover:bg-[#1c1d26]/90"
      >
        <Search className="size-3.5" />
        Pesquisar
      </button>
    </form>
  );
}

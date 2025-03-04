import { InputBase } from "@mui/material";
import { IconSearch } from "@tabler/icons-react";

const SearchBar = ({ placeholder, setSearch }: { placeholder: string, setSearch: (search: string) => void }) => {
  return (
    <div className="flex items-center bg-white p-2 rounded-full shadow-md mt-3 mx-4">
      <IconSearch size={24} className="text-gray-500 ml-2" />
      <InputBase
        placeholder={placeholder}
        className="ml-3 flex-1 text-gray-700"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;

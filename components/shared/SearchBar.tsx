import { useState, useEffect } from 'react';
import { InputBase, Paper, ClickAwayListener } from "@mui/material";
import { IconSearch } from "@tabler/icons-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import useStore from '@/store/useLanguageStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '@/constant';

interface SearchSuggestion {
  id: string;
  name: string;
  type: string;
  imageUrl?: string;
}

const SearchBar = ({ placeholder, setSearch }: { placeholder: string, setSearch: (search: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const t = useTranslations('home');
  const { locale } = useStore();

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['search-suggestions', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return { data: [] };
      const res = await axios.get(`${apiUrl}/categories/search?query=${searchTerm}&lang=${locale}`);
      return res.data;
    },
    enabled: searchTerm.length > 2,
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSearch(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.name);
    setSearch(suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
      <div className="relative">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center bg-white p-2 rounded-full shadow-md mt-3 mx-4"
        >
          <IconSearch size={24} className="text-gray-500 ml-2" />
          <InputBase
            placeholder={placeholder}
            className="ml-3 flex-1 text-gray-700"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
          />
        </motion.div>

        {/* <AnimatePresence>
          {showSuggestions && searchTerm.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute w-full mt-2 z-50"
            >
              <Paper className="mx-4 rounded-lg shadow-lg overflow-hidden">
                {isLoading ? (
                  <div className="p-4">
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 bg-gray-100 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : suggestions?.data?.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {suggestions.data.map((suggestion: SearchSuggestion, index: number) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {suggestion.imageUrl && (
                          <img
                            src={suggestion.imageUrl}
                            alt={suggestion.name}
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                        )}
                        <div>
                          <p className="font-medium">{suggestion.name}</p>
                          <p className="text-sm text-gray-500">{t(`category_types.${suggestion.type}`)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : searchTerm.length > 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    {t('no_suggestions_found')}
                  </div>
                ) : null}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence> */}
      </div>
    </ClickAwayListener>
  );
};

export default SearchBar;

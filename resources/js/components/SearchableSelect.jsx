import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Searchable select that fetches options from API.
 * @param {Object} props
 * @param {string} props.value - selected display value
 * @param {function} props.onSelect - (item) => void
 * @param {function} props.fetchOptions - (q) => Promise<Array> | Promise<{data: Array}>
 * @param {string} props.placeholder
 * @param {string} props.labelKey - key for display (default: 'name')
 */
export default function SearchableSelect({
  value,
  onSelect,
  fetchOptions,
  placeholder = 'Buscar...',
  labelKey = 'name',
  disabled = false,
  className,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const load = useCallback(async (q) => {
    setLoading(true);
    try {
      const res = await fetchOptions(q || '');
      setOptions(Array.isArray(res) ? res : (res?.data ?? []));
    } finally {
      setLoading(false);
    }
  }, [fetchOptions]);

  useEffect(() => {
    const t = setTimeout(() => load(query), 300);
    return () => clearTimeout(t);
  }, [query, load]);

  useEffect(() => {
    if (open && options.length === 0 && !query) load('');
  }, [open, load, options.length, query]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          type="text"
          value={open ? query : (value || '')}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none min-w-0"
        />
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground', open && 'rotate-180')} />
      </div>
      {open && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover py-1 shadow-md">
          {loading ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">Cargando...</li>
          ) : options.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</li>
          ) : (
            options.map((opt) => (
              <li
                key={opt.id}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onSelect(opt);
                  setQuery('');
                  setOpen(false);
                }}
              >
                {opt[labelKey]}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

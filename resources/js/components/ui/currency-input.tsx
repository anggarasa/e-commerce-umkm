import { Input } from '@/components/ui/input';
import * as React from 'react';

interface CurrencyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string | number;
    onChange: (value: string) => void;
}

export function CurrencyInput({
    value,
    onChange,
    className,
    ...props
}: CurrencyInputProps) {
    // Format the initial value
    const formatValue = (val: string | number) => {
        if (!val && val !== 0) return '';
        // Parse the value as a number first to handle decimal strings (e.g., "20000000.00")
        const numericVal =
            typeof val === 'number' ? val : parseFloat(val.toString());
        if (isNaN(numericVal)) return '';
        // Round to remove decimal places and format
        return new Intl.NumberFormat('id-ID').format(Math.round(numericVal));
    };

    const [displayValue, setDisplayValue] = React.useState(formatValue(value));

    // Update display value when prop value changes
    React.useEffect(() => {
        setDisplayValue(formatValue(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Remove all non-digit characters
        const numericValue = inputValue.replace(/\D/g, '');

        // Update parent with raw number string
        onChange(numericValue);

        // Update local display with formatted value
        setDisplayValue(formatValue(numericValue));
    };

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                Rp
            </span>
            <Input
                {...props}
                type="text"
                value={displayValue}
                onChange={handleChange}
                className={`pl-9 ${className}`}
            />
        </div>
    );
}

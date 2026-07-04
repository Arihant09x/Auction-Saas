import * as Select from "@radix-ui/react-select";
import React, { useState } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function SearchableSelect({ options, value, onChange, placeholder = "Select...", disabled = false }: SearchableSelectProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Find the currently selected label to display
    const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

    const filteredOptions = options.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
            <div className="w-full relative font-poppins">
                <Select.Trigger className="w-full inline-flex items-center justify-between px-4 py-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-[#0C3278] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <Select.Value placeholder={placeholder}>
                        <span className={value ? "text-gray-900 font-semibold" : "text-gray-400"}>
                            {selectedLabel || placeholder}
                        </span>
                    </Select.Value>
                    <Select.Icon>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content
                        position="popper"
                        sideOffset={8}
                        className="w-[var(--radix-select-trigger-width)] z-[100] overflow-hidden bg-white border border-gray-100 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200 font-poppins"
                    >
                        <div className="flex items-center px-3 py-2 border-b border-gray-100 bg-gray-50/50">
                            <Search className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()} // Prevent selecting item on space
                                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                            />
                        </div>

                        <Select.Viewport className="max-h-[220px] overflow-y-auto p-1 custom-scrollbar">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-4 text-sm text-center text-gray-500">No results found</div>
                            ) : (
                                filteredOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))
                            )}
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </div>
        </Select.Root>
    );
}

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof Select.Item> {
    value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(({ children, className, ...props }, forwardedRef) => {
    return (
        <Select.Item
            className="relative flex items-center justify-between w-full px-3 py-2.5 text-sm text-gray-700 cursor-pointer rounded-lg select-none outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:bg-[#0C3278]/5 data-[highlighted]:text-[#0C3278] data-[state=checked]:font-semibold data-[state=checked]:text-[#0C3278] transition-colors"
            {...props}
            ref={forwardedRef}
        >
            <Select.ItemText>{children}</Select.ItemText>
            <Select.ItemIndicator>
                <Check className="w-4 h-4 text-[#0C3278]" />
            </Select.ItemIndicator>
        </Select.Item>
    );
});
SelectItem.displayName = "SelectItem";

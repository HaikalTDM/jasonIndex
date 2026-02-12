import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Option {
    value: string
    label: string
}

interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    options: Option[]
    placeholder?: string
    className?: string
}

export function CustomSelect({ value, onChange, options, placeholder = "Select...", className }: CustomSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <SelectPrimitive.Root value={value} onValueChange={onChange} open={isOpen} onOpenChange={setIsOpen}>
            <SelectPrimitive.Trigger
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-stone-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-stone-50 transition-all duration-200",
                    isOpen && "ring-2 ring-stone-400 border-stone-400",
                    className
                )}
            >
                <SelectPrimitive.Value placeholder={placeholder} />
                <SelectPrimitive.Icon asChild>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </motion.div>
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-stone-200 bg-white text-popover-foreground shadow-xl"
                    position="popper"
                    sideOffset={5}
                    asChild
                >
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                        <SelectPrimitive.Viewport className="p-1">
                            {options.map((option) => (
                                <SelectPrimitive.Item
                                    key={option.value}
                                    value={option.value}
                                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none focus:bg-amber-50 focus:text-amber-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors font-sans"
                                >
                                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                        <SelectPrimitive.ItemIndicator>
                                            <Check className="h-4 w-4 text-amber-600" />
                                        </SelectPrimitive.ItemIndicator>
                                    </span>
                                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                                </SelectPrimitive.Item>
                            ))}
                        </SelectPrimitive.Viewport>
                    </motion.div>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    )
}

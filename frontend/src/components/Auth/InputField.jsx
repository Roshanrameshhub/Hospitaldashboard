import React from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  name,
  showPasswordToggle = false,
  showValue,
  onToggle,
}) {
  return (
    <div className="mb-4">
      {label && <label className="block text-xs font-medium text-gray-300 mb-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white/[0.05] border border-white/20 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            tabIndex={-1}
          >
            {showValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
}

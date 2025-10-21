import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface DropDownOption {
  value: string;
  label: string;
}

interface DropDownButtonProps {
  options: DropDownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DropDownButton: React.FC<DropDownButtonProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "اختر",
  className = ""
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <motion.div ref={dropdownRef} animate={open ? "open" : "closed"} className="relative" style={{ width: '100%', maxWidth: '350px' }}>
      <button
        onClick={() => setOpen((pv) => !pv)}
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-white bg-[var(--chart-17)] hover:bg-[var(--chart-17)]/80 transition-colors text-base w-full ${className}`}
        style={{ fontSize: '16px', minHeight: '48px' }}
      >
        <span className="font-medium" style={{ flex: 1, textAlign: 'right' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.span variants={iconVariants}>
          <FiChevronDown size={20} />
        </motion.span>
      </button>

      <motion.ul
        initial={wrapperVariants.closed}
        variants={wrapperVariants}
        style={{ 
          originY: "top", 
          translateX: "-50%",
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
          bottom: 'auto',
          top: '120%'
        }}
        className="dropdown-list flex flex-col gap-1 p-2 rounded-lg bg-[#1a1a1a] border border-[#555555] shadow-xl absolute left-[50%] w-full min-w-[200px] max-h-[240px] overflow-y-auto overflow-x-hidden z-[99999]"
      >
        {options.map((option) => (
          <Option 
            key={option.value}
            setOpen={setOpen} 
            text={option.label} 
            onClick={() => onChange(option.value)}
            isSelected={option.value === value}
          />
        ))}
      </motion.ul>
    </motion.div>
  );
};

const Option = ({
  text,
  setOpen,
  onClick,
  isSelected
}: {
  text: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={() => {
        onClick();
        setOpen(false);
      }}
      className={`flex items-center gap-2 w-full px-3 py-3 text-base font-medium whitespace-normal rounded-md transition-colors cursor-pointer ${
        isSelected 
          ? 'bg-[var(--chart-17)] text-white' 
          : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
      }`}
      style={{ minHeight: '44px', lineHeight: '1.4' }}
    >
      <span style={{ wordBreak: 'break-word', textAlign: 'right', width: '100%' }}>{text}</span>
    </motion.li>
  );
};

// Add global styles for scrollbar
if (typeof window !== 'undefined') {
  const styleId = 'dropdown-scrollbar-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .dropdown-list::-webkit-scrollbar {
        width: 6px;
      }
      .dropdown-list::-webkit-scrollbar-track {
        background: transparent;
      }
      .dropdown-list::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
        transition: background-color 0.3s ease;
      }
      .dropdown-list::-webkit-scrollbar-thumb:hover {
        background-color: rgba(255, 255, 255, 0.5);
      }
    `;
    document.head.appendChild(style);
  }
}

export default DropDownButton;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0, // إغلاق فوري لجميع العناصر
      duration: 0.15,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

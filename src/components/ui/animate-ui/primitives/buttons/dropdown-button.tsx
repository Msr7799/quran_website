import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";

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
  
  const selectedOption = options.find(option => option.value === value);

  return (
    <motion.div animate={open ? "open" : "closed"} className="relative">
      <button
        onClick={() => setOpen((pv) => !pv)}
        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-white bg-[var(--chart-17)] hover:bg-[var(--chart-17)]/80 transition-colors text-base min-w-[100px] ${className}`}
      >
        <span className="font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.span variants={iconVariants}>
          <FiChevronDown />
        </motion.span>
      </button>

      <motion.ul
        initial={wrapperVariants.closed}
        variants={wrapperVariants}
        style={{ originY: "top", translateX: "-50%" }}
        className="flex flex-col gap-1 p-2 rounded-lg bg-[#1a1a1a] border border-[#555555] shadow-xl absolute top-[120%] left-[50%] w-full min-w-[120px] overflow-hidden z-50"
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
      className={`flex items-center gap-2 w-full p-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors cursor-pointer ${
        isSelected 
          ? 'bg-[var(--chart-17)] text-white' 
          : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
      }`}
    >
      <span>{text}</span>
    </motion.li>
  );
};

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
      staggerChildren: 0.1,
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

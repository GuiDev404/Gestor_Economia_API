import React from "react";

type StatCardProps = {
  title: string;
  amount: number;
  description?: string;
  className?: string;
  classNameAmount?: string;
  icon?: React.ReactNode | null;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  description,
  className = "",
  classNameAmount = "",
  icon = null,
}) => {
  return (
    <div className={`stats ${className}`}>
      <div className="stat bg-base-100">
        {icon && <div className="stat-figure">{icon}</div>}
        <div className="stat-title">{title}</div>
        <div className={`stat-value md:text-3xl md:font-extrabold text-xl font-extrabold ${classNameAmount}`}>$ {amount}</div>
        {description && <div className="stat-desc">{description}</div>}
      </div>
    </div>
  );
};

export default StatCard;

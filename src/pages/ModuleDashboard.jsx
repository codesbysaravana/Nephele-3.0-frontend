import React from "react";
import ModuleHeader from "../components/ModuleHeader";
import ModuleContent from "../components/ModuleFeatures";

export default function ModuleDashboard({ title, icon, colorClass, navigate }) {
  return (
    <div className="dashboard-container">
      <ModuleHeader title={title} icon={icon} colorClass={colorClass} navigate={navigate} />
      <ModuleContent title={title} icon={icon} colorClass={colorClass} />
    </div>
  );
}

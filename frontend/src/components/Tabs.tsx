import React, { ReactNode, useId } from "react";

type TabsProps = {
  tabs: { label: string; content: ReactNode; defaultChecked?: boolean }[];
  name: string;
};

function Tabs({ tabs, name }: TabsProps) {
  const tabId = useId();

  return (
    <div role="tablist" className="tabs tabs-lifted">
      {tabs.map((tab) => (
        <React.Fragment key={tab.label}>
          <input
            type="radio"
            name={`${name}_${tabId}`}
            role="tab"
            className="tab rounded-b-lg"
            aria-label={tab.label}
            defaultChecked={tab?.defaultChecked ?? false}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            {tab.content}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Tabs;

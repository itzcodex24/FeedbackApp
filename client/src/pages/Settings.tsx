import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePageTitle } from "../hooks";
import { Profile, Account } from "../components";

const tabs = [
  {
    label: "Profile",
  },
  {
    label: "Account",
  },
];

const Settings: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  usePageTitle("Settings");

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: "100%", opacity: 0 }}
      className="w-full h-screen bg-secondary"
    >
      <div className="flex w-full justify-center items-center pt-5 px-8 flex-col">
        <div className="flex justify-center items-center rounded-md box-border text-primary bg-tertiary w-full py-3 ">
          {tabs.map((tab, i) => (
            <div
              className={`${
                tab.label !== selectedTab.label && "opacity-50"
              } relative px-2 py-1 cursor-pointer`}
              onClick={() => setSelectedTab(tab)}
              key={i}
            >
              {tab.label === selectedTab.label && (
                <motion.div
                  className="absolute inset-0 rounded-md bg-secondary"
                  layoutId="activeTab"
                />
              )}
              <span
                className={`${
                  tab.label === selectedTab.label && ""
                } relative z-[10]`}
              >
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab ? selectedTab.label : "empty"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-secondary rounded-md mt-2"
          >
            {selectedTab.label == "Profile" ? <Profile /> : <Account />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Settings;

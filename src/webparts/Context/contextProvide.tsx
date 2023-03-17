/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { createContext, useState } from "react";
import {
  BiCalendarPlus,
  BiCalendarMinus,
  BiCalendarStar,
} from "react-icons/bi";
import { AiOutlineCalendar } from "react-icons/ai";
import { TbListDetails } from "react-icons/tb";
import { MdOutlineDashboard } from "react-icons/md";
import { TfiCheckBox } from "react-icons/tfi";
import { RiFileTextLine } from "react-icons/ri";
type MyContextType = {
  isSkeletonLoading: boolean;
  setIsSkeletonLoading: React.Dispatch<React.SetStateAction<boolean>>;
  screenSize: number | undefined;
  setScreenSize: React.Dispatch<React.SetStateAction<number | undefined>>;
  currentColor: string;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  currentMode: string;
  setCurrentMode: React.Dispatch<React.SetStateAction<string>>;
  themeSettings: boolean;
  setThemeSettings: React.Dispatch<React.SetStateAction<boolean>>;
  activeMenu: boolean;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isNotificationClicked: boolean;
  setIsNotificationClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isInfoClicked: boolean;
  setIsInfoClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isSignedIn: undefined;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  showProfile: boolean;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
  leaveData: boolean;
  setLeaveData: React.Dispatch<React.SetStateAction<boolean>>;
  usedLeave: boolean;
  setUsedLeave: React.Dispatch<React.SetStateAction<boolean>>;
  balanceLeave: boolean;
  setBalanceLeave: React.Dispatch<React.SetStateAction<boolean>>;
  earningData: {
    icon: React.ReactElement;
    title: string;
    count: string;
    iconColor: string;
    iconBg: string;
    pcColor: string;
    amount?: string;
    percentage?: string;
  }[];
  links: {
    title: string;
    links: {
      name: string;
      icon: React.ReactElement;
      role: string;
    }[];
  }[];
};
export const MyContext = createContext<MyContextType>({
  isSkeletonLoading: true,
  setIsSkeletonLoading: () => {
    ("");
  },
  screenSize: undefined,
  setScreenSize: () => {
    ("");
  },
  currentColor: "#ff4500",
  setCurrentColor: () => {
    ("");
  },
  currentMode: "light",
  setCurrentMode: () => {
    ("");
  },
  themeSettings: false,
  setThemeSettings: () => {
    ("");
  },
  activeMenu: true,
  setActiveMenu: () => {
    ("");
  },
  isNotificationClicked: false,
  setIsNotificationClicked: () => {
    ("");
  },
  isInfoClicked: false,
  setIsInfoClicked: () => {
    ("");
  },
  isSignedIn: null,
  setIsSignedIn: () => {
    ("");
  },
  showProfile: false,
  setShowProfile: () => {
    ("");
  },
  leaveData: false,
  setLeaveData: () => {
    ("");
  },
  balanceLeave: false,
  setBalanceLeave: () => {
    ("");
  },
  usedLeave: false,
  setUsedLeave: () => {
    ("");
  },
  earningData: [
    {
      icon: <BiCalendarPlus />,
      title: "Total Leaves",
      count: "12",
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
      pcColor: "red-600",
    },
    {
      icon: <BiCalendarStar />,
      title: "Available Leaves",
      count: "04",
      iconColor: "rgb(255, 244, 229)",
      iconBg: "rgb(254, 201, 15)",
      pcColor: "green-600",
    },
    {
      icon: <BiCalendarMinus />,
      title: "Taken Leaves",
      count: "08",
      iconColor: "rgb(228, 106, 118)",
      iconBg: "rgb(255, 244, 229)",
      pcColor: "green-600",
    },
  ],
  links: [
    {
      title: "Dashboard",
      links: [
        {
          name: "Employee",
          icon: <MdOutlineDashboard />,
          role: "User",
        },
      ],
    },
    {
      title: "Admin",
      links: [
        {
          name: "Leave Approval",
          icon: <TfiCheckBox />,
          role: "Admin",
        },
      ],
    },
    {
      title: "Pages",
      links: [
        {
          name: "Apply Leave",
          icon: <RiFileTextLine />,
          role: "User",
        },
        {
          name: "Leave Details",
          icon: <TbListDetails />,
          role: "User",
        },
      ],
    },
    {
      title: "Apps",
      links: [
        {
          name: "Public Holidays",
          icon: <AiOutlineCalendar />,
          role: "User",
        },
      ],
    },
  ],
});
interface Props {
  children: React.ReactNode;
}
export const MyContextProvider = ({ children }: Props) => {
  const [isSkeletonLoading, setIsSkeletonLoading] = useState<boolean>(true);
  const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
  const [currentColor, setCurrentColor] = useState<string>("#ff4500");
  const [currentMode, setCurrentMode] = useState<string>("light");
  const [themeSettings, setThemeSettings] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isNotificationClicked, setIsNotificationClicked] = useState(false);
  const [isInfoClicked, setIsInfoClicked] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [leaveData, setLeaveData] = useState(false);
  const [usedLeave, setUsedLeave] = useState(false);
  const [balanceLeave, setBalanceLeave] = useState(false);
  const [earningData] = useState([
    {
      icon: <BiCalendarPlus />,
      title: "Total Leaves",
      count: "12",
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
      pcColor: "red-600",
    },
    {
      icon: <BiCalendarStar />,
      title: "Available Leaves",
      count: "04",
      iconColor: "rgb(255, 244, 229)",
      iconBg: "rgb(254, 201, 15)",
      pcColor: "green-600",
    },
    {
      icon: <BiCalendarMinus />,
      title: "Taken Leaves",
      count: "08",
      iconColor: "rgb(228, 106, 118)",
      iconBg: "rgb(255, 244, 229)",
      pcColor: "green-600",
    },
  ]);
  const [links] = useState([
    {
      title: "Dashboard",
      links: [
        {
          name: "Employee",
          icon: <MdOutlineDashboard />,
          role: "User",
        },
      ],
    },
    {
      title: "Admin",
      links: [
        {
          name: "Leave Approval",
          icon: <TfiCheckBox />,
          role: "Admin",
        },
      ],
    },
    {
      title: "Pages",
      links: [
        {
          name: "Apply Leave",
          icon: <RiFileTextLine />,
          role: "User",
        },
        {
          name: "Leave Details",
          icon: <TbListDetails />,
          role: "User",
        },
      ],
    },
    {
      title: "Apps",
      links: [
        {
          name: "Public Holidays",
          icon: <AiOutlineCalendar />,
          role: "User",
        },
      ],
    },
  ]);
  const contextValue: MyContextType = {
    isSkeletonLoading,
    setIsSkeletonLoading,
    screenSize,
    setScreenSize,
    currentColor,
    setCurrentColor,
    currentMode,
    setCurrentMode,
    themeSettings,
    setThemeSettings,
    activeMenu,
    setActiveMenu,
    isNotificationClicked,
    setIsNotificationClicked,
    isInfoClicked,
    setIsInfoClicked,
    isSignedIn,
    setIsSignedIn,
    showProfile,
    earningData,
    links,
    setShowProfile,
    balanceLeave,
    setBalanceLeave,
    usedLeave,
    setUsedLeave,
    leaveData,
    setLeaveData,
  };
  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};

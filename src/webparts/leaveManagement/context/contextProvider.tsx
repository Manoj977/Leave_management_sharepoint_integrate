/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createContext, useEffect, useState } from 'react';

import {
  BiCalendarPlus,
  BiCalendarMinus,
  BiCalendarStar,
} from 'react-icons/bi';
import { AiOutlineCalendar } from 'react-icons/ai';
import { HiOutlineRefresh } from 'react-icons/hi';
import { BsGraphDownArrow } from 'react-icons/bs';
import { TbListDetails } from 'react-icons/tb';
import { MdOutlineDashboard } from 'react-icons/md';
import { TfiCheckBox } from 'react-icons/tfi';
import { RiFileTextLine } from 'react-icons/ri';
import convert from 'xml-js';
type MyContextType = {
  isSkeletonLoading: boolean;
  setIsSkeletonLoading: React.Dispatch<React.SetStateAction<boolean>>;
  screenSize: number;
  setScreenSize: React.Dispatch<React.SetStateAction<number>>;
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
  sidebarActive: boolean;
  setSideBarActive: React.Dispatch<React.SetStateAction<boolean>>;
  earningData: {
    icon: React.ReactElement;
    title: string;
    count?: string | number;
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
  leaveDetails: LeaveDetail[];
  takenLeaves: number;
  setTakenLeaves: React.Dispatch<React.SetStateAction<number>>;
  lossOfPay: number;
  setLossofPay: React.Dispatch<React.SetStateAction<number>>;
  action: boolean;
  setAction: React.Dispatch<React.SetStateAction<boolean>>;
  cancelReason: boolean;
  setCancelReason: React.Dispatch<React.SetStateAction<boolean>>;
  approveLeave: boolean;
  setApproveLeave: React.Dispatch<React.SetStateAction<boolean>>;
  rejectLeave: boolean;
  setRejectLeave: React.Dispatch<React.SetStateAction<boolean>>;
  totalLeaves: number;
  setTotalLeaves: React.Dispatch<React.SetStateAction<number>>;
  availableLeaves: number;
  setAvailableLeaves: React.Dispatch<React.SetStateAction<number>>;
  nextHoliday: upcomingHoliday[];
  setNextHoliday: React.Dispatch<React.SetStateAction<upcomingHoliday[]>>;
  holiday: Holiday[];
  setHoliday: React.Dispatch<React.SetStateAction<Holiday[]>>;
};
type LeaveDetail = {
  ID: string;
  Email: string;
  FromDate: Date;
  ToDate: Date;
  NoofDaysLeave: number;
};
type upcomingHoliday = {
  HolidayName: string;
  Date: string;
  Day: string;
};
type Holiday = {
  'S.No': number;
  HolidayName: string;
  Date: string;
  Day: string;
};
export const MyContext = createContext<MyContextType>({
  nextHoliday: [],
  setNextHoliday: () => {
    ('');
  },
  isSkeletonLoading: true,
  setIsSkeletonLoading: () => {
    ('');
  },
  screenSize: window.innerWidth,
  setScreenSize: () => {
    ('');
  },
  currentColor: '#ff4500',
  setCurrentColor: () => {
    ('');
  },
  currentMode: 'light',
  setCurrentMode: () => {
    ('');
  },
  themeSettings: false,
  setThemeSettings: () => {
    ('');
  },
  activeMenu: true,
  setActiveMenu: () => {
    ('');
  },
  isNotificationClicked: false,
  setIsNotificationClicked: () => {
    ('');
  },
  isInfoClicked: false,
  setIsInfoClicked: () => {
    ('');
  },
  isSignedIn: null,
  setIsSignedIn: () => {
    ('');
  },
  showProfile: false,
  setShowProfile: () => {
    ('');
  },
  leaveData: false,
  setLeaveData: () => {
    ('');
  },
  balanceLeave: false,
  setBalanceLeave: () => {
    ('');
  },
  usedLeave: false,
  setUsedLeave: () => {
    ('');
  },
  sidebarActive: false,
  setSideBarActive: () => {
    ('');
  },
  earningData: [
    {
      icon: <BiCalendarPlus />,
      title: 'Total Leaves',
      count: '12',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'red-600',
    },
    {
      icon: <BiCalendarStar />,
      title: 'Available Leaves',
      count: '04',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
    {
      icon: <BiCalendarMinus />,
      title: 'Taken Leaves',
      count: '08',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
      pcColor: 'green-600',
    },
    {
      icon: <BsGraphDownArrow />,
      count: '0',
      title: 'Loss of Pay',
      iconColor: 'rgb(255,68,0)',
      iconBg: ' #ffc7b3',
      pcColor: 'red-600',
    },
    {
      icon: <HiOutlineRefresh />,
      amount: '39,354',
      percentage: '-12%',
      title: 'Refresh',
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      pcColor: 'red-600',
    },
  ],
  links: [
    {
      title: 'Dashboard',
      links: [
        {
          name: 'Profile',
          icon: <MdOutlineDashboard />,
          role: 'User',
        },
      ],
    },
    {
      title: 'Admin',
      links: [
        {
          name: 'Leave Approval',
          icon: <TfiCheckBox />,
          role: 'Admin',
        },
      ],
    },
    {
      title: 'Pages',
      links: [
        {
          name: 'Apply Leave',
          icon: <RiFileTextLine />,
          role: 'User',
        },
        {
          name: 'Leave Details',
          icon: <TbListDetails />,
          role: 'User',
        },
      ],
    },

    {
      title: 'Apps',
      links: [
        {
          name: 'public Holidays',
          icon: <AiOutlineCalendar />,
          role: 'User',
        },
      ],
    },
  ],
  leaveDetails: [],
  takenLeaves: 0,
  setTakenLeaves: () => {
    ('');
  },
  lossOfPay: 0,
  setLossofPay: () => {
    ('');
  },
  action: false,
  setAction: () => {
    ('');
  },
  cancelReason: false,
  setCancelReason: () => {
    ('');
  },
  approveLeave: false,
  setApproveLeave: () => {
    ('');
  },
  rejectLeave: false,
  setRejectLeave: () => {
    ('');
  },
  totalLeaves: 0,
  setTotalLeaves: () => {
    ('');
  },
  availableLeaves: 0,
  setAvailableLeaves: () => {
    ('');
  },
  holiday: [],
  setHoliday: () => {
    ('');
  },
});

interface Props {
  children: React.ReactNode;
}

export const MyContextProvider = ({ children }: Props) => {
  const [isSkeletonLoading, setIsSkeletonLoading] = useState<boolean>(true);
  const [screenSize, setScreenSize] = useState<number>(window.innerWidth);
  const [currentColor, setCurrentColor] = useState<string>('#ff4500');
  const [currentMode, setCurrentMode] = useState<string>('light');
  const [themeSettings, setThemeSettings] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isNotificationClicked, setIsNotificationClicked] = useState(false);
  const [isInfoClicked, setIsInfoClicked] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [leaveData, setLeaveData] = useState(false);
  const [usedLeave, setUsedLeave] = useState(false);
  const [balanceLeave, setBalanceLeave] = useState(false);
  const [sidebarActive, setSideBarActive] = useState(false);
  const [takenLeaves, setTakenLeaves] = useState<number>(0);
  const [totalLeaves, setTotalLeaves] = useState<number>(0);
  const [lossOfPay, setLossofPay] = useState<number>(0);
  const [action, setAction] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState(false);
  const [approveLeave, setApproveLeave] = useState(false);
  const [rejectLeave, setRejectLeave] = useState(false);
  const [availableLeaves, setAvailableLeaves] = useState<number>(0);
  const [nextHoliday, setNextHoliday] = useState([]);
  const [holiday, setHoliday] = useState([]);

  const [earningData] = useState([
    {
      icon: <BiCalendarPlus />,
      title: 'Total Leaves',
      count: '12',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'red-600',
    },
    {
      icon: <BiCalendarStar />,
      title: 'Available Leaves',
      count: '04',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
    {
      icon: <BiCalendarMinus />,
      title: 'Taken Leaves',
      count: '08',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
      pcColor: 'green-600',
    },
    {
      icon: <BsGraphDownArrow />,
      count: '0',
      title: 'Loss of Pay',
      iconColor: 'rgb(255,68,0)',
      iconBg: ' #ffc7b3',
      pcColor: 'red-600',
    },
    {
      icon: <HiOutlineRefresh />,
      amount: '39,354',
      percentage: '-12%',
      title: 'Refresh',
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      pcColor: 'red-600',
    },
  ]);
  const [links] = useState([
    {
      title: 'Dashboard',
      links: [
        {
          name: 'Profile',
          icon: <MdOutlineDashboard />,
          role: 'User',
        },
      ],
    },
    {
      title: 'Admin',
      links: [
        {
          name: 'Leave Approval',
          icon: <TfiCheckBox />,
          role: 'Admin',
        },
      ],
    },
    {
      title: 'Pages',
      links: [
        {
          name: 'Apply Leave',
          icon: <RiFileTextLine />,
          role: 'User',
        },
        {
          name: 'Leave Details',
          icon: <TbListDetails />,
          role: 'User',
        },
      ],
    },

    {
      title: 'Apps',
      links: [
        {
          name: 'public Holidays',
          icon: <AiOutlineCalendar />,
          role: 'User',
        },
      ],
    },
  ]);
  useEffect(() => {
    fetch(
      "https://zlendoit.sharepoint.com/sites/production/_api/web/lists/getbytitle('Leaves%20Master')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];
        entries.map((e: any) => {
          setTotalLeaves(
            e.content['m:properties']['d:Total_x0020_Leaves']._text
          );
        });
      })
      .catch((err) => {
        if (
          !(
            err instanceof TypeError &&
            err.message.includes('Cannot read properties of undefined')
          )
        ) {
          console.log(err);
        }
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    if (screenSize < 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
      setSideBarActive(false);
    }
  }, [screenSize, setActiveMenu]);
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);
  useEffect(() => {
    fetch(
      "https://zlendoit.sharepoint.com/sites/production/_api/web/lists/getbytitle('Holiday%20List')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        const holidays: Holiday[] = parsedData.feed.entry.map((entry: any) => ({
          HolidayName: entry.content['m:properties']['d:Title']._text,
          Date: entry.content['m:properties']['d:Date']._text,

          Day: entry.content['m:properties']['d:Day']._text,
        }));

        const today = new Date();
        const upcomingHoliday: Holiday | '' =
          holidays.find((holiday) => new Date(holiday.Date) >= today) || '';

        setNextHoliday([upcomingHoliday]);
        setHoliday(holidays);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    setScreenSize(window.innerWidth);
  }, [screenSize, setScreenSize, activeMenu]);
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
    sidebarActive,
    setSideBarActive,
    takenLeaves,
    setTakenLeaves,
    lossOfPay,
    setLossofPay,
    leaveDetails: [],
    action,
    setAction,
    cancelReason,
    setCancelReason,
    approveLeave,
    setApproveLeave,
    rejectLeave,
    setRejectLeave,
    totalLeaves,
    availableLeaves,
    setTotalLeaves,
    setAvailableLeaves,
    nextHoliday,
    setNextHoliday,
    holiday,
    setHoliday,
  };

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};

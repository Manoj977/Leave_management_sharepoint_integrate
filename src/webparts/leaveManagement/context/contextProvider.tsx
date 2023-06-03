/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { BsPersonLinesFill } from 'react-icons/bs';
import { MdAdminPanelSettings } from 'react-icons/md';
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
  LopCount: LopCount[];
  setLopCount: React.Dispatch<React.SetStateAction<LopCount[]>>;
  defaultLop: any;
  setDefaultLop: React.Dispatch<React.SetStateAction<any>>;

  lopDate: any;
  setLopDate: React.Dispatch<React.SetStateAction<any[]>>;
  lopData: number;
  setLopData: React.Dispatch<React.SetStateAction<number>>;
  lopEmail: any[];
  setLopEmail: React.Dispatch<React.SetStateAction<any[]>>;
  lopCalc: any;
  setLopCalc: React.Dispatch<React.SetStateAction<any>>;
  eachData: any[];
  setEachData: React.Dispatch<React.SetStateAction<any[]>>;
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
type LopCount = {
  find: any;
  Title: string;
  count: number;
};
type lopcalc = {
  Email: string;
  lop: number;
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
      count: 12,
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
      title: 'Leaves Taken',
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
        {
          name: 'Approved List',
          icon: <BsPersonLinesFill />,
          role: 'Admin',
        },
        {
          name: 'Lop Calculation',
          icon: <MdAdminPanelSettings />,
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
          name: 'Public Holidays',
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
  LopCount: [],
  setLopCount: () => {
    ('');
  },
  defaultLop: 0,
  setDefaultLop: () => {
    ('');
  },
  lopDate: [],
  setLopDate: () => {
    ('');
  },
  lopData: 0,
  setLopData: () => {
    ('');
  },
  lopEmail: [],
  setLopEmail: () => {
    ('');
  },
  lopCalc: [],
  setLopCalc: () => {
    ('');
  },
  eachData: [],
  setEachData: () => {
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
  const [LopCount, setLopCount] = useState<LopCount[]>();
  const [defaultLop, setDefaultLop] = useState<number>();
  const [lopData, setLopData] = useState<number>();
  const [lopEmail, setLopEmail] = useState<any[]>([]);
  const [lopDate, setLopDate] = useState<any[]>([]);
  const [eachData, setEachData] = useState<any[]>([]);
  const [earningData] = useState([
    {
      icon: <BiCalendarPlus />,
      title: 'Total Leaves',
      count: 12,
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
      title: 'Leaves Taken',
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
        {
          name: 'Approved List',
          icon: <BsPersonLinesFill />,
          role: 'Admin',
        },
        {
          name: 'LOP Calculation',
          icon: <MdAdminPanelSettings />,
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
          name: 'Public Holidays',
          icon: <AiOutlineCalendar />,
          role: 'User',
        },
      ],
    },
  ]);
  const [lopCalc, setLopCalc] = useState([]);
  useEffect(() => {
    lopDate;
  }, [setLopDate, lopDate]);
  useEffect(() => {
    const lopUrl =
      "https://zlendoit.sharepoint.com/sites/production/_api/web/lists/getbytitle('Leave%20Management%20Lop')/items";
    fetch(lopUrl)
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];
        const lopCount: LopCount = entries.map((entry: any) => {
          try {
            return {
              Title: entry.content['m:properties']['d:Title']._text,
              count: entry.content['m:properties']['d:Lop_x0020_Date']._text,
            };
          } catch (error) {
            if (
              error instanceof TypeError &&
              error.message.includes('Cannot read properties of undefined')
            ) {
              return null;
            } else {
              throw error;
            }
          }
        });

        setLopCount([lopCount]);
      })
      .catch((err) => console.log(err));
  }, []);

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
            parseInt(e.content['m:properties']['d:Total_x0020_Leaves']._text)
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
    setLopData(lopData);
    setLopEmail(lopEmail);
    setEachData(eachData);
  }, []);
  useEffect(() => {
    setLopData(lopData);
    setLopEmail(lopEmail);
    setEachData(eachData);
  }, [setLopData, lopData, setLopEmail, lopEmail, eachData, setEachData]);

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
    const Lop =
      "https://zlendoit.sharepoint.com/sites/production/_api/web/lists/getbytitle('Leave%20Management%20Default%20Lop')/items";
    fetch(Lop)
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];
        entries.map((e: any) => {
          setDefaultLop(e.content['m:properties']['d:Default_x0020_Lop']._text);
        });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setScreenSize(window.innerWidth);
  }, [screenSize, setScreenSize, activeMenu]);
  useEffect(() => {
    setEachData(eachData);
  }, []);
  useEffect(() => {
    setEachData(eachData);
  }, [eachData, setEachData]);
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
    LopCount,
    setLopCount,
    defaultLop,
    setDefaultLop,
    lopDate,
    setLopDate,
    lopData,
    setLopData,
    lopEmail,
    setLopEmail,
    lopCalc,
    setLopCalc,
    eachData,
    setEachData,
  };

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};

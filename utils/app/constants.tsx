import {
  ChartDonutIcon,
  ReadCvLogoIcon,
  UserIcon,
} from "@phosphor-icons/react";

/**
 * Sidebar
 */
export const menuItem = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <ChartDonutIcon size={25} />,
    filled: <ChartDonutIcon size={25} weight="fill" />,
    path: "/dashboard",
  },
  {
    id: "tracker",
    label: "Tracker",
    icon: <ReadCvLogoIcon size={25} />,
    filled: <ReadCvLogoIcon size={25} weight="fill" />,
    path: "/application-tracker",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <UserIcon size={25} />,
    filled: <UserIcon size={25} weight="fill" />,
    path: "/profile",
  },
];

export const workSetup = [
  { id: "onsite", type: "Onsite" },
  { id: "hybrid", type: "Hybrid" },
  { id: "remote", type: "Remote" },
];

export const status = [
  { id: "to-apply", type: "To Apply" },
  { id: "applied", type: "Applied" },
  { id: "interview", type: "Interview" },
  { id: "offer", type: "Offer" },
  { id: "closed", type: "Closed" },
];

export const employmentType = [
  { id: "full-time", type: "Full-time" },
  { id: "part-time", type: "Part-time" },
  { id: "contract", type: "Contract" },
  { id: "contract-to-hire", type: "Contract-to-hire" },
  { id: "internship", type: "Internship" },
  { id: "temporary", type: "Temporary" },
  { id: "freelance", type: "Freelance" },
];

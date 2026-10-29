export type Profile = {
  displayName: string;
  role: string;
  location: string;
  phone: string;
  email: string;
  avatar: string;
};

export type ProfileField = { label: string; value: string };

export type SecuritySettings = {
  passwordChanged: string;
  twoFactorPhone: string;
  twoFactorEnabled: boolean;
};

export type ActiveSession = {
  id: string;
  device: string;
  kind: "desktop" | "mobile";
  detail: string;
  current: boolean;
};

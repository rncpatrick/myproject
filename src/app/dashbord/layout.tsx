import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div>
      <h1>Dashboard</h1>

      <nav>
        <Link href="/dashbord/profile">Profile</Link><br />
        <Link href="/dashbord/setting">Settings</Link>
      </nav>

      <hr />

      {/* Ici les pages enfants s'affichent */}
      {children}
    </div>
  );
}

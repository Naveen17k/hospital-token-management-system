// pages/doctor-panel.js
import React from "react";
import DoctorPanel from "./components/doctor-panel-page";
import { TokenProvider } from "./token-context";

export default function DoctorPanelPage() {
  return (
    <TokenProvider>
      <DoctorPanel />
    </TokenProvider>
  );
}

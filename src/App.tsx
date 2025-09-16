import { useEffect, useState } from "react";
import "./App.css";
import { NotificationTable } from "./components/notification-table/NotificationTable";
import type { ISPPageContextInfo } from "./types/type";

declare const _spPageContextInfo: ISPPageContextInfo;

function App() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (typeof _spPageContextInfo !== "undefined") {
      const fullLoginName = _spPageContextInfo.userLoginName;
      const shortName = fullLoginName.split("\\").pop();
      setUserName(shortName || "");
    }
  }, []);

  return (
    <>
      <NotificationTable loginName={userName} />
    </>
  );
}

export default App;

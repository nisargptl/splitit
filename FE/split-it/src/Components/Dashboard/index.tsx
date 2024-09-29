import React, { useState } from "react";
import Group from "../Group";
import GroupDetails from "../GroupDetails";

interface DashboardProps {
    setIsLoggedIn: (val: boolean) => void;
    isLoggedIn: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ setIsLoggedIn, isLoggedIn }) => {
    const [groupDetails, setGroupDetails] = useState({});
    return (
        <div style={{ display: "flex" }}>
            <Group setGroupDetails={setGroupDetails} />
            <GroupDetails
                groupDetails={groupDetails}
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
                setGroupDetails={setGroupDetails}
            />
        </div>
    );
};

export default Dashboard;

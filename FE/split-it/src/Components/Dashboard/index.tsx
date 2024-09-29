import React from "react";
import Group from "../Group";
import GroupDetails from "../GroupDetails";

interface DashboardProps {
    setIsLoggedIn: (val: boolean) => void;
    isLoggedIn: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ setIsLoggedIn, isLoggedIn }) => {
    return (
        <div style={{ display: "flex" }}>
            <Group />
            <GroupDetails
                setIsLoggedIn={setIsLoggedIn}
                isLoggedIn={isLoggedIn}
            />
        </div>
    );
};

export default Dashboard;

import React, { useContext, useEffect, useState } from "react";
import "./index.css";
// @ts-ignore
import { UserContext } from "../../utils/userContext";
import { getGroupDetail, getUserGroups } from "../../api/group";
import CreateGroupModal from "./CreateGroupModal";

interface GroupProps {
    setGroupDetails: (data: any) => void;
}

const Group: React.FC<GroupProps> = ({ setGroupDetails }) => {
    const [groups, setGroups] = useState<any>([]);

    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const userContext: any = useContext(UserContext);
    const { userId } = userContext;
    useEffect(() => {
        if (userId) {
            getUserGroups(userId).then((data) => {
                setGroups(data);
            });
        }
    }, [userId]);

    const handleShow = () => setShowCreateGroupModal(true);

    const handleGroupClick = async (group: any) => {
        // console.log(group);
        const data = await getGroupDetail(group._id);
        setGroupDetails(data);
    };

    return (
        <div className="sidebar">
            {/* Recent Activity */}
            <div className="recent-activity">
                {/* <h3 className="fs-3">Recent Activity</h3>
                <input type="text" placeholder="Filter by name" /> */}
                <button
                    className="expenses-button"
                    onClick={() => setGroupDetails({})}
                >
                    Dashboard
                </button>
            </div>

            {/* Groups Section */}
            <div className="groups-section">
                <h4 className="fs-3">GROUPS</h4>
                <ul>
                    {groups.map((group: any) => (
                        <li key={group.id} role="button">
                            <button
                                className="group-menu-button"
                                onClick={() => handleGroupClick(group)}
                            >
                                <span className="group-icon fs-6">
                                    <img
                                        src="/user-group.svg" // Assuming the logo is in the public directory
                                        alt="group"
                                        width="14"
                                        height="14"
                                        style={{ marginTop: 5 }}
                                        className="d-inline-block align-top"
                                    />{" "}
                                    {group.name}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    className="add-group-button btn btn-info"
                    onClick={handleShow}
                >
                    Create New Group
                </button>
            </div>

            <CreateGroupModal
                showCreateGroupModal={showCreateGroupModal}
                setShowCreateGroupModal={setShowCreateGroupModal}
                setGroups={(group: any) => setGroups([...groups, group])}
            />
        </div>
    );
};

export default Group;

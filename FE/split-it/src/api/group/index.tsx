import apiClient from "../index";

export const getGroupDetail = async (groupId: string) => {
    try {
        const res = await apiClient.get("/api/group/" + groupId);
        return res.data;
    } catch (err) {
        console.error(err);
        return {};
    }
};

export const createGroup = async (groupName: string, selectedUsers: any) => {
    try {
        for (let user of selectedUsers) {
            user["amount_owed"] = 0;
            user["user_id"] = user._id;
            delete user._id;
        }

        selectedUsers.push({
            name: localStorage.getItem("user_name"),
            user_id: localStorage.getItem("user_id"),
            amount_owed: 0,
        });
        const res = await apiClient.post("/api/group", {
            name: groupName,
            created_by_name: localStorage.getItem("user_name"),
            created_by_user_id: localStorage.getItem("user_id"),
            members: selectedUsers,
        });
        return res.data;
    } catch (err) {
        console.error(err);
        return {};
    }
};

export const getUserGroups = async (userId: string) => {
    try {
        const res = await apiClient.get(`/api/userGroups/${userId}`);
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

import apiClient from "../index";

export const uploadUser = async () => {
    try {
        const response = await apiClient.post("/api/user");
        localStorage.setItem("user_id", response.data.user._id);
        localStorage.setItem("user_name", response.data.user.name);
        return response.data; // Return the data (like access_token)
    } catch (error) {
        throw error; // Propagate the error for the caller to handle
    }
};

export const getAllUsers = async () => {
    try {
        const res = await apiClient.get(
            "/api/userList/" + localStorage.getItem("user_id")
        );
        return res.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getUserAmount = async (userId: string) => {
    try {
        const res = await apiClient.get("/api/userAmount/" + userId);
        return res.data.amount_owed;
    } catch (err) {
        console.error(err);
        return 0;
    }
};

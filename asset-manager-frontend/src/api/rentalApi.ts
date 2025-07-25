import axios from "axios";
import CookieService from "../service/cookieService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const cookieService = new CookieService();

export const rentAsset = async (
    assetId: string,
    startDate: string,
    endDate: string
) => {
    try {
        const token = await cookieService.getCookie("access_token");
        const response = await axios.post(
            `${API_BASE_URL}/rentals/rent-asset?assetId=${assetId}&borrowedStart=${startDate}&borrowedEnd=${endDate}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error renting asset:", error);
        // Optionally, you can customize the error message for the UI
        throw new Error("Failed to rent asset. Please try again later.");
    }
};

export const getEmployeeRentals = async (employeeId?: string) => {
    try {
        const token = await cookieService.getCookie("access_token");
        const response = await axios.get(
            `${API_BASE_URL}/rentals/get-employee-rentals?employeeId=${employeeId || ""}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching rentals:", error);
        throw new Error("Failed to fetch rentals. Please try again later.");
    }
};

export const putRentalStatus = async (rentalId: string, newStatus: string) => {
    try {
        const token = await cookieService.getCookie("access_token");
        const response = await axios.put(
            `${API_BASE_URL}/rentals/update-rental?id=${rentalId}&status=${newStatus}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating rental status:", error);
        throw new Error("Failed to update rental status. Please try again later.");
    }
};

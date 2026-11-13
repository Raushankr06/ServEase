
const API_URL = "http://localhost:5000/api";

// COMMON API FUNCTION
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// REGISTER
export const registerUser = (userData) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });

// LOGIN
export const loginUser = (userData) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData)
  });

// FORGOT PASSWORD
export const forgotPassword = (email) =>
  apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email })
  });

// RESET PASSWORD
export const resetPassword = (token, password) =>
  apiRequest(`/auth/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify({ password })
  });

// CUSTOMER PROFILE
export const getMyProfile = () =>
  apiRequest("/auth/me");

export const updateMyProfile = (profileData) =>
  apiRequest("/auth/me", {
    method: "PUT",
    body: JSON.stringify(profileData)
  });

export const changePassword = (passwordData) =>
  apiRequest("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify(passwordData)
  });

// CUSTOMER BOOKINGS
export const createBooking = (bookingData) =>
  apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData)
  });

export const getMyBookings = () =>
  apiRequest("/bookings/my-bookings");

export const cancelBooking = (bookingId) =>
  apiRequest(`/bookings/${bookingId}/cancel`, {
    method: "PUT"
  });

// ADMIN BOOKINGS
export const getAllBookings = () =>
  apiRequest("/admin/bookings");

export const updateBookingStatus = (bookingId, status) =>
  apiRequest(`/admin/bookings/${bookingId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status })
  });

// ADMIN DASHBOARD
export const getDashboardStats = () =>
  apiRequest("/admin/stats");

// ADMIN CUSTOMERS
export const getAllCustomers = (search = "") =>
  apiRequest(`/admin/customers?search=${encodeURIComponent(search)}`);

export const deleteCustomer = (customerId) =>
  apiRequest(`/admin/customers/${customerId}`, {
    method: "DELETE"
  });

// SERVICES
export const getServices = () =>
  apiRequest("/services");

export const createService = (serviceData) =>
  apiRequest("/services", {
    method: "POST",
    body: JSON.stringify(serviceData)
  });

export const updateService = (serviceId, serviceData) =>
  apiRequest(`/services/${serviceId}`, {
    method: "PUT",
    body: JSON.stringify(serviceData)
  });

export const deleteService = (serviceId) =>
  apiRequest(`/services/${serviceId}`, {
    method: "DELETE"
  });

// FEEDBACK
export const createFeedback = (feedbackData) =>
  apiRequest("/feedback", {
    method: "POST",
    body: JSON.stringify(feedbackData)
  });

export const getMyFeedback = () =>
  apiRequest("/feedback/my");

export const getAllFeedback = () =>
  apiRequest("/feedback/admin/all");

// SUPPORT TICKETS
export const createSupportTicket = (ticketData) =>
  apiRequest("/support", {
    method: "POST",
    body: JSON.stringify(ticketData)
  });

export const getMySupportTickets = () =>
  apiRequest("/support/my");

export const getAllSupportTickets = () =>
  apiRequest("/support/admin/all");

export const updateSupportTicket = (ticketId, ticketData) =>
  apiRequest(`/support/admin/${ticketId}`, {
    method: "PUT",
    body: JSON.stringify(ticketData)
  });

// NOTIFICATIONS
export const getMyNotifications = () =>
  apiRequest("/notifications");

export const markNotificationAsRead = (notificationId) =>
  apiRequest(`/notifications/${notificationId}/read`, {
    method: "PUT"
  });

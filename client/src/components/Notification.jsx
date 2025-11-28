import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Don't crash the app, just set empty state
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // Don't fetch if no token

    fetchNotifications();
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
          <div className="py-2">
            <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-200">
              Notifications
            </div>
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-800">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;

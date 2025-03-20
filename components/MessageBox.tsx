// components/MessageBox.tsx
import React from "react";

type MessageBoxProps = {
  messageCount: number; // Count of unread messages
};

const MessageBox = ({ messageCount }: MessageBoxProps) => {
  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md w-full max-w-md">
      {/* Notification Red Dot */}
      {messageCount > 0 && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></div>
      )}

      <h3 className="text-lg font-bold text-gray-800">Messages</h3>
      <p className="text-sm text-gray-600">
        {messageCount > 0
          ? `${messageCount} new message${messageCount > 1 ? "s" : ""}`
          : "No new messages"}
      </p>
    </div>
  );
};

export default MessageBox;

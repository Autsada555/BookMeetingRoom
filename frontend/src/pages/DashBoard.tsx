import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  // Placeholder data, in real case this would come from context, props, or API
  const bookingData = {
    today: 12,
    upcoming: 30,
    cancellations: 2
  };

  const cctvStatus = {
    totalCameras: 73,
    online: 65,
    offline: 8,
    issuesReported: 3
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Booking M Summary</h2>
          <ul className="text-blue-600 space-y-2">
            <li>Today’s Bookings: <strong>{bookingData.today}</strong></li>
            <li>Upcoming Bookings: <strong>{bookingData.upcoming}</strong></li>
            <li>Cancellations: <strong>{bookingData.cancellations}</strong></li>
          </ul>
          <Link
            to="/book"
            className="inline-block mt-4 text-blue-700 hover:underline"
          >
            View Booking Management →
          </Link>
        </div>

        {/* CCTV Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">CCTV Overview</h2>
          <ul className="text-blue-600 space-y-2">
            <li>Total Cameras: <strong>{cctvStatus.totalCameras}</strong></li>
            <li>Online: <strong>{cctvStatus.online}</strong></li>
            <li>Offline: <strong>{cctvStatus.offline}</strong></li>
            <li>Issues Reported: <strong>{cctvStatus.issuesReported}</strong></li>
          </ul>
          <Link
            to="/checkcctv"
            className="inline-block mt-4 text-blue-700 hover:underline"
          >
            Go to CCTV Monitoring →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

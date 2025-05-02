import React from "react";

const sections = [
  {
    title: "Building A-B-C",
    checks: [
      "Lighting",
      "Air Condition",
      "UPS Switch",
      "UPS Network",
      "UPS PABX",
      "Switch HUB",
      "Fan Switch HUB",
      "Microtik",
      "Interface",
      "Firewall for Server"
    ]
  },
  {
    title: "CCTV Server Room",
    checks: [
      "DVR-01",
      "DVR-02",
      "DVR-03",
      "Camera Install 35",
      "Camera Working",
      "Camera Offline"
    ]
  },
  {
    title: "Building D-E-F",
    checks: [
      "DVR-03",
      "DVR-04",
      "Camera Install 20",
      "Camera Working",
      "Camera Offline"
    ]
  },
  {
    title: "Carpark",
    checks: [
      "DVR-05",
      "Camera Install 10",
      "Camera Working",
      "Camera Offline"
    ]
  },
  {
    title: "Internet & DATA",
    checks: [
      "Main Internet TOT",
      "Main Internet NT(CAT)",
      "Speed Test Wifi-Public",
      "Wifi Test Room 1",
      "Wifi Test Room 2",
      "Wifi Test Room 3",
      "Office Connection",
      "Access Point",
      "Website Hotel",
      "EV Charger",
      "AP Install",
      "AP Online",
      "AP Offline"
    ]
  },
  {
    title: "Telephone",
    checks: [
      "Incoming Call Test",
      "House Phone Signal Test",
      "Status PABX"
    ]
  },
  {
    title: "Programs",
    checks: [
      "Program HR",
      "Program AC",
      "Program FO",
      "Share Drive",
      "Drive Hotel",
      "Firewall"
    ]
  }
];

const InputField = ({ label }: { label: string }) => (
  <div className="flex items-center mb-2">
    <input
      type="checkbox"
      className="mr-2 h-5 w-5 text-blue-600 border-blue-400 focus:ring-blue-300"
    />
    <label className="text-blue-600 font-semibold mr-2 w-48">{label}</label>
    <input
      type="text"
      placeholder="Remark"
      className="flex-1 border border-blue-400 rounded-md p-2 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  </div>
);

const DailyCheckForm: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        RAVINDRA RESORT AND SPA DAILY CHECK SYSTEMS
      </h1>
      <p className="text-blue-600 mb-4">Section: IT</p>

      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {section.checks.map((check) => (
              <InputField key={check} label={check} />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8">
        <InputField label="Date" />
        <InputField label="Checked By" />
        <InputField label="Acknowledged By" />
      </div>
    </div>
  );
};

export default DailyCheckForm;

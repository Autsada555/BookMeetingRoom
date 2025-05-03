import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const sections = [
  {
    title: "Server Room",
    checks: [
      "Lighting", "Air Condition", "UPS Switch", "UPS Network", "UPS PABX",
      "Switch HUB", "Fan Switch HUB", "Microtik", "Interface", "Firewall for Server"
    ]
  },
  {
    title: "Building A-B-C",
    checks: ["DVR-01", "DVR-02", "DVR-03", "Camera Install 35", "Camera Working", "Camera Offline"]
  },
  {
    title: "Building D-E-F",
    checks: ["DVR-03", "DVR-04", "Camera Install 20", "Camera Working", "Camera Offline"]
  },
  {
    title: "Carpark",
    checks: ["DVR-05", "Camera Install 10", "Camera Working", "Camera Offline"]
  },
  {
    title: "Internet & DATA",
    checks: [
      "Main Internet TOT", "Main Internet NT(CAT)", "Speed Test Wifi-Public",
      "Wifi Test Room 1", "Wifi Test Room 2", "Wifi Test Room 3", "Office Connection",
      "Access Point", "Website Hotel", "EV Charger", "AP Install", "AP Online", "AP Offline"
    ]
  },
  {
    title: "Telephone",
    checks: ["Incoming Call Test", "House Phone Signal Test", "Status PABX"]
  },
  {
    title: "Programs",
    checks: ["Program HR", "Program AC", "Program FO", "Share Drive", "Drive Hotel", "Firewall"]
  }
];

type InputFieldProps = {
  label: string;
  value: { checked: boolean; remark: string };
  onChange: (checked: boolean, remark: string) => void;
};

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => (
  <div className="flex items-center mb-2">
    <input
      type="checkbox"
      className="mr-2 h-5 w-5 text-blue-600"
      checked={value.checked}
      onChange={(e) => onChange(e.target.checked, value.remark)}
    />
    <label className="text-blue-600 font-semibold mr-2 w-48">{label}</label>
    <input
      type="text"
      placeholder="Remark"
      className="flex-1 border border-blue-400 rounded-md p-2 text-blue-700"
      value={value.remark}
      onChange={(e) => onChange(value.checked, e.target.value)}
    />
  </div>
);

const DailyCheckForm: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, { checked: boolean; remark: string }>>(
    Object.fromEntries(
      sections.flatMap(section => section.checks.map(item => [item, { checked: false, remark: "" }]))
    )
  );

  const [checkedBy, setCheckedBy] = useState("");
  const [date, setDate] = useState("");

  const handleFieldChange = (label: string, checked: boolean, remark: string) => {
    setFormData(prev => ({ ...prev, [label]: { checked, remark } }));
  };

  const handleSave = () => {
    const payload = {
      date,
      checkedBy,
      checks: formData,
    };
    console.log("Saving data:", payload);
    alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว (เช่นแสดงใน console)");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("RAVINDRA RESORT AND SPA DAILY CHECK SYSTEMS", 14, 10);
    doc.text(`Date: ${date || "-"} | Checked By: ${checkedBy || "-"}`, 14, 18);

    const rows = Object.entries(formData).map(([key, val]) => [key, val.checked ? "✓" : "", val.remark]);
    autoTable(doc, {
      head: [["Item", "Checked", "Remark"]],
      body: rows,
      startY: 22
    });

    doc.save("daily_check.pdf");
  };

  const exportExcel = () => {
    const rows = [["Item", "Checked", "Remark"]];
    Object.entries(formData).forEach(([key, val]) => {
      rows.push([key, val.checked ? "✓" : "", val.remark]);
    });

    const sheet = XLSX.utils.aoa_to_sheet([
      ["Date", date],
      ["Checked By", checkedBy],
      [],
      ...rows,
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Daily Check");
    XLSX.writeFile(workbook, "daily_check.xlsx");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        RAVINDRA RESORT AND SPA DAILY CHECK SYSTEMS
      </h1>
      <p className="text-blue-600 mb-4">Section: IT</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-blue-700 font-semibold mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-blue-400 rounded-md p-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-blue-700 font-semibold mb-1">Checked By</label>
          <input
            type="text"
            placeholder="Your Name"
            value={checkedBy}
            onChange={(e) => setCheckedBy(e.target.value)}
            className="w-full border border-blue-400 rounded-md p-2"
          />
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.checks.map((check) => (
              <InputField
                key={check}
                label={check}
                value={formData[check]}
                onChange={(checked, remark) => handleFieldChange(check, checked, remark)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          บันทึกข้อมูล
        </button>

        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ดาวน์โหลด PDF
        </button>

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ดาวน์โหลด Excel
        </button>
      </div>
    </div>
  );
};

export default DailyCheckForm;

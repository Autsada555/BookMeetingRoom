import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import XlsxPopulate from "xlsx-populate";


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
  const [images, setImages] = useState<File[]>([]);


  const handleFieldChange = (label: string, checked: boolean, remark: string) => {
    setFormData(prev => ({ ...prev, [label]: { checked, remark } }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };


  const handleSave = async () => {
    const payload = {
      date,
      checkedBy,
      checks: formData,
      images: images.map(img => img.name), // หรืออัปโหลดจริงค่อยส่งไฟล์
    };
    console.log("Saving data:", payload);
    alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว (เช่นแสดงใน console)");

    try {
      const response = await fetch("http://localhost:8080/api/daily-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("บันทึกสำเร็จ!");
      } else {
        const error = await response.json();
        alert("เกิดข้อผิดพลาด: " + error.message);
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("เชื่อมต่อ backend ไม่ได้");
    }
  };

  // Helper: แปลงไฟล์เป็น base64
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };


  const exportPDF = async () => {
    const doc = new jsPDF();
    doc.text("RAVINDRA RESORT AND SPA DAILY CHECK SYSTEMS", 14, 10);
    doc.text(`Date: ${date || "-"} | Checked By: ${checkedBy || "-"}`, 14, 18);

    const rows = Object.entries(formData).map(([key, val]) => [
      key,
      val.checked ? "✓" : "",
      val.remark,
    ]);

    autoTable(doc, {
      head: [["Item", "Checked", "Remark"]],
      body: rows,
      startY: 22,
    });

    let y = (doc.lastAutoTable?.finalY ?? 20) + 10;

    if (images.length > 0) {
      doc.text("Uploaded Images:", 14, y);
      y += 6;
    }

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imgData = await toBase64(image);

      const imgProps = doc.getImageProperties(imgData);
      const ratio = imgProps.width / imgProps.height;
      const width = 50;
      const height = width / ratio;

      if (y + height > 280) {
        doc.addPage();
        y = 20;
      }

      doc.addImage(imgData, "JPEG", 14, y, width, height);
      y += height + 5;
    }

    doc.save("daily_check" + `"${date}"` + ".pdf");
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

      <div className="mb-6">
        <label className="block text-blue-700 font-semibold mb-1">อัปโหลดรูปภาพ (หลายภาพ)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full border border-blue-400 rounded-md p-2"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(img)}
              alt={`preview-${idx}`}
              className="w-24 h-24 object-cover rounded shadow"
            />
          ))}
        </div>
      </div>

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

      </div>
    </div>
  );
};

export default DailyCheckForm;


{/* <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ดาวน์โหลด Excel
        </button> */}
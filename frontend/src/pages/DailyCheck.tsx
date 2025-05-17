import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CreateCheckSystems } from "@/services/https/DailyCheckSystems";
import { DailyChecks } from "@/interfaces/Index";

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
      "Main Internet TOT", "Main Internet NT(CAT)", "Speed Test Wifi-Public", "Office Connection",
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

const DailyCheckSystemPage = () => {
  const [formData, setFormData] = useState(() => Object.fromEntries(
    sections.flatMap(section => section.checks.map(item => [item, ""]))
  ));
  const [checkStates, setCheckStates] = useState(() => Object.fromEntries(
    sections.flatMap(section => section.checks.map(item => [item, false]))
  ));
  const [checkedBy, setCheckedBy] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleFieldChange = (label: string, remark: string) => {
    setFormData(prev => ({ ...prev, [label]: remark }));
  };

  const handleCheckChange = (label: string, checked: boolean) => {
    setCheckStates(prev => ({ ...prev, [label]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleSave = async () => {
    const userId = parseInt(localStorage.getItem("userId") || "0"); // แปลงเป็น number

    const checks = Object.entries(formData).map(([name, remark]) => ({
      name,
      checked: checkStates[name],
      remark
    }));

    const payload: DailyChecks = {
      date,
      checkedBy,
      userID: userId,
      checks,
      images: images.map(img => img.name),
    };

    try {
      const res = await CreateCheckSystems(payload);

      if (res.status) {
        alert("บันทึกสำเร็จ");
        console.log(res)
      } else {
        alert("เกิดข้อผิดพลาด: " + res.message);
        console.log(res)

      }
    } catch (error) {
      console.error("Error:", error);
      alert("เชื่อมต่อ backend ไม่ได้");
    }
  };



  const exportPDF = async () => {
    const doc = new jsPDF();
    doc.text("RAVINDRA RESORT AND SPA DAILY CHECK SYSTEMS", 14, 10);
    doc.text(`Date: ${date || "-"} | Checked By: ${checkedBy || "-"}`, 14, 18);

    const rows = Object.entries(formData).map(([key, remark]) => [
      key,
      checkStates[key] ? "✔️" : "",
      remark,
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

    doc.save(`daily-check-${date || "unknown"}.pdf`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">RAVINDRA RESORT AND SPA DAILY CHECK SYSTEMS</h1>
      <p className="text-blue-600 mb-4">Section: IT</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-blue-700 font-semibold mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-blue-400 rounded-md p-2" />
        </div>
        <div className="flex-1">
          <label className="block text-blue-700 font-semibold mb-1">Checked By</label>
          <input type="text" value={checkedBy} onChange={e => setCheckedBy(e.target.value)} placeholder="Your Name" className="w-full border border-blue-400 rounded-md p-2" />
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.checks.map((check) => (
              <div key={check} className="flex items-center mb-2 gap-2">
                <input type="checkbox" checked={checkStates[check]} onChange={(e) => handleCheckChange(check, e.target.checked)} />
                <label className="w-48 text-blue-600 font-semibold">{check}</label>
                <input type="text" value={formData[check]} onChange={(e) => handleFieldChange(check, e.target.value)} placeholder="Remark" className="flex-1 border border-blue-400 rounded-md p-2 text-blue-700" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-6">
        <label className="block text-blue-700 font-semibold mb-1">อัปโหลดรูปภาพ (หลายภาพ)</label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full border border-blue-400 rounded-md p-2" />
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((img, idx) => (
            <img key={idx} src={URL.createObjectURL(img)} alt={`preview-${idx}`} className="w-24 h-24 object-cover rounded shadow" />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <button onClick={handleSave} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">บันทึกข้อมูล</button>
        <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">ดาวน์โหลด PDF</button>
      </div>
    </div>
  );
};

export default DailyCheckSystemPage;

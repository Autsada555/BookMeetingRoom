import React, { useState } from "react";
import { CreateCheckSystems } from "@/services/https/DailyCheckSystems";
import { DailyChecks } from "@/interfaces/Index";
import { ImageUpload } from "@/components/uploadimage";
import { toast } from "sonner";

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
    title: "Internet",
    checks: [
      "Main Internet TOT", "Main Internet CAT", "Speed Test Wifi-Public", "Office Connection",
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
  const [checkedBy, setCheckedBy] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState<string[]>([]);

  type SectionCheckState = {
    [section: string]: {
      [label: string]: boolean;
    };
  };
  type SectionRemarkState = {
    [section: string]: {
      [label: string]: string;
    };
  };


  const [formData, setFormData] = useState<SectionRemarkState>(() => {
    const initial: SectionRemarkState = {};
    sections.forEach(section => {
      initial[section.title] = {};
      section.checks.forEach(item => {
        initial[section.title][item] = "";
      });
    });
    return initial;
  });

  const [checkStates, setCheckStates] = useState<SectionCheckState>(() => {
    const initial: SectionCheckState = {};
    sections.forEach(section => {
      initial[section.title] = {};
      section.checks.forEach(item => {
        initial[section.title][item] = true;
      });
    });
    return initial;
  });

  const handleFieldChange = (section: string, label: string, remark: string) => {
    setFormData((prev: SectionRemarkState) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [label]: remark,
      }
    }));
  };

  const handleCheckChange = (section: string, label: string, checked: boolean) => {
    setCheckStates((prev: SectionCheckState) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [label]: checked,
      }
    }));
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setImages(Array.from(e.target.files));
  //   }
  // };

  const handleSave = async () => {
    const userId = parseInt(localStorage.getItem("userId") || "0");

    // ✅ แปลงข้อมูล checks ให้เป็น array of { section, name, checked, remark }
    const allChecks = sections.flatMap(section =>
      section.checks.map(item => ({
        section: section.title,
        name: item,
        checked: checkStates[section.title][item],
        remark: formData[section.title][item],
      }))
    );

    const payload: DailyChecks = {
      id: 0, // or generate a temporary id if needed
      date,
      checkedBy,
      userID: userId,
      checks: allChecks,
      images: images,
    };

    try {
      const res = await CreateCheckSystems(payload);
      console.log(res);
      if (res) {
        toast.success("บันทึกสำเร็จ", {
          description: "บันทึกสำเร็จ ข้อมูลอยู่ในระบบแล้ว",
        });
        console.log(res);
      } else {
        toast.error("บันทึกไม่สำเร็จ", {
          description: "มีบางอย่างผิดปกติทำให้บันทึกในระบบไม่ได้",
        });
        console.log(res);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("บันทึกไม่สำเร็จ", {
        description: "มีบางอย่างผิดปกติทำให้บันทึกในระบบไม่ได้",
      });
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">RAVINDRA RESORT AND SPA DAILY CHECK SYSTEMS</h1>
      <div className="flex justify-between">
        <p className="text-blue-600 mb-4">Section: IT</p>
        <div className="mt-6">
        </div>
        <button onClick={handleSave} className="bg-slate-500  text-white px-4 py-2 rounded hover:bg-slate-700 ">ไปหน้าแสดงข้อมูล</button>
      </div>

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
                <input type="checkbox" checked={checkStates[section.title][check]} onChange={(e) => handleCheckChange(section.title, check, e.target.checked)} />
                <label className="w-48 text-blue-600 font-semibold">{check}</label>
                <input type="text" value={formData[section.title][check]} onChange={(e) => handleFieldChange(section.title, check, e.target.value)} placeholder="Remark" className="flex-1 border border-blue-400 rounded-md p-2 text-blue-700" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-6">
        <label className="block text-blue-700 font-semibold mb-1">อัปโหลดรูปภาพ (หลายภาพ)</label>
        <ImageUpload setData={setImages} />
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((img, idx) => (
            <img key={idx} src={img} alt={`preview-${idx}`} className="w-24 h-24 object-cover rounded shadow" />
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="mt-6 ">
          <button onClick={handleSave} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">บันทึกข้อมูล</button>
        </div>
        <div className="mt-6">
          <button onClick={handleSave} className="bg-slate-500  text-white px-4 py-2 rounded hover:bg-slate-700 ">ไปหน้าแสดงข้อมูล</button>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckSystemPage;

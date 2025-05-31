import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GetAllCheckSystems, UpdateCheckSystems, DeleteCheckSystems } from '../services/https/DailyCheckSystems';
import { DailyChecks } from '../interfaces/Index';
import { toast } from 'sonner';
import { FiSettings } from "react-icons/fi";
import './fonts/Sarabun-Regular-normal.js';

interface MonthlyGroupedData {
  [month: string]: DailyChecks[];
}

function groupChecksBySection(checksArr: any[]): Record<string, any[]> {
  return checksArr.reduce((acc, item) => {
    const section = item.section || 'Other';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, any[]>);
}

function safeParseChecks(checks: string | any[] | undefined | null): any {
  if (!checks) return {};
  try {
    const parsed = typeof checks === 'string' ? JSON.parse(checks) : checks;
    return parsed;
  } catch (e) {
    return {};
  }
}

const DataViewer: React.FC = () => {
  const [dailyChecks, setDailyChecks] = useState<DailyChecks[]>([]);
  const [groupedData, setGroupedData] = useState<MonthlyGroupedData>({});
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCheckId, setSelectedCheckId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formUpdateData, setFormUpdateData] = useState<Partial<DailyChecks>>({});
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  const selectedCheck = dailyChecks.find((c) => c.ID === selectedCheckId);

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = async () => {
    const res = await GetAllCheckSystems();
    if (res && Array.isArray(res)) {
      setDailyChecks(res);
      const grouped: MonthlyGroupedData = {};
      res.forEach((item) => {
        const month = item.date ? item.date.slice(0, 7) : 'Unknown';
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(item);
      });
      setGroupedData(grouped);
      const months = Object.keys(grouped);
      if (months.length > 0) setSelectedMonth(months[0]);
    }
  };

  const handleOpenModal = (id: number) => {
    setSelectedCheckId(id);
    setShowModal(false);
    setTimeout(() => setShowModal(true), 0);
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await UpdateCheckSystems(formUpdateData as DailyChecks, id);
      if (res.status) {
        toast.success("แก้ไขข้อมูลสำเร็จ", {
          description: "แก้ไขข้อมูลสำเร็จ",
        });
        setShowEditModal(false);
        setShowModal(false);
        setFormUpdateData({});
        await handleFetchData();
      } else {
        toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล", {
          description: res.message || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล",
        });
      }
    } catch (error) {
      console.error("Error editing check:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล", {
        description: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("ยืนยันการลบข้อมูลนี้?")) return;
    try {
      const res = await DeleteCheckSystems(id);
      if (res.status) {
        toast.success("ลบข้อมูลสำเร็จ", {
          description: "ลบข้อมูลสำเร็จ",
        });
        setShowModal(false);
        setSelectedCheckId(null);
        await handleFetchData();
      } else {
        toast.error("เกิดข้อผิดพลาดในการลบข้อมูล", {
          description: res.message || "เกิดข้อผิดพลาดในการลบข้อมูล",
        });
      }
    } catch (error) {
      console.error("Error deleting check:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล", {
        description: "เกิดข้อผิดพลาดในการลบข้อมูล",
      });
    }
  };

  const handleDownloadPDF = (check: DailyChecks) => {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.text(`Daily Check Report`, 14, 15);
    doc.text(`Date: ${check.date}`, 14, 25);
    doc.text(`Checked By: ${check.checkedBy}`, 14, 32);

    let checks = safeParseChecks(check.checks);
    if (Array.isArray(checks)) {
      checks = groupChecksBySection(checks);
    }
    const rows: any[] = [];
    Object.keys(checks).forEach((sectionName) => {
      const section = checks[sectionName];
      section.forEach((checkItem: any) => {
        rows.push([
          sectionName,
          checkItem.name || '',
          checkItem.checked ? '/' : 'X',
          checkItem.remark || '-', // รองรับภาษาไทยแล้ว
        ]);
      });
    });
    autoTable(doc, {
      startY: 40,
      head: [['Section', 'Item', 'Status', 'Remark']],
      body: rows,
      bodyStyles: { font: 'Sarabun-Regular', fontSize: 10 },
      columnStyles: {
        3: { cellWidth: 50 }, // กำหนดความกว้างคอลัมน์ remark (index 3)
      },
    });

    if (Array.isArray(check.images) && check.images.length > 0) {
      const maxWidth = 60;
      const maxHeight = 40;
      const margin = 10;
      const imagesPerRow = 2;
      let loadedImages = 0;
      let yStart = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 60;
      const totalImages = check.images.length;
      const pageHeight = doc.internal.pageSize.getHeight();
      const imageQueue: { imgData: string; x: number; y: number; w: number; h: number; page: number }[] = [];

      check.images.forEach((imgUrl: string, i: number) => {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = imgUrl;
        img.onload = () => {
          let ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
          let imgWidth = img.width * ratio;
          let imgHeight = img.height * ratio;
          const col = i % imagesPerRow;
          const row = Math.floor(i / imagesPerRow);
          let x = 40 + col * (maxWidth + margin);
          let y = yStart + row * (maxHeight + margin);
          let page = 1;
          while (y + imgHeight > page * pageHeight - 20) {
            page++;
          }
          if (page > 1) {
            y = -30 + (row - imagesPerRow * (page - 1)) * (maxHeight + margin);
          }
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL('image/jpeg');
          imageQueue[i] = { imgData, x, y, w: imgWidth, h: imgHeight, page };
          loadedImages++;
          if (loadedImages === totalImages) {
            let currentPage = 1;
            imageQueue.forEach((imgObj) => {
              if (imgObj.page > currentPage) {
                doc.addPage();
                currentPage = imgObj.page;
              }
              doc.addImage(imgObj.imgData, 'JPEG', imgObj.x, imgObj.y, imgObj.w, imgObj.h);
            });
            doc.save(`CheckSystem_${check.date}.pdf`);
          }
        };
        img.onerror = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            let currentPage = 1;
            imageQueue.forEach((imgObj) => {
              if (imgObj.page > currentPage) {
                doc.addPage();
                currentPage = imgObj.page;
              }
              doc.addImage(imgObj.imgData, 'JPEG', imgObj.x, imgObj.y, imgObj.w, imgObj.h);
            });
            doc.save(`CheckSystem_${check.date}.pdf`);
          }
        };
      });
    } else {
      doc.save(`CheckSystem_${check.date}.pdf`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Daily Check Systems</h1>
      <div className="mb-6">
        <label htmlFor="monthSelect" className="mr-3 font-semibold">เลือกเดือน:</label>
        <select
          id="monthSelect"
          className="border border-gray-400 rounded px-3 py-1"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {Object.keys(groupedData).map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      {selectedMonth && groupedData[selectedMonth] ? (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-blue-700">{selectedMonth}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedData[selectedMonth].map((check) => (
              <div key={check.ID} className="border border-blue-300 p-4 rounded shadow">
                <p><strong>Date:</strong> {check.date}</p>
                <p><strong>Checked By:</strong> {check.checkedBy}</p>
                <button
                  className="bg-blue-600 text-white mt-3 px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handleOpenModal(check.ID)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">ไม่มีข้อมูลสำหรับเดือนนี้</p>
      )}

      {showModal && selectedCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">
                Check Details - {selectedCheck.date}
              </h2>
              <div className="flex items-center gap-2">
                {/* Select สำหรับ Update/Delete */}
                <div className="relative">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
                    aria-label="Settings"
                    onClick={() =>
                      setShowActionMenu(showActionMenu === selectedCheck.ID ? null : selectedCheck.ID)
                    }
                    type="button"
                  >
                    <FiSettings className="text-xl" />
                  </button>
                  {/* Dropdown เมนู */}
                  {showActionMenu === selectedCheck.ID && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                        onClick={() => {
                          setFormUpdateData({
                            ...selectedCheck,
                            checks: Array.isArray(selectedCheck.checks)
                              ? selectedCheck.checks.map(item => ({ ...item }))
                              : [],
                          });
                          setShowEditModal(true);
                          setShowActionMenu(null);
                        }}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                        onClick={() => {
                          handleDelete(selectedCheck.ID);
                          setShowActionMenu(null);
                        }}
                      >
                        ลบ
                      </button>
                    </div>
                  )}
                </div>
                <button
                  className="bg-gray-300 text-gray-800 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-400 text-xl"
                  aria-label="Close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedCheckId(null);
                  }}
                >
                  X
                </button>
              </div>
            </div>
            <div className='flex mb-4'>
              <span className="font-semibold mr-2">Checked By:</span>
              <span className="text-red-600">{selectedCheck.checkedBy}</span>
            </div>
            {(() => {
              let checksData = safeParseChecks(selectedCheck.checks);
              if (Array.isArray(checksData)) {
                checksData = groupChecksBySection(checksData);
              }
              return Object.entries(checksData).map(
                ([section, items], idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">{section}</h3>
                    <table className="w-full border border-gray-300 text-sm mb-4">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border">Item</th>
                          <th className="p-2 border">Status</th>
                          <th className="p-2 border">Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(items) &&
                          items.map((checkItem: any, j: number) => (
                            <tr key={`${section}-${j}`}>
                              <td className="p-2 border">{checkItem.name}</td>
                              <td className="p-2 border text-center">
                                {checkItem.checked ? '✔️' : '❌'}
                              </td>
                              <td className="p-2 border">{checkItem.remark || '-'}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )
              );
            })()}
            {Array.isArray(selectedCheck.images) &&
              selectedCheck.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {selectedCheck.images.map((url: string, index: number) => (
                    <div key={index}>
                      <img
                        src={url}
                        alt={`Check image ${index + 1}`}
                        className="w-full h-auto border rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            <div className="flex justify-end gap-2">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                onClick={() => handleDownloadPDF(selectedCheck)}
              >
                Download PDF
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                onClick={() => {
                  setShowModal(false);
                  setSelectedCheckId(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal สำหรับแก้ไขข้อมูล */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-blue-800">แก้ไขข้อมูล</h2>
            <div className="mb-3">
              <label className="block mb-1">Checked By</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={formUpdateData.checkedBy || ""}
                onChange={e => setFormUpdateData({ ...formUpdateData, checkedBy: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">วันที่</label>
              <input
                type="date"
                className="border rounded px-2 py-1 w-full"
                value={formUpdateData.date || ""}
                onChange={e => setFormUpdateData({ ...formUpdateData, date: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">รายการตรวจสอบ</label>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {Array.isArray(formUpdateData.checks) && formUpdateData.checks.map((item, idx) => (
                  <div key={idx} className="border rounded p-2 flex flex-wrap gap-2 items-center">
                    <input
                      className="border rounded px-2 py-1 w-40 bg-gray-100 text-gray-500"
                      value={item.name}
                      disabled
                      placeholder="ชื่อรายการ"
                    />
                    <input
                      className="border rounded px-2 py-1 w-32 bg-gray-100 text-gray-500"
                      value={item.section}
                      disabled
                      placeholder="Section"
                    />
                    <select
                      className="border rounded px-2 py-1 bg-gray-100 text-gray-500"
                      value={item.checked ? "true" : "false"}
                      disabled
                    >
                      <option value="true">✔️ ผ่าน</option>
                      <option value="false">❌ ไม่ผ่าน</option>
                    </select>
                    <input
                      className="border rounded px-2 py-1 flex-1"
                      value={item.remark}
                      onChange={e => {
                        const newChecks = [...(Array.isArray(formUpdateData.checks) ? formUpdateData.checks : [])];
                        newChecks[idx] = { ...newChecks[idx], remark: e.target.value };
                        setFormUpdateData({ ...formUpdateData, checks: newChecks });
                      }}
                      placeholder="หมายเหตุ"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={async () => {
                  if (formUpdateData.ID) {
                    await handleUpdate(formUpdateData.ID);
                  }
                }}
              >
                อัพเดต
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataViewer;
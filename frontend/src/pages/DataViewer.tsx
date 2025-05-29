import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GetAllCheckSystems } from '../services/https/DailyCheckSystems';
import { DailyChecks } from '../interfaces/Index';

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
  const [selectedCheckId, setSelectedCheckId] = useState<string | number | null>(null);

  const selectedCheck = dailyChecks.find((c) => c.id === selectedCheckId);

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

  // ฟังก์ชันสร้าง PDF พร้อมแสดงรูปทั้งหมดแบบ flex
  const handleDownloadPDF = (check: DailyChecks) => {
    const doc = new jsPDF();
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
          checkItem.checked ? '✔️' : '❌',
          checkItem.remark || '-',
        ]);
      });
    });

    autoTable(doc, {
      startY: 40,
      head: [['Section', 'Item', 'Status', 'Remark']],
      body: rows,
    });

    // ...existing code...
    if (Array.isArray(check.images) && check.images.length > 0) {
      const maxWidth = 60;
      const maxHeight = 40;
      const margin = 10;
      const imagesPerRow = 2;
      let loadedImages = 0;
      let yStart = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 60;
      const totalImages = check.images.length;
      const pageHeight = doc.internal.pageSize.getHeight();

      // เก็บตำแหน่งและข้อมูลภาพไว้ก่อน
      const imageQueue: { imgData: string; x: number; y: number; w: number; h: number; page: number }[] = [];

      check.images.forEach((imgUrl: string, i: number) => {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = imgUrl;
        img.onload = () => {
          let ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
          let imgWidth = img.width * ratio;
          let imgHeight = img.height * ratio;

          // คำนวณตำแหน่ง flex
          const col = i % imagesPerRow;
          const row = Math.floor(i / imagesPerRow);
          let x = 40 + col * (maxWidth + margin);
          let y = yStart + row * (maxHeight + margin);

          // ถ้า y เกินขอบกระดาษ ให้ขึ้นหน้าใหม่
          let page = 1;
          while (y + imgHeight > page * pageHeight - 20) {
            page++;
          }
          if (page > 1) {
            y = yStart + (row - imagesPerRow * (page - 1)) * (maxHeight + margin);
          }

          // วาดลง canvas เพื่อแปลงเป็น base64
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL('image/jpeg');

          imageQueue[i] = { imgData, x, y, w: imgWidth, h: imgHeight, page };

          loadedImages++;
          if (loadedImages === totalImages) {
            // วาดภาพทุกภาพหลังโหลดครบ
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
              <div key={check.id} className="border border-blue-300 p-4 rounded shadow">
                <p><strong>Date:</strong> {check.date}</p>
                <p><strong>Checked By:</strong> {check.checkedBy}</p>
                <button
                  className="bg-blue-600 text-white mt-3 px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => {
                    setSelectedCheckId(check.id);
                    setShowModal(true);
                  }}
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
            <h2 className="text-xl font-bold mb-4 text-blue-800">
              <div className="flex justify-between ">
                <p>Check Details - {selectedCheck.date}</p>
                <div className='flex '>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                    onClick={() => handleDownloadPDF(selectedCheck)}
                  >
                    Download PDF
                  </button>
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
              <div className='flex'>
                <p>Checked By :_ </p>
                <p className="text-red-600">{selectedCheck.checkedBy}</p>
              </div>
            </h2>
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
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleDownloadPDF(selectedCheck)}
              >
                Download PDF
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
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
    </div>
  );
};

export default DataViewer;
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GetAllCheckSystems } from '../services/https/DailyCheckSystems';
import { DailyChecks } from '../interfaces/Index';

interface MonthlyGroupedData {
  [month: string]: DailyChecks[];
}

const DataViewer: React.FC = () => {
  const [dailyChecks, setDailyChecks] = useState<DailyChecks[]>([]);
  const [groupedData, setGroupedData] = useState<MonthlyGroupedData>({});
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedCheckIndex, setSelectedCheckIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = async () => {
    const res = await GetAllCheckSystems();
    if (res && Array.isArray(res)) {
      setDailyChecks(res);
      const grouped = groupByMonth(res);
      setGroupedData(grouped);
      const months = Object.keys(grouped);
      if (months.length > 0) setSelectedMonth(months[0]);
    }
  };

  const groupByMonth = (data: DailyChecks[]) => {
    const grouped: MonthlyGroupedData = {};
    data.forEach((item) => {
      const month = item.date.slice(0, 7);
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(item);
    });
    return grouped;
  };

  function safeParseChecks(checks: string | undefined | null): Record<string, any[]> {
    if (!checks) return {};
    try {
      const parsed = JSON.parse(checks);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  const handleDownloadPDF = (check: DailyChecks) => {
    const doc = new jsPDF();
    doc.text(`Daily Check Report`, 14, 15);
    doc.text(`Date: ${check.date}`, 14, 25);
    doc.text(`Checked By: ${check.checkedBy}`, 14, 32);

    const checks = safeParseChecks(check.checks);
    const rows: any[] = [];

    Object.keys(checks).forEach((sectionName) => {
      const section = checks[sectionName];
      section.forEach((checkItem: any) => {
        rows.push([
          sectionName,
          checkItem.name || '',
          checkItem.status ? '✔️' : '❌',
          checkItem.remark || '-',
        ]);
      });
    });

    autoTable(doc, {
      startY: 40,
      head: [['Section', 'Item', 'Status', 'Remark']],
      body: rows,
    });

    if (Array.isArray(check.images) && check.images.length > 0) {
      const images = check.images;
      let loadedImages = 0;

      images.forEach((imgUrl: string, i: number) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imgUrl;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          const imgData = canvas.toDataURL('image/jpeg');
          if (i !== 0) doc.addPage();
          doc.text(`Image ${i + 1}`, 14, 20);
          doc.addImage(imgData, 'JPEG', 14, 30, 180, 120);

          loadedImages++;
          if (loadedImages === images.length) {
            doc.save(`CheckSystem_${check.date}.pdf`);
          }
        };

        img.onerror = () => {
          loadedImages++;
          if (loadedImages === images.length) {
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
            {groupedData[selectedMonth].map((check, index) => (
              <div key={check.id} className="border border-blue-300 p-4 rounded shadow">
                <p><strong>Date:</strong> {check.date}</p>
                <p><strong>Checked By:</strong> {check.checkedBy}</p>
                <button
                  className="bg-blue-600 text-white mt-3 px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => {
                    setSelectedCheckIndex(index);
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

      {showModal && selectedCheckIndex !== null && dailyChecks[selectedCheckIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-blue-800">
              Check Details - {dailyChecks[selectedCheckIndex].date}
            </h2>

            {Object.entries(safeParseChecks(dailyChecks[selectedCheckIndex].checks)).map(
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
                        items.map((checkItem, j) => (
                          <tr key={`${section}-${j}`}>
                            <td className="p-2 border">{checkItem.name}</td>
                            <td className="p-2 border text-center">
                              {checkItem.status ? '✔️' : '❌'}
                            </td>
                            <td className="p-2 border">{checkItem.remark || '-'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {Array.isArray(dailyChecks[selectedCheckIndex].images) &&
              dailyChecks[selectedCheckIndex].images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {dailyChecks[selectedCheckIndex].images.map((url, index) => (
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
                onClick={() => handleDownloadPDF(dailyChecks[selectedCheckIndex])}
              >
                Download PDF
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  setSelectedCheckIndex(null);
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

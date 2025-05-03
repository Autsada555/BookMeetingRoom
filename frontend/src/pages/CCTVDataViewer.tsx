import React, { useState } from 'react';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type CCTVRecord = {
    date: string;
    status: string;
    remark: string;
  };
  
  const cctvData: { [key: string]: CCTVRecord[] } = {
    '2025-04': [
      { date: '2025-04-01', status: 'Checked', remark: 'Normal' },
      { date: '2025-04-02', status: 'Error', remark: 'No Signal in Cam 4' },
    ],
    '2025-05': [
      { date: '2025-05-01', status: 'Checked', remark: 'Normal' },
      { date: '2025-05-02', status: 'Checked', remark: 'Normal' },
    ]
  };
  

const CCTVDataViewer: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2025-05');

  const handleDownloadExcel = () => {
    const ws = utils.json_to_sheet(cctvData[selectedMonth]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'CCTV');
    writeFile(wb, `CCTV_${selectedMonth}.xlsx`);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Date', 'Status', 'Remark']],
      body: cctvData[selectedMonth].map((item) => [item.date, item.status, item.remark]),
    });
    doc.save(`CCTV_${selectedMonth}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">CCTV Check Data</h1>

      <div className="mb-4">
        <label className="font-semibold text-blue-800 mr-2">Select Month:</label>
        <select
          className="p-2 border border-blue-300 rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {Object.keys(cctvData).map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <table className="w-full border border-blue-300 mb-4">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Remark</th>
          </tr>
        </thead>
        <tbody>
          {cctvData[selectedMonth].map((item, index) => (
            <tr key={index}>
              <td className="p-2 border">{item.date}</td>
              <td className="p-2 border">{item.status}</td>
              <td className="p-2 border">{item.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-x-4">
        <button
          onClick={handleDownloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download Excel
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default CCTVDataViewer;

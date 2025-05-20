import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Edit,
  Trash,
  Printer,
  Download
} from 'lucide-react';
import { contractorData } from '../data/contractorData';
import PageHeader from '../components/PageHeader';

const ContractorDetail = () => {
  const { id } = useParams();
  const contractor = contractorData[parseInt(id, 10)];
  
  if (!contractor) {
    return (
      <div className="flex-1 overflow-y-auto">
        <PageHeader title="Contractor Details" subtitle="View and manage contractor information" />
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-card p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contractor not found</h2>
            <Link 
              to="/contractor-tracker" 
              className="inline-flex items-center text-primary hover:text-primary-dark"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Contractors
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Calculate contract duration
  const startDate = new Date(contractor.startDate);
  const endDate = new Date(contractor.endDate);
  const today = new Date();

  // Calculate days remaining or days overdue
  const daysRemaining = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
  
  // Calculate total contract duration in months
  const contractDurationMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
    (endDate.getMonth() - startDate.getMonth());
    
  // Calculate contract progress percentage if contract is active
  let progressPercentage = 0;
  if (contractor.status === 'Active') {
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    progressPercentage = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader title="Contractor Details" subtitle="View and manage contractor information" />
      
      <main className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/contractor-tracker" 
            className="inline-flex items-center text-primary hover:text-primary-dark"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Contractors
          </Link>
          
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100">
              <Edit size={16} className="mr-2" />
              Edit
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
              <Printer size={16} className="mr-2" />
              Print
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
        
        {/* Contractor Overview Card */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden mb-6">
          <div className="px-6 py-4 bg-primary text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{contractor.contractor}</h2>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                contractor.status === 'Active' ? 'bg-green-400 text-green-800' : 
                'bg-red-400 text-red-800'
              }`}>
                {contractor.status}
              </span>
            </div>
            <p className="text-gray-200 mt-1">{contractor.service}</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard 
                icon={<Calendar className="text-blue-500" />}
                title="Contract Period"
                items={[
                  { label: 'Start Date', value: startDate.toLocaleDateString() },
                  { label: 'End Date', value: endDate.toLocaleDateString() },
                  { label: 'Duration', value: `${contractDurationMonths} months` }
                ]}
              />
              
              <InfoCard 
                icon={<DollarSign className="text-green-500" />}
                title="Financial"
                items={[
                  { label: 'Monthly Amount', value: contractor.monthlyAmount || 'N/A' },
                  { label: 'Yearly Amount', value: contractor.yearlyAmount || 'N/A' },
                  { label: 'Contract Type', value: contractor.contractType }
                ]}
              />
              
              <InfoCard 
                icon={<Clock className="text-accent" />}
                title="Status"
                items={[
                  { 
                    label: 'Status',
                    value: contractor.status,
                    valueClassName: contractor.status === 'Active' ? 'text-green-600' : 'text-red-600'
                  },
                  { 
                    label: contractor.status === 'Active' ? 'Days Remaining' : 'Days Overdue',
                    value: contractor.status === 'Active' ? 
                      (daysRemaining > 0 ? `${daysRemaining} days` : 'Expired') : 
                      `${Math.abs(daysRemaining)} days`
                  }
                ]}
              />
            </div>
            
            {/* Contract Progress */}
            {contractor.status === 'Active' && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Contract Progress</h3>
                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full ${
                      progressPercentage < 70 ? 'bg-green-500' :
                      progressPercentage < 90 ? 'bg-accent' : 'bg-red-500'
                    }`} 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Start</span>
                  <span>{progressPercentage}% Complete</span>
                  <span>End</span>
                </div>
              </div>
            )}
            
            {/* Additional Notes */}
            {contractor.note && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                <p className="text-gray-600">{contractor.note}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Contract Documents */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Documents</h3>
          
          <div className="border rounded-md divide-y">
            <DocumentRow 
              title="Contract Agreement" 
              type="PDF" 
              size="2.4 MB" 
              date="15 Jan 2025" 
            />
            <DocumentRow 
              title="Service Level Agreement" 
              type="DOCX" 
              size="1.8 MB" 
              date="15 Jan 2025" 
            />
            <DocumentRow 
              title="Financial Terms" 
              type="PDF" 
              size="1.2 MB" 
              date="15 Jan 2025" 
            />
          </div>
          
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <FileText size={16} className="mr-2" />
            Upload New Document
          </button>
        </div>
        
        {/* Service History */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Service History</h3>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  12 Apr 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Scheduled Maintenance
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Ahmed Al-Balushi
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Regular maintenance completed as per schedule
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  15 Mar 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Emergency Repair
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Saif Al-Maamari
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Fixed critical issue with system
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  10 Feb 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Scheduled Maintenance
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Ahmed Al-Balushi
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Regular maintenance completed as per schedule
                </td>
              </tr>
            </tbody>
          </table>
          
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <FileText size={16} className="mr-2" />
            Add Service Record
          </button>
        </div>
      </main>
    </div>
  );
};

// Information Card Component
const InfoCard = ({ icon, title, items }) => {
  return (
    <div>
      <div className="flex items-center mb-3">
        <div className="mr-2">{icon}</div>
        <h3 className="text-md font-medium text-gray-700">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index}>
            <span className="text-sm text-gray-500">{item.label}:</span>
            <p className={`text-sm font-medium ${item.valueClassName || 'text-gray-900'}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Document Row Component
const DocumentRow = ({ title, type, size, date }) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div className="flex items-center">
        <div className={`w-10 h-10 flex items-center justify-center rounded ${
          type === 'PDF' ? 'bg-red-100 text-red-700' :
          type === 'DOCX' ? 'bg-blue-100 text-blue-700' : 
          'bg-gray-100 text-gray-700'
        }`}>
          {type}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{size} • Updated {date}</p>
        </div>
      </div>
      <div className="flex">
        <button className="p-2 text-gray-400 hover:text-primary">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};

export default ContractorDetail;
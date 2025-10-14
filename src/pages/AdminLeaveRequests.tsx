import { useState } from 'react';
import { FileText, Search, Check, X, Calendar, Clock } from 'lucide-react';

const AdminLeaveRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  // Mock data
  const leaveRequests = [
    { id: 1, userEmail: 'john.doe@company.com', fromDate: '2025-10-15', toDate: '2025-10-17', reason: 'Family vacation', status: 'pending', submittedAt: '2025-10-10' },
    { id: 2, userEmail: 'jane.smith@company.com', fromDate: '2025-10-20', toDate: '2025-10-22', reason: 'Medical appointment', status: 'pending', submittedAt: '2025-10-11' },
    { id: 3, userEmail: 'mike.wilson@company.com', fromDate: '2025-10-18', toDate: '2025-10-19', reason: 'Personal work', status: 'approved', submittedAt: '2025-10-09' },
    { id: 4, userEmail: 'sarah.jones@company.com', fromDate: '2025-10-25', toDate: '2025-10-27', reason: 'Wedding ceremony', status: 'approved', submittedAt: '2025-10-08' },
    { id: 5, userEmail: 'david.brown@company.com', fromDate: '2025-10-14', toDate: '2025-10-14', reason: 'Short notice leave', status: 'rejected', submittedAt: '2025-10-13' },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDays = (from, to) => {
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const filteredRequests = leaveRequests.filter(request =>
    request.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const approvedRequests = filteredRequests.filter(r => r.status === 'approved');
  const rejectedRequests = filteredRequests.filter(r => r.status === 'rejected');

  const currentRequests = activeTab === 'pending' ? pendingRequests : 
                         activeTab === 'approved' ? approvedRequests : 
                         rejectedRequests;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leave Requests</h1>
          <p className="text-sm text-gray-600 mt-1">Review and manage employee leave requests</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-1 font-medium">Pending</div>
            <div className="text-2xl font-semibold text-gray-900">{pendingRequests.length}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-1 font-medium">Approved</div>
            <div className="text-2xl font-semibold text-gray-900">{approvedRequests.length}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-600 mb-1 font-medium">Rejected</div>
            <div className="text-2xl font-semibold text-gray-900">{rejectedRequests.length}</div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">All Requests</h2>
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'pending'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'approved'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'rejected'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {currentRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No {activeTab} requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-900 hover:shadow-md transition-all bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{request.userEmail}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>Submitted {formatDate(request.submittedAt)}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        request.status === 'approved' ? 'bg-gray-900 text-white' :
                        request.status === 'rejected' ? 'bg-gray-300 text-gray-700' :
                        'bg-gray-100 text-gray-900 border border-gray-300'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 font-medium">
                        <Calendar className="h-3 w-3" />
                        <span>Duration</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900 font-medium">
                          {formatDate(request.fromDate)} - {formatDate(request.toDate)}
                        </span>
                        <span className="text-gray-700 font-semibold bg-white px-2 py-1 rounded border border-gray-200">
                          {calculateDays(request.fromDate, request.toDate)} day(s)
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-1 font-medium">Reason</p>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{request.reason}</p>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md">
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                        <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-gray-900 py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5">
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLeaveRequests;
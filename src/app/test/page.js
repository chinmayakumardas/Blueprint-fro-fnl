"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Eye, Edit, Download, User, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import * as XLSX from 'xlsx';

// Dummy data for bugs
const dummyBugs = [
  { id: 1, title: "Login page crash", status: "Pending", teamMember: "Alice", priority: "High", createdAt: "2025-07-01", description: "App crashes on invalid login attempt." },
  { id: 2, title: "API timeout error", status: "Completed", teamMember: "Bob", priority: "Medium", createdAt: "2025-07-02", description: "API call exceeds timeout limit." },
  { id: 3, title: "UI misalignment", status: "Pending", teamMember: "Charlie", priority: "Low", createdAt: "2025-07-03", description: "UI elements misaligned on mobile view." },
  { id: 4, title: "Database connection fail", status: "Completed", teamMember: "Alice", priority: "High", createdAt: "2025-07-04", description: "Connection to DB fails intermittently." },
  { id: 5, title: "Form validation issue", status: "Pending", teamMember: "Bob", priority: "Medium", createdAt: "2025-07-05", description: "Form accepts invalid inputs." },
  { id: 6, title: "Auth token refresh", status: "Completed", teamMember: "Charlie", priority: "High", createdAt: "2025-07-06", description: "Token refresh fails after expiry." },
  { id: 7, title: "Payment gateway error", status: "Pending", teamMember: "Alice", priority: "High", createdAt: "2025-07-07", description: "Payment processing fails for some users." },
  { id: 8, title: "Search filter bug", status: "Completed", teamMember: "Bob", priority: "Low", createdAt: "2025-07-08", description: "Search filter ignores some criteria." },
  { id: 9, title: "Notification delay", status: "Pending", teamMember: "Charlie", priority: "Medium", createdAt: "2025-07-09", description: "Notifications delayed by several minutes." },
  { id: 10, title: "Cache invalidation", status: "Completed", teamMember: "Alice", priority: "Medium", createdAt: "2025-07-10", description: "Cache not refreshing properly." },
  { id: 11, title: "Session timeout", status: "Pending", teamMember: "Bob", priority: "High", createdAt: "2025-07-11", description: "Sessions time out unexpectedly." },
];

const BugList = () => {
  const [bugs, setBugs] = useState(dummyBugs);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [downloadFormat, setDownloadFormat] = useState('xlsx');
  const [downloadTeamMember, setDownloadTeamMember] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [bugsPerPage, setBugsPerPage] = useState(() => typeof window !== "undefined" && window.innerWidth < 768 ? 5 : 10);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [modalTeamMember, setModalTeamMember] = useState('');
  const [newStatus, setNewStatus] = useState('');

  // Unique team members for filter
  const teamMembers = ['All', ...new Set(dummyBugs.map(bug => bug.teamMember))];
  const teamMembersForModal = teamMembers.filter(member => member !== 'All');

  // Responsive pagination
  useEffect(() => {
    const handleResize = () => {
      setBugsPerPage(window.innerWidth < 768 ? 5 : 10);
      setCurrentPage(1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sort and filter bugs
  const filteredBugs = bugs
    .filter(bug => bug.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const fieldA = String(a[sortField] || '').toLowerCase();
      const fieldB = String(b[sortField] || '').toLowerCase();
      return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    });

  // Pagination logic
  const totalItems = filteredBugs.length;
  const totalPages = Math.ceil(totalItems / bugsPerPage);
  const indexOfLastBug = currentPage * bugsPerPage;
  const indexOfFirstBug = indexOfLastBug - bugsPerPage;
  const currentBugs = filteredBugs.slice(indexOfFirstBug, indexOfLastBug);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Download function
  const downloadFile = (data, fileName, format) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bugs');
    if (format === 'csv') {
      XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
    } else {
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
  };

  // Handle download for main download button
  const handleDownload = () => {
    const dataToDownload = downloadTeamMember === 'All'
      ? filteredBugs
      : filteredBugs.filter(bug => bug.teamMember === downloadTeamMember);
    const fileName = downloadTeamMember === 'All' ? 'project_bugs_report' : `${downloadTeamMember}_bugs_report`;
    downloadFile(dataToDownload, fileName, downloadFormat);
  };

  // Handle download for individual report modal
  const handleModalDownload = () => {
    if (modalTeamMember) {
      const dataToDownload = filteredBugs.filter(bug => bug.teamMember === modalTeamMember);
      downloadFile(dataToDownload, `${modalTeamMember}_bugs_report`, downloadFormat);
      setIsIndividualModalOpen(false);
      setModalTeamMember('');
    }
  };

  // Handle view bug
  const handleViewBug = (bug) => {
    setSelectedBug(bug);
    setIsViewModalOpen(true);
  };

  // Handle update status
  const handleUpdateStatus = () => {
    if (selectedBug && newStatus) {
      setBugs(bugs.map(bug =>
        bug.id === selectedBug.id ? { ...bug, status: newStatus } : bug
      ));
      setIsUpdateModalOpen(false);
      setSelectedBug(null);
      setNewStatus('');
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-4 bg-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-blue-100 p-4 rounded-lg mb-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
            <Input
              placeholder="Search by bug title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/3 border-blue-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <Select value={downloadFormat} onValueChange={setDownloadFormat}>
              <SelectTrigger className="w-full sm:w-1/4 border-blue-300 focus:ring-blue-500 focus:border-blue-500 text-sm">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xlsx">XLSX</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-black font-semibold text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button
              onClick={() => setIsIndividualModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-black font-semibold text-sm"
            >
              <User className="h-4 w-4 mr-2" />
              Individual Report
            </Button>
          </div>
        </div>
      </div>

      {/* Individual Report Modal */}
      <Dialog open={isIndividualModalOpen} onOpenChange={setIsIndividualModalOpen}>
        <DialogContent className="sm:max-w-md bg-blue-50">
          <DialogHeader>
            <DialogTitle className="text-black font-bold">Download Individual Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-black font-bold text-sm">Select Team Member</label>
              <Select value={modalTeamMember} onValueChange={setModalTeamMember}>
                <SelectTrigger className="border-blue-300 focus:ring-blue-500 focus:border-blue-500 text-sm">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembersForModal.map(member => (
                    <SelectItem key={member} value={member}>{member}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsIndividualModalOpen(false);
                setModalTeamMember('');
              }}
              className="border-blue-300 text-black hover:bg-blue-100 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleModalDownload}
              disabled={!modalTeamMember}
              className="bg-blue-600 hover:bg-blue-700 text-black font-semibold disabled:bg-blue-300 text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Bug Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md bg-blue-50">
          <DialogHeader>
            <DialogTitle className="text-black font-bold">Bug Details</DialogTitle>
          </DialogHeader>
          {selectedBug && (
            <div className="space-y-4 mt-2 text-black">
              <div>
                <strong className="font-bold">ID:</strong> {selectedBug.id}
              </div>
              <div>
                <strong className="font-bold">Title:</strong> {selectedBug.title}
              </div>
              <div>
                <strong className="font-bold">Status:</strong> {selectedBug.status}
              </div>
              <div>
                <strong className="font-bold">Team Member:</strong> {selectedBug.teamMember}
              </div>
              <div>
                <strong className="font-bold">Priority:</strong> {selectedBug.priority}
              </div>
              <div>
                <strong className="font-bold">Created At:</strong> {selectedBug.createdAt}
              </div>
              <div>
                <strong className="font-bold">Description:</strong> {selectedBug.description}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
              className="border-blue-300 text-black hover:bg-blue-100 text-sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-md bg-blue-50">
          <DialogHeader>
            <DialogTitle className="text-black font-bold">Update Bug Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-black font-bold text-sm">Select New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="border-blue-300 focus:ring-blue-500 focus:border-blue-500 text-sm">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateModalOpen(false);
                setNewStatus('');
                setSelectedBug(null);
              }}
              className="border-blue-300 text-black hover:bg-blue-100 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!newStatus}
              className="bg-blue-600 hover:bg-blue-700 text-black font-semibold disabled:bg-blue-300 text-sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bug Table */}
      <div className="bg-white rounded-lg border border-blue-200 overflow-x-auto">
        <Table>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="text-black font-bold text-center cursor-pointer" onClick={() => handleSort('id')}>
                <div className="flex items-center justify-center">
                  ID
                  {sortField === 'id' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 ml-2" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-black font-bold text-center cursor-pointer" onClick={() => handleSort('title')}>
                <div className="flex items-center justify-center">
                  Title
                  {sortField === 'title' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 ml-2" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-black font-bold text-center cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center justify-center">
                  Status
                  {sortField === 'status' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 ml-2" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-black font-bold text-center cursor-pointer" onClick={() => handleSort('teamMember')}>
                <div className="flex items-center justify-center">
                  Team Member
                  {sortField === 'teamMember' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 ml-2" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-black font-bold text-center cursor-pointer" onClick={() => handleSort('priority')}>
                <div className="flex items-center justify-center">
                  Priority
                  {sortField === 'priority' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 ml-2" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-black font-bold text-center cursor-pointer" onClick={() => handleSort('createdAt')}>
                <div className="flex items-center justify-center">
                  Created At
                  {sortField === 'createdAt' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 ml-2" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-black font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBugs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-black">
                  No bugs found.
                </TableCell>
              </TableRow>
            ) : (
              currentBugs.map(bug => (
                <TableRow key={bug.id}>
                  <TableCell className="text-center">{bug.id}</TableCell>
                  <TableCell className="text-center">{bug.title}</TableCell>
                  <TableCell className="text-center">{bug.status}</TableCell>
                  <TableCell className="text-center">{bug.teamMember}</TableCell>
                  <TableCell className="text-center">{bug.priority}</TableCell>
                  <TableCell className="text-center">{bug.createdAt}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewBug(bug)}
                        className="border-blue-300 text-black hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBug(bug);
                          setIsUpdateModalOpen(true);
                        }}
                        className="border-blue-300 text-black hover:bg-blue-100"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-blue-200">
            <div className="text-sm text-black">
              Showing {currentBugs.length} of {totalItems} items
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-black font-bold">Rows:</span>
                <Select
                  value={bugsPerPage.toString()}
                  onValueChange={(value) => {
                    setBugsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 border-blue-300 focus:ring-blue-500 focus:border-blue-500 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-blue-300 text-black hover:bg-blue-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-2 text-sm text-black">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-blue-300 text-black hover:bg-blue-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugList;
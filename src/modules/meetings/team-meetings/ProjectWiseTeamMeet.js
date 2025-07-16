// components/ProjectWiseTeamMeet.js

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamByProjectId } from '@/features/viewTeamByProjectIdSlice';
import { fetchTeamMembers } from '@/features/teamMembersSlice';
import { fetchMeetingsByTeamId, createMeeting, updateMeeting } from '@/features/meetingSlice';
import TeamMeetingCreateForm from './TeamMeetingCreateForm';
import { Button } from '@/components/ui/button';
import { FiCalendar, FiEdit2, FiPlus, FiUsers } from 'react-icons/fi';
import { toast } from 'sonner';

const ProjectWiseTeamMeet = ({ projectId="AAS-IT-WEB-001" }) => {
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.projectTeam);
  const { meetings=[], status: meetingStatus } = useSelector((state) => state.meeting);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [editMeeting, setEditMeeting] = useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTeamByProjectId(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (selectedTeam?._id) {
      dispatch(fetchTeamMembers());
      dispatch(fetchMeetingsByTeamId(selectedTeam._id));
    }
  }, [dispatch, selectedTeam]);

  const handleCreateOrUpdateMeeting = async (payload) => {
    try {
      if (editMeeting) {
        await dispatch(updateMeeting({ id: editMeeting._id, data: payload })).unwrap();
        toast.success('Meeting updated successfully');
      } else {
        await dispatch(createMeeting({ ...payload, teamId: selectedTeam._id })).unwrap();
        toast.success('Meeting created successfully');
      }
      setShowMeetingForm(false);
      setEditMeeting(null);
      dispatch(fetchMeetingsByTeamId(selectedTeam._id));
    } catch (err) {
      toast.error('Failed to process meeting');
    }
  };

  return (
    <div className="space-y-6">
      {/* Select Team */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FiUsers className="text-blue-600" /> Project Teams
        </h2>
        <div className="flex flex-wrap gap-2">
          {teams
            .filter((t) => t.projectId === projectId)
            .map((team) => (
              <Button
                key={team._id}
                variant={selectedTeam?._id === team._id ? 'default' : 'outline'}
                onClick={() => setSelectedTeam(team)}
              >
                {team.teamLeadName} Team
              </Button>
            ))}
        </div>
      </div>

      {/* Meetings List */}
      {selectedTeam && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
              <FiCalendar className="text-green-600" /> Meetings
            </h3>
            <Button onClick={() => setShowMeetingForm(true)}>
              <FiPlus className="mr-1" /> Schedule Meeting
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetingStatus === 'loading' ? (
              <p>Loading...</p>
            ) : meetings?.length ? (
              meetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md"
                >
                  <h4 className="font-semibold text-lg text-gray-800 mb-1">
                    {meeting.summary}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">Date: {meeting.date}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    Time: {meeting.selectedSlot?.startTime} - {meeting.selectedSlot?.endTime}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Attendees: {meeting.attendees?.map((a) => a.email).join(', ')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditMeeting(meeting);
                      setShowMeetingForm(true);
                    }}
                    className="text-sm flex gap-1 items-center"
                  >
                    <FiEdit2 /> Edit
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No meetings scheduled.</p>
            )}
          </div>
        </div>
      )}

      {/* Meeting Form Modal */}
      {showMeetingForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white p-6 rounded-lg max-w-xl w-full relative shadow-xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => {
                setShowMeetingForm(false);
                setEditMeeting(null);
              }}
            >
              ✕
            </Button>
            <TeamMeetingCreateForm
              onSubmit={handleCreateOrUpdateMeeting}
              initialData={editMeeting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectWiseTeamMeet;

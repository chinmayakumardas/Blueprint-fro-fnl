
// 'use client';

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { format } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';
// import { Clock, Video } from 'lucide-react';

// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Calendar as CalendarComponent } from '@/components/ui/calendar';

// import { fetchAllSlots } from '@/features/master/slotMasterSlice';
// import { useLoggedinUser } from '@/hooks/useLoggedinUser';

// const TIME_ZONE = 'Asia/Kolkata';
// const formatTime = (timeStr) => {
//   const [hour, minute] = timeStr.split(':');
//   const date = new Date();
//   date.setHours(+hour, +minute);
//   return format(date, 'hh:mm a');
// };

// const formatSlotTime = (startTime, endTime) => {
//   return `${formatTime(startTime)} - ${formatTime(endTime)}`;
// };

// const formatSelectedDate = (date) => {
//   return format(toZonedTime(date, TIME_ZONE), 'EEEE, MMMM d, yyyy', { timeZone: TIME_ZONE });
// };

// export default function TeamMeetingCreateForm({ onSubmit }) {
//   const {currentUser}=useLoggedinUser();
//   // console.log("currentUser", currentUser);
//   const dispatch = useDispatch();
//   const { slots, loading, error } = useSelector((state) => state.slots);

//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [form, setForm] = useState({
//     email: '',
//     summary: '',
//     description: '',
//     attendees: '',
//     selectedSlot: null,
//     isMeet: false,
//   });
//   const [formError, setFormError] = useState('');

//   useEffect(() => {
//     const formattedDate = format(toZonedTime(selectedDate, TIME_ZONE), 'yyyy-MM-dd', {
//       timeZone: TIME_ZONE,
//     });
//     dispatch(fetchAllSlots(formattedDate));
//   }, [ dispatch, selectedDate ]);

// console.log("slots", slots.data);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     setFormError('');
//   };

//   const handleSlotChange = (slotId) => {
//     const selected = slots?.find((s) => s._id === slotId);
//     if (selected) {
//       setForm((prev) => ({ ...prev, selectedSlot: selected }));
//       setFormError('');
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!form.selectedSlot) {
//       setFormError('Please select a time slot');
//       return;
//     }

//     if (!form.email || !form.summary) {
//       setFormError('Organizer email and meeting summary are required');
//       return;
//     }

//     const payload = {
//       email: form.email,
//       summary: form.summary,
//       description: form.description,
//       attendees: form.attendees
//         .split(',')
//         .map((email) => ({ email: email.trim() }))
//         .filter((a) => a.email),
//       date: format(toZonedTime(selectedDate, TIME_ZONE), 'yyyy-MM-dd', {
//         timeZone: TIME_ZONE,
//       }),
//       selectedSlot: {
//         startTime: form.selectedSlot.startTime,
//         endTime: form.selectedSlot.endTime,
//       },
//       conference: form.isMeet,
//     };

//     onSubmit(payload);
//   };
//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {formError && (
//         <Alert variant="destructive">
//           <AlertDescription>{formError}</AlertDescription>
//         </Alert>
//       )}

//       <div>
//         <Label className="text-green-800">Select Date</Label>
//         <Card className="border-green-200">
//           <CardContent className="p-4">
//             <CalendarComponent
//               mode="single"
//               selected={selectedDate}
//               onSelect={(date) => date && setSelectedDate(date)}
//               disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
//               className="rounded-md"
//             />
//           </CardContent>
//         </Card>
//       </div>

//       <div>
//         <Label className="text-green-800 flex gap-2 items-center">
//           <Clock className="w-4 h-4" />
//           Select Time Slot
//         </Label>
//         <Select onValueChange={handleSlotChange} value={form.selectedSlot?._id || ''}>
//           <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
//             <SelectValue placeholder="Choose a time slot" />
//           </SelectTrigger>
//           <SelectContent>
//             {loading? (
//               <SelectItem value="loading" disabled>Loading...</SelectItem>
//             ) : error? (
//               <SelectItem value="error" disabled>Error loading slots</SelectItem>
//             ) : !slots || slots.length === 0 ? (
//               <SelectItem value="no-slots" disabled>No slots available</SelectItem>
//             ) : (
//               slots.map((slot) => (
//                 <SelectItem key={slot._id} value={slot._id}>
//                   {formatSlotTime(slot.startTime, slot.endTime)} ({slot.shift})
//                 </SelectItem>
//               ))
//             )}
//           </SelectContent>
//         </Select>
//       </div>

//       <div>
//         <Label className="text-green-800">Organizer Email</Label>
//         <Input name="email" type="email" value={form.email} onChange={handleChange} required />
//       </div>

//       <div>
//         <Label className="text-green-800">Meeting Title</Label>
//         <Input name="summary" value={form.summary} onChange={handleChange} required />
//       </div>

//       <div>
//         <Label className="text-green-800">Attendees (comma-separated emails)</Label>
//         <Input name="attendees" value={form.attendees} onChange={handleChange} />
//       </div>

//       <div>
//         <Label className="text-green-800">Description</Label>
//         <Textarea name="description" value={form.description} onChange={handleChange} />
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           name="isMeet"
//           checked={form.isMeet}
//           onChange={handleChange}
//           className="w-4 h-4"
//         />
//         <Label className="flex items-center gap-1 text-green-800">
//           <Video className="w-4 h-4" />
//           Add Google Meet
//         </Label>
//       </div>

//       {selectedDate && form.selectedSlot && (
//         <div className="p-4 bg-green-100 rounded-md border border-green-200 text-sm text-green-700 space-y-1">
//           <p><strong>Date:</strong> {formatSelectedDate(selectedDate)}</p>
//           <p><strong>Time:</strong> {formatSlotTime(form.selectedSlot.startTime, form.selectedSlot.endTime)}</p>
//           <p><strong>Shift:</strong> {form.selectedSlot.shift}</p>
//           <p><strong>Slot No:</strong> {form.selectedSlot.slotNo}</p>
//         </div>
//       )}

//       <div className="flex justify-end">
//         <Button type="submit" disabled={loading || loading}>
//           {loading ? 'Scheduling...' : 'Schedule Meeting'}
//         </Button>
//       </div>
//     </form>
//   );
// }
'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Clock } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { fetchAllSlots } from '@/features/master/slotMasterSlice';
import { useLoggedinUser } from '@/hooks/useLoggedinUser';

const TIME_ZONE = 'Asia/Kolkata';

const formatTime = (timeStr) => {
  const [hour, minute] = timeStr.split(':');
  const date = new Date();
  date.setHours(+hour, +minute);
  return format(date, 'hh:mm a');
};

const formatSlotTime = (startTime, endTime) => {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

const formatSelectedDate = (date) => {
  return format(toZonedTime(date, TIME_ZONE), 'EEEE, MMMM d, yyyy', { timeZone: TIME_ZONE });
};

export default function TeamMeetingCreateForm({ onSubmit }) {
  const { currentUser } = useLoggedinUser();
  const dispatch = useDispatch();
  const { slots, loading, error } = useSelector((state) => state.slots);

  const initialDate = new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const [form, setForm] = useState({
    email: currentUser?.email || '',
    summary: '',
    description: '',
    attendees: '',
    selectedSlot: null,
  });

  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError('');
  };

  const handleSlotChange = (slotId) => {
    const selected = slots?.find((s) => s._id === slotId);
    if (selected) {
      setForm((prev) => ({ ...prev, selectedSlot: selected }));
      setFormError('');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formatted = format(toZonedTime(date, TIME_ZONE), 'yyyy-MM-dd', {
      timeZone: TIME_ZONE,
    });
    dispatch(fetchAllSlots(formatted));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.selectedSlot) {
      setFormError('Please select a time slot');
      return;
    }

    if (!form.email || !form.summary) {
      setFormError('Organizer email and meeting summary are required');
      return;
    }

    const payload = {
      email: form.email,
      summary: form.summary,
      description: form.description,
      attendees: form.attendees
        .split(',')
        .map((email) => ({ email: email.trim() }))
        .filter((a) => a.email),
      date: format(toZonedTime(selectedDate, TIME_ZONE), 'yyyy-MM-dd', {
        timeZone: TIME_ZONE,
      }),
      selectedSlot: {
        startTime: form.selectedSlot.startTime,
        endTime: form.selectedSlot.endTime,
      },
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      {/* Date & Slot Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Picker using ShadCN Calendar */}
        <div className="flex flex-col gap-2">
          <Label className="text-green-800">Choose Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-left font-normal w-full">
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Slot Selection */}
        <div className="flex flex-col gap-2">
          <Label className="text-green-800 flex gap-2 items-center">
            <Clock className="w-4 h-4" />
            Choose Time Slot
          </Label>
          <Select onValueChange={handleSlotChange} value={form.selectedSlot?._id || ''}>
            <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
              <SelectValue placeholder="Select slot" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : error ? (
                <SelectItem value="error" disabled>Error loading slots</SelectItem>
              ) : !slots || slots.length === 0 ? (
                <SelectItem value="no-slots" disabled>No slots available</SelectItem>
              ) : (
                slots.map((slot) => (
                  <SelectItem key={slot._id} value={slot._id}>
                    {formatSlotTime(slot.startTime, slot.endTime)} ({slot.shift})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Organizer Email */}
      <div>
        <Label className="text-green-800">Organizer Email</Label>
        <Input
          name="email"
          type="email"
          value={form.email}
          readOnly
          className="bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Meeting Title */}
      <div>
        <Label className="text-green-800">Meeting Title</Label>
        <Input name="summary" value={form.summary} onChange={handleChange} required />
      </div>

      {/* Attendees */}
      <div>
        <Label className="text-green-800">Attendees (comma-separated emails)</Label>
        <Input name="attendees" value={form.attendees} onChange={handleChange} />
      </div>

      {/* Description */}
      <div>
        <Label className="text-green-800">Description</Label>
        <Textarea name="description" value={form.description} onChange={handleChange} />
      </div>

      {/* Slot Summary */}
      {selectedDate && form.selectedSlot && (
        <div className="p-4 bg-green-100 rounded-md border border-green-200 text-sm text-green-700 space-y-1">
          <p><strong>Date:</strong> {formatSelectedDate(selectedDate)}</p>
          <p><strong>Time:</strong> {formatSlotTime(form.selectedSlot.startTime, form.selectedSlot.endTime)}</p>
          <p><strong>Shift:</strong> {form.selectedSlot.shift}</p>
          <p><strong>Slot No:</strong> {form.selectedSlot.slotNo}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule Meeting'}
        </Button>
      </div>
    </form>
  );
}

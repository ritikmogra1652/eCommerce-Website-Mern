import React from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Calender: React.FC = () => {
    return (
        <div>
            <Calendar
                localizer={localizer}
                events={[{ title: "Meeting", start: "2024-12-15T01:00:00Z", end: "2024-12-15T18:00:00Z", resource:{good:"sadjkhaksjdhkj"}}]}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500}}
            />
        </div>
    )
}

export default Calender
import  { useEffect, useState } from 'react'
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import axios from 'axios';
import { RootState } from '../../state_management';
import { useSelector } from 'react-redux';
import { MeetingData } from '../../interface/commonInterfaces';
import Loader from '../../commonComponents/Loader';

const ApproveMeetings = () => {
    const [meetings, setMeetings] = useState<MeetingData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const jwtToken = useSelector( 
        (state: RootState) => state.AuthReducer.authData?.jwtToken);
    const AuthStr = 'Bearer ' + jwtToken;

    const approveMeeting = async (id:string) => {
        try {
            console.log("insdie teh a");
            
            await axios.post(`${backendApiUrl}${endPoints.ADMIN_APPROVE_MEETING}/${id}`, {
                headers: {
                    Authorization: AuthStr
                }
            });
            alert("Meeting approved");
            fetchMeetings();
        } catch (error) {
            alert("Failed to approve meeting");
        }
    };
    const fetchMeetings = async () => {
        try {
            const res = await axios.get(`${backendApiUrl}${endPoints.ADMIN_GET_MEETINGS}`,
                {
                    headers: {
                        Authorization: AuthStr
                    }
                }
            );
            setMeetings(res?.data?.data || []);
            setLoading(false);
        }
        catch (err) {
            console.error('Error fetching reviews:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        
        fetchMeetings();
    }, []);
    if (loading) {
        return <Loader />;
    }
    
    return (
        <div>
            <ul>
                {meetings.length ? meetings?.map((meeting) => (
                    <li key={meeting._id}>
                        <p>Topic: {meeting.topic}</p>
                        <p>Start Time: {new Date(meeting.start_time).toLocaleString()}</p>
                        <p>Duration: {meeting.duration} minutes</p>
                        <p>Status: {meeting.approved ? "Approved" : "Pending"}</p>
                        {!meeting.approved && (
                            <button onClick={() => approveMeeting(meeting._id)}>
                                Approve
                            </button>
                        )}
                        {meeting.approved && (
                            <a href={meeting.join_url}  target="_blank" rel="noopener noreferrer">
                                Join Meeting
                            </a>
                        )}
                    </li>
                )): "No meeting found"}
            </ul>
        </div>
    )
}

export default ApproveMeetings
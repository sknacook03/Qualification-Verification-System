import React, { useState, useEffect } from 'react';
import axios from "axios";

const StudentDetails = ({ studentId }) => {
    const [student, setStudent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const data = await axios.get("");
                setStudent(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchStudentData();
    }, [studentId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{student.name}</h1>
            <p>Age: {student.age}</p>
            <p>Grade: {student.grade}</p>
            {/* ข้อมูลอื่น ๆ ของนักศึกษา */}
        </div>
    );
};

export default StudentDetails;
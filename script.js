// attendance-manager.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements for Student Management ---
    const studentManagementForm = document.getElementById('student-management-form');
    const newStudentNameInput = document.getElementById('newStudentName');
    const newStudentClassInput = document.getElementById('newStudentClass');
    const savedStudentsList = document.getElementById('savedStudentsList');
    const clearAllStudentsBtn = document.getElementById('clearAllStudentsBtn');

    // --- DOM Elements for Attendance Recording ---
    const attendanceRecordingForm = document.getElementById('attendance-recording-form');
    const attendanceDateInput = document.getElementById('attendanceDate');
    const attendanceClassNameInput = document.getElementById('attendanceClassName');
    const attendanceInstructorNameInput = document.getElementById('attendanceInstructorName');
    const studentListForAttendance = document.getElementById('studentListForAttendance');
    const attendanceNotesInput = document.getElementById('attendanceNotes');
    const savedAttendanceList = document.getElementById('savedAttendanceList');

    // --- Local Storage Keys ---
    const STUDENTS_KEY = 'webDesignStudents';
    const ATTENDANCE_KEY = 'webDesignAttendance';

    // --- Helper Functions for Local Storage ---
    function getFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error(`Error parsing data from localStorage for key "${key}":`, e);
            return []; // Return empty array on error
        }
    }

    function saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving data to localStorage for key "${key}":`, e);
        }
    }

    // --- Student Management Functions ---

    function renderStudents() {
        const students = getFromLocalStorage(STUDENTS_KEY);
        savedStudentsList.innerHTML = ''; // Clear current list

        if (students.length === 0) {
            savedStudentsList.innerHTML = '<li>No students added yet.</li>';
            studentListForAttendance.innerHTML = '<p>Please add students in the "Student Roster Management" section above.</p>';
            return;
        }

        students.forEach((student, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${student.name} (<small>${student.class}</small>)</span>
                <button type="button" class="btn btn-danger btn-sm" data-index="${index}"><i class="fas fa-trash-alt"></i> Delete</button>
            `;
            savedStudentsList.appendChild(listItem);
        });

        // Attach event listeners for delete buttons
        savedStudentsList.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToDelete = parseInt(e.currentTarget.dataset.index);
                deleteStudent(indexToDelete);
            });
        });

        // Also update the attendance section student list
        renderStudentsForAttendance();
    }

    function addStudent(name, className) {
        const students = getFromLocalStorage(STUDENTS_KEY);
        // Simple unique ID for each student based on timestamp
        students.push({ id: Date.now(), name: name, class: className });
        saveToLocalStorage(STUDENTS_KEY, students);
        renderStudents(); // Re-render both student management and attendance lists
        newStudentNameInput.value = '';
        newStudentClassInput.value = '';
        alert('Student added successfully!');
    }

    function deleteStudent(index) {
        if (!confirm('Are you sure you want to delete this student?')) {
            return;
        }
        let students = getFromLocalStorage(STUDENTS_KEY);
        if (index >= 0 && index < students.length) {
            students.splice(index, 1);
            saveToLocalStorage(STUDENTS_KEY, students);
            renderStudents();
            alert('Student deleted.');
        }
    }

    function clearAllStudents() {
        if (confirm('Are you sure you want to delete ALL students? This cannot be undone.')) {
            localStorage.removeItem(STUDENTS_KEY);
            renderStudents();
            alert('All students cleared.');
        }
    }

    // --- Attendance Recording Functions ---

    function renderStudentsForAttendance() {
        const students = getFromLocalStorage(STUDENTS_KEY);
        studentListForAttendance.innerHTML = ''; // Clear current list

        if (students.length === 0) {
            studentListForAttendance.innerHTML = '<p>Please add students in the "Student Roster Management" section above.</p>';
            return;
        }

        students.forEach(student => {
            const studentItem = document.createElement('div');
            studentItem.classList.add('student-item-for-attendance'); // Use a specific class
            studentItem.innerHTML = `
                <label>${student.name} (<small>${student.class}</small>)</label>
                <select name="attendanceStatus_${student.id}" data-student-id="${student.id}" class="attendance-select" required>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused Absence</option>
                </select>
            `;
            studentListForAttendance.appendChild(studentItem);
        });
    }

    function renderAttendanceHistory() {
        const attendanceRecords = getFromLocalStorage(ATTENDANCE_KEY);
        savedAttendanceList.innerHTML = ''; // Clear current list

        if (attendanceRecords.length === 0) {
            savedAttendanceList.innerHTML = '<li>No attendance recorded yet.</li>';
            return;
        }

        // Sort by timestamp, newest first
        attendanceRecords.sort((a, b) => b.timestamp - a.timestamp);

        attendanceRecords.forEach((record, index) => {
            const listItem = document.createElement('li');
            const studentDetails = record.students.map(s => ` ${s.name}: ${s.status}`).join(', '); // Prepend space for readability
            listItem.innerHTML = `
                <div>
                    <span><strong>Date:</strong> ${record.date}</span><br>
                    <span><strong>Class:</strong> ${record.className}</span><br>
                    <span><strong>Instructor:</strong> ${record.instructorName}</span><br>
                    <span><strong>Students:</strong> ${studentDetails}</span>
                    ${record.notes ? `<p><em>Notes: ${record.notes}</em></p>` : ''}
                </div>
                <button type="button" class="btn btn-danger btn-sm" data-index="${index}"><i class="fas fa-trash-alt"></i> Delete</button>
            `;
            savedAttendanceList.appendChild(listItem);
        });

        // Attach event listeners for delete buttons on attendance records
        savedAttendanceList.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToDelete = parseInt(e.currentTarget.dataset.index);
                deleteAttendanceRecord(indexToDelete);
            });
        });
    }

    function deleteAttendanceRecord(index) {
        if (!confirm('Are you sure you want to delete this attendance record?')) {
            return;
        }
        let attendanceRecords = getFromLocalStorage(ATTENDANCE_KEY);
        if (index >= 0 && index < attendanceRecords.length) {
            // Because we sort for display, we need to delete from the original unsorted array or re-fetch and re-sort
            // Safest way is to remove by timestamp if indices change due to sorting/deletion
            const recordToDelete = attendanceRecords[index]; // This is the record at the *displayed* index
            // Find its actual index in the unsorted stored array
            let storedRecords = getFromLocalStorage(ATTENDANCE_KEY);
            const actualIndex = storedRecords.findIndex(r => r.timestamp === recordToDelete.timestamp);

            if (actualIndex > -1) {
                storedRecords.splice(actualIndex, 1);
                saveToLocalStorage(ATTENDANCE_KEY, storedRecords);
                renderAttendanceHistory(); // Re-render from the updated stored data
                alert('Attendance record deleted.');
            }
        }
    }


    // --- Event Listeners ---

    // Student Form Submission
    studentManagementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = newStudentNameInput.value.trim();
        const className = newStudentClassInput.value.trim();

        if (name && className) {
            addStudent(name, className);
        } else {
            alert('Please enter both student name and assigned class.');
        }
    });

    // Clear All Students Button
    clearAllStudentsBtn.addEventListener('click', clearAllStudents);

    // Attendance Form Submission
    attendanceRecordingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const date = attendanceDateInput.value;
        const className = attendanceClassNameInput.value.trim();
        const instructorName = attendanceInstructorNameInput.value.trim();
        const notes = attendanceNotesInput.value.trim();

        if (!date || !className || !instructorName) {
            alert('Please fill in Date, Class Name/Topic, and Instructor Name.');
            return;
        }

        const studentAttendance = [];
        const studentSelects = studentListForAttendance.querySelectorAll('.attendance-select'); // Select based on the new class
        const allStudents = getFromLocalStorage(STUDENTS_KEY); // Get full student details for name

        if (studentSelects.length === 0) {
             alert('No students to record attendance for. Please add students in the "Student Roster Management" section first.');
             return;
        }

        studentSelects.forEach(select => {
            const studentId = parseInt(select.dataset.studentId);
            const status = select.value;
            const student = allStudents.find(s => s.id === studentId); // Find student by ID to get their name

            if (student) {
                studentAttendance.push({
                    id: student.id,
                    name: student.name,
                    status: status
                });
            }
        });

        const attendanceRecord = {
            date,
            className,
            instructorName,
            students: studentAttendance,
            notes,
            timestamp: Date.now() // Unique ID and for sorting
        };

        const attendanceRecords = getFromLocalStorage(ATTENDANCE_KEY);
        attendanceRecords.push(attendanceRecord);
        saveToLocalStorage(ATTENDANCE_KEY, attendanceRecords);

        alert('Attendance saved successfully!');
        attendanceRecordingForm.reset(); // Clear the form
        attendanceDateInput.valueAsDate = new Date(); // Reset date to today
        renderAttendanceHistory(); // Update attendance history
        renderStudentsForAttendance(); // Ensure dropdowns are reset/reloaded if needed
    });


    // --- Initial Render on Page Load ---
    renderStudents(); // Populate student list on load
    renderAttendanceHistory(); // Populate attendance history on load
    // Set today's date as default for convenience
    attendanceDateInput.valueAsDate = new Date();
});

import React, { useEffect, useState } from "react"

import {
    Card,
    CardBody,
    Col,
    Row,
    CardTitle,
    FormGroup,
    Form,
    Label
} from "reactstrap"

import Select from "react-select"

import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
// import { addClass, updateClass } from './actions';

//Import Action to copy breadcrumb items from local state to redux state
import { addExam, fetchDifficulty, fetchQuestionPaper, setBreadcrumbItems } from "../../store/actions";
import { useSelector } from "react-redux";


import { useAuth } from "context/authContext";
import { fetchAllCoursesByClass } from "helpers/course_helper";
import { fetchAllSectionsByCourse } from "helpers/section_helper";
import { fetchAllSubSectionsBySection } from "helpers/subSection_helper";
import { createExam } from "helpers/question_helper";
import { result } from "lodash";
import Flatpickr from "react-flatpickr"
import { toast } from "react-toastify";
import { ExamTypes, createMainExamPaper } from "helpers/questionPaper_helper";
import { getAllMainExamPapers } from "helpers/center_helper";


const CreateExam = (props) => {
    document.title = "Exam Managment | Create Exam";

    const breadcrumbItems = [
        { title: "Exam Managment", link: "#" },
        { title: "Create Exam", link: "#" },
    ]

    useEffect(() => {
        const blurDiv = document.getElementById("blur");
        var width = window.innerWidth;
        if (width <= 994) {
            blurDiv.click()
        }
    }, [])
    useEffect(() => {
        props.setBreadcrumbItems('Create Exam', breadcrumbItems)
    })
    const [totalSets, setTotalSets] = useState("");
    const [shiftTimeFrom, setShiftTimeFrom] = useState([]);
    const [shiftTimeTo, setShiftTimeTo] = useState([]);
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [examDate, setExamDate] = useState(null);
    const [paper, setPaper] = useState(null);
    const [examType, setExamType] = useState("")
    const [totalShifts, setTotalShifts] = useState("");
    const [shiftData, setShiftData] = useState([]);
    // const [allExams, setAllExams] = useState([]);
    const allExams = useSelector(state => state.questionPapersReducer.questionPapers?.result)



    // const fetchAllExams = async () => {
    //     console.log("Call hua")
    //     try {
    //         const result = await getAllMainExamPapers();
    //         if (result?.success) {
    //             console.log(result)
    //             setAllExams(result?.result);
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     fetchAllExams();
    // }, []);


    useEffect(() => {
        if (!allExams) {
            dispatch(fetchQuestionPaper());
        }

    },);
    const [auth, setAuth] = useAuth();

    const dispatch = useDispatch();






    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paper || !totalSets || !examType || !shiftData || !totalShifts) {
            setSpanDisplay("inline")

        }
        else {
            let paperId = paper.id;
            let onlineExam = (examType.id === 1 || examType.id === 2) ? true : false;
            let offlineExam = (examType.id === 0 || examType.id === 2) ? true : false;

            // console.log((examType.id === 1))
            // console.log((examType.id === 0))
            console.log(paperId)
            console.log(totalSets)
            console.log("onlineExam ", onlineExam)
            console.log("offlineExam ", offlineExam)
            console.log(shiftData)
            try {
                const result = await createMainExamPaper({ paperId, totalSets, onlineExam, offlineExam, shiftData });
                if (result?.success) {
                    toast.success(result?.message);
                    setPaper(null);
                    setTotalSets("");
                    setExamType("");
                    setTotalShifts("");
                    setShiftData([]);
                }
                else {
                    toast.error(result?.message);
                }
            } catch (error) {
                console.log(error);
            }


            // dispatch(addExam({ examName, totalQuestions, totalMarks, classId, courseIds, sectionIds, subSectionIds, shortValues, mcqValues, tfValues, essayValues }));
        }
    };












    const handleDateChange = (date) => {
        setExamDate(date[0]); // Assuming single date selection
    };


    const handleSelectQuestionPaper = selectedOption => {
        setPaper(selectedOption);
    };

    const handleSelectExamType = selectedOption => {
        setExamType(selectedOption);
    };



    // Function to update shift data
    const handleShiftChange = (index, key, value) => {
        const updatedShifts = [...shiftData];
        updatedShifts[index] = {
            ...updatedShifts[index],
            [key]: value
        };
        setShiftData(updatedShifts);
    };

    // Function to handle input change for shift start and end times
    const handleTimeChange = (index, key, event) => {
        handleShiftChange(index, key, event.target.value);
    };


    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody className="col-xl-6 col-lg-10 col-md-10 col-sm-12 col-xs-12">
                            <CardTitle className="h4">Create Exam</CardTitle>
                            <form onSubmit={handleSubmit}>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Select Question Paper
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={paper}
                                            onChange={handleSelectQuestionPaper}
                                            options={allExams}
                                            getOptionLabel={option => option.examName}
                                            getOptionValue={option => option.id.toString()} // Convert to string if classId is a number
                                            classNamePrefix="select2-selection"
                                        />
                                        {!paper && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>


                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Total Sets
                                    </label>
                                    <div className="col-md-10">
                                        <input type="number"
                                            className='form-control'
                                            placeholder="Enter Total No. Sets"
                                            value={totalSets}
                                            onChange={(e) => setTotalSets(e.target.value)} />
                                        {!totalSets && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>


                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Exam Type
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={examType}
                                            onChange={handleSelectExamType}
                                            options={ExamTypes}
                                            getOptionLabel={option => option.name}
                                            getOptionValue={option => option.id.toString()} // Convert to string if classId is a number
                                            classNamePrefix="select2-selection"
                                        />
                                        {!examType && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Enter Total Shifts
                                    </label>
                                    <div className="col-md-10">
                                        <input type="number"
                                            className='form-control'
                                            placeholder="Enter Total Shifts"
                                            value={totalShifts}
                                            onChange={(e) => setTotalShifts(e.target.value)} />
                                        {!totalShifts && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>

                                {Array.from({ length: totalShifts }, (_, index) => (
                                    <Row key={index} className="mb-3">
                                        <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                            Shift {index + 1}
                                        </label>
                                        <div className="col-md-10">
                                            <Row className="mb-3">
                                                <label htmlFor="example-text-input" className="col-md-1 col-form-label">
                                                    From
                                                </label>
                                                <div className="col-md-5">
                                                    <input
                                                        className="form-control"
                                                        type="datetime-local"
                                                        value={shiftData[index]?.start || ''}
                                                        onChange={(e) => handleTimeChange(index, 'start', e)}
                                                    />
                                                    {!shiftData[index]?.start && (
                                                        <span style={{ color: "red", display: spanDisplay }}>This field is required</span>
                                                    )}
                                                </div>
                                                <label htmlFor="example-text-input" className="col-md-1 col-form-label">
                                                    To
                                                </label>
                                                <div className="col-md-5">
                                                    <input
                                                        className="form-control"
                                                        type="datetime-local"
                                                        value={shiftData[index]?.end || ''}
                                                        onChange={(e) => handleTimeChange(index, 'end', e)}
                                                    />
                                                    {!shiftData[index]?.end && (
                                                        <span style={{ color: "red", display: spanDisplay }}>This field is required</span>
                                                    )}
                                                </div>
                                            </Row>
                                        </div>
                                    </Row>
                                ))}
                                <Row className="mb-3">
                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-primary w-md">Submit</button>
                                    </div>
                                </Row>
                            </form>

                        </CardBody>
                    </Card>
                </Col>
            </Row>



        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(CreateExam);
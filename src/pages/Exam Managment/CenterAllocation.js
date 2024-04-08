import React, { useEffect, useState } from "react"

import { Row, Col, Card, CardBody, CardTitle, Button, } from "reactstrap"

import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
import Select from "react-select"

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";
import { addSchool } from "store/school/action";
import { useSelector } from "react-redux";
import schoolesReducer from '../../store/school/reducer';
import axios from "axios";
import { toast } from "react-toastify";
import { ExamCenters, SchoolTypes, fetchSchoolTypes } from "helpers/school_helper";
import { allocateRollNumberAndPassword, centerAllocations, getAllCenters, getAllMainExamPapers, totalStudentsCenterCapacityCount } from "helpers/center_helper";
import { fetchAllQuestionPapers } from "helpers/questionPaper_helper";
import { useAuth } from "context/authContext";


const CenteAllocation = (props) => {
    document.title = "Exam Managment | Center and Roll no. Allocation";



    const breadcrumbItems = [
        { title: "Exam Managment", link: "#" },
        { title: "Center and Roll no. Allocation", link: "#" },
    ]

    useEffect(() => {
        props.setBreadcrumbItems('Allocate of Center and Roll no.', breadcrumbItems)
    })

    const [schoolName, setSchoolName] = useState("");
    const [schoolCode, setSchoolCode] = useState("");
    const [center, setCenter] = useState({ id: 1, name: "Yes", value: true });
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [town, setTown] = useState("");
    const [administration, setAdministration] = useState("");
    const [zone, setZone] = useState("");
    const [woreda, setWoreda] = useState("");
    const [kebele, setKebele] = useState("");
    const [schoolType, setSchoolType] = useState("");
    const [sittingCapacity, setSittingCapacity] = useState("");
    const [schoolTypes, setSchoolTypes] = useState([]);
    const [papers, setPapers] = useState(null);
    const [exam, setExam] = useState(null);
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [allExams, setAllExams] = useState([]);
    const dispatch = useDispatch();


    const fetchAllExams = async () => {
        console.log("Call hua")
        try {
            const result = await getAllMainExamPapers();
            if (result?.success) {
                console.log(result)
                setAllExams(result?.result);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllExams();
    }, []);







    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!exam) {
            setSpanDisplay("inline")

        }
        else {
            const result1 = await totalStudentsCenterCapacityCount(exam.id);
            if (result1.centerCount > result1.studentCount) {
                const result2 = await centerAllocations();
                if (result2.success) {
                    toast.success(result2.message);
                } else {
                    toast.error(result2.message)
                }
                const result3 = await allocateRollNumberAndPassword(exam.id);
                if (result3.success) {
                    toast.success(result3.message);
                } else {
                    toast.error(result3.message)
                }
            } else {
                toast.error("Insufficient space in center!!! Please increase the capacity of the center");
            }
        }

    };
    const handleSelectCenter = selectedOption => {
        setCenter(selectedOption);
    };

    const handleSelectSchoolType = selectedOption => {
        setSchoolType(selectedOption)
    }

    const handleExamChange = selectedOption => {
        setExam(selectedOption)
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody style={{ width: "60%", }}>
                            <CardTitle className="h4">Allocate Center and Roll no.</CardTitle>
                            <form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Select Exam
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={exam}
                                            onChange={handleExamChange}
                                            options={allExams}
                                            getOptionLabel={option => option.examName}
                                            getOptionValue={option => option.id.toString()}
                                            classNamePrefix="select2-selection"
                                        />
                                        {!exam && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>




                                <Row className="mb-3">
                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-primary w-md">Allocate</button>
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

export default connect(null, { setBreadcrumbItems })(CenteAllocation);
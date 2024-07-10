import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, CardTitle, Button, CardText, CardHeader, CardFooter, } from "reactstrap"
import { Modal } from "react-bootstrap";
import { format } from 'date-fns';

import { connect } from "react-redux";

//Import Action to copy breadcrumb items from local state to redux state
import { fetchQuestionPaper, setBreadcrumbItems } from "../../store/actions";

import "../Tables/datatables.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import TimeAgo from "HelperComponent/TimeAgo";
import { useNavigate } from "react-router-dom";
import { assingExamToStudent, deleteQuestionPaper, updateMainExamPaper } from "helpers/questionPaper_helper";
import { toast } from "react-toastify";
import { deleteMainExamPaper, getAllMainExamPapers } from "helpers/center_helper";
import Loader from "components/Loader/Loader";
import { getStudentsForMapping } from "helpers/student_helper";
import { MDBDataTable } from "mdbreact";
import { MdAddTask } from "react-icons/md";
import { success } from "toastr";

const AllQuestionExams = (props) => {
    document.title = "Question Bank | All Questions";

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    const [selectedQuestionPaper, setSelectedQuestionPaper] = useState(null);
    const [allExams, setAllExams] = useState([]);
    const [loader, setLoader] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentModal, setStudentModal] = useState(false);
    const [page, setPage] = useState(1);
    const [examId, setExamId] = useState("");

    const breadcrumbItems = [
        { title: "Question Exams", link: "#" },
        { title: "All Questions Exams", link: "#" },
    ]
    useEffect(() => {
        const blurDiv = document.getElementById("blur");
        var width = window.innerWidth;
        if (width <= 994) {
            blurDiv.click()
        }
    }, [])

    useEffect(() => {
        props.setBreadcrumbItems('All Questions Exams', breadcrumbItems)
    })

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
    useEffect(() => {
        console.log("allexams", allExams);
    }, [allExams]);







    const handleCardClick = (data) => {
        navigate(`/exam-details/${data.id}`);
    };

    const handleDeleteClick = async (data) => {
        console.log(data)
        setSelectedQuestionPaper(data);
        setModalShow(true);

    }


    const handleRemove = async () => {

        setModalShow(false)

    }

    const deletePaper = async () => {
        let Id = selectedQuestionPaper.id;
        // console.log()
        setLoader(true);
        const result = await deleteMainExamPaper(Id);
        console.log(result);
        if (result?.success) {
            setLoader(false);
            setModalShow(false);
            toast.success(result.message);
            fetchAllExams();
        }
        else {
            setLoader(false);
            toast.error(result?.message);
        }
    }
    const isCurrentTimeBetween = (shifts) => {
        const currentTime = new Date();
        for (const shift of shifts) {
            const startTime = new Date(shift.start);
            const endTime = new Date(shift.end);
            if (currentTime >= startTime && currentTime <= endTime) {
                return true; // Return true as soon as condition is met
            }
        }
        return false; // Return false if no shift meets the condition
    };

    const handleStartExam = async (data) => {
        try {
            console.log(data);
            data.examStart = !data.examStart;
            setLoader(true)
            const result = await updateMainExamPaper(data)
            setLoader(false)
            if (result.success) {

                toast.success(data.examStart ? "Exam Start Successfully" : "Exam Stop Successfully");
                fetchAllExams();
            }
            else {
                toast.error(result.message);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
        }

    }

    const getStudents = async () => {
        try {
            setLoader(true);
            const data = await getStudentsForMapping();
            setLoader(false);
            setStudents(data.result);
            setStudentModal(true);
            if (data?.success) {
                setStudents(data.result);
                setStudentModal(true);

            }
        } catch (error) {
            setLoader(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }
    const handleMore = (data) => {
        setExamId(data.id)
        getStudents();
    }


    const data = {
        columns: [
            {
                label: "Serial No.",
                field: "serialNo",
                sort: "asc",
                width: 50,
            },
            {
                label: "Name",
                field: "name",
                sort: "asc",
                width: 100,
            },
            {
                label: "Email",
                field: "email",
                sort: "asc",
                width: 150,
            },
            {
                label: "Phone Number",
                field: "phoneNumber",
                sort: "asc",
                width: 200,
            },
            {
                label: "Actions",
                field: "actions",
                width: 100,
                btn: true,
            },
        ],
        rows: (students || []).map((row, index) => ({
            ...row,
            serialNo: index + 1,
            actions: (
                <div className="d-flex">
                    <i style={{ color: "green", fontSize: "1.5rem", cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            let studentIds = [row?.id];
                            assingExam(studentIds)

                        }}
                    >
                        <MdAddTask />
                    </i>
                    {/* Add more actions as needed */}
                </div>
            ),
            clickEvent: () => handleRowClick(row)
        }))
    };

    const assingExam = async (studentIds) => {
        try {
            console.log(examId, studentIds)
            setLoader(true);
            const data = await assingExamToStudent({ examId, studentIds });
            setLoader(false);
            if (data.success) {
                toast.success("Exam Assign Successfully");
                getStudents();
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }
    const handleRowClick = (row) => {


    }

    const handleAssingAll = () => {
        const studentIds = students.map((row, i) => row.id);
        assingExam(studentIds);
        console.log(studentIds);
    }
    return (
        <React.Fragment>
            {loader ? (
                <Loader />
            ) : ("")}


            <Row>
                {allExams?.map((data, i) => (
                    <>
                        <Col lg={4} key={i}>
                            <Card>
                                {/* <CardHeader>UPSC</CardHeader> */}
                                <CardBody className="mt-0 pt-0">
                                    <div className="d-flex justify-content-between">
                                        <CardTitle className="h4 mt-3">{data.examName}</CardTitle>
                                        <div className="d-flex">

                                            {/* <button type='button' className="text-primary" onClick={() => handleCardClick(data)} style={{ fontSize: "2rem", background: "none", border: "none", fontWeight: "bolder", }}> <i className="mdi mdi-book-edit-outline "></i></button> */}
                                            <button type='button' className="text-danger" onClick={() => handleDeleteClick(data)} style={{ fontSize: "2rem", background: "none", border: "none", fontWeight: "bolder", }}> <i className="mdi mdi-delete "></i></button>
                                        </div>
                                    </div>

                                    <CardText>
                                        Online: {data.onlineExam ? "yes" : "false"}
                                        <br />
                                        Offline: {data.offlineExam ? "yes" : "false"}
                                        <br />
                                        Total Shifts: {data.shiftData.length}
                                        <br />
                                        <br />
                                        {data.onlineExam}
                                        {/* {data.onlineExam ? isCurrentTimeBetween(data.shiftData) ? <Button type="button" color="primary" className="waves-effect waves-light">Start</Button> : "" : ""} */}
                                        {data.onlineExam ? <Button type="button" color="primary" className="waves-effect waves-lightme-2" onClick={() => handleStartExam(data)}>{data?.examStart ? "Stop" : "Start"}</Button> : ""}
                                        {/* {isCurrentTimeBetween(data.shiftData) ?(shift<button type='button' className="text-danger"  > start</button> : ""} */}

                                        <Button type="button" color="primary" className="waves-effect waves-light ms-3" onClick={() => handleMore(data)}>Assign Student</Button>
                                    </CardText>
                                </CardBody>

                            </Card>
                        </Col>
                    </>

                ))}

            </Row>


            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>

                    <h4>
                        Are you sure want to delete this question paper.
                    </h4>


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setModalShow(false)} className="waves-effect waves-light">No</Button>{" "}
                    <Button type="button" color="danger" onClick={deletePaper} className="waves-effect waves-light">Yes</Button>{" "}

                </Modal.Footer>
            </Modal>

            <Modal
                show={studentModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Students who have not any upcoming exam
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-end mb-3">
                        <Button type="button" color="success" onClick={handleAssingAll} className="waves-effect waves-light">Assign to All</Button>
                    </div>
                    <MDBDataTable
                        className="table-row-hover"
                        responsive
                        bordered
                        data={data}
                        style={{ cursor: 'pointer' }}
                        noBottomColumns
                        paging={{ page, onPageChange: setPage }}
                    />


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => { setStudentModal(false) }} className="waves-effect waves-light">Close</Button>{" "}

                </Modal.Footer>
            </Modal>


        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(AllQuestionExams);
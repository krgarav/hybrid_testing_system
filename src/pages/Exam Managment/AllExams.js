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
import { deleteQuestionPaper } from "helpers/questionPaper_helper";
import { toast } from "react-toastify";
import { deleteMainExamPaper, getAllMainExamPapers } from "helpers/center_helper";
import Loader from "components/Loader/Loader";

const AllQuestionExams = (props) => {
    document.title = "Question Bank | All Questions";

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    const [selectedQuestionPaper, setSelectedQuestionPaper] = useState(null);
    const [allExams, setAllExams] = useState([]);
    const [loader, setLoader] = useState(false);


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


    return (
        <React.Fragment>
            {loader ? (
                <Loader />
            ) : ("")}


            <Row>
                {allExams?.map((data, i) => (
                    <>
                        <Col lg={3} key={i}>
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
                                        {data.onlineExam ? isCurrentTimeBetween(data.shiftData) ? <Button type="button" color="primary" className="waves-effect waves-light">Start</Button> : "" : ""}
                                        {/* {isCurrentTimeBetween(data.shiftData) ?(shift<button type='button' className="text-danger"  > start</button> : ""} */}
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


        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(AllQuestionExams);
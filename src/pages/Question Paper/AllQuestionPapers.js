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

const AllQuestionPapers = (props) => {
    document.title = "Question Bank | All Questions";

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const questionPapers = useSelector(state => state.questionPapersReducer.questionPapers)
    const [modalShow, setModalShow] = useState(false);
    const [selectedQuestionPaper, setSelectedQuestionPaper] = useState(null);


    const breadcrumbItems = [
        { title: "Question Papers", link: "#" },
        { title: "All Questions Papers", link: "#" },
    ]

    useEffect(() => {
        props.setBreadcrumbItems('All Questions Papers', breadcrumbItems)
    })


    useEffect(() => {
        if (questionPapers?.length == 0) {
            dispatch(fetchQuestionPaper());
        }

    }, []);







    const handleCardClick = (data) => {
        navigate(`/exam-details/${data.id}`);
    };

    const handleDeleteClick = async (data) => {
        console.log(data)
        setSelectedQuestionPaper(data);
        setModalShow(true);

    }


    const handleRemove = async () => {

        // const result = await deleteQuestionPaper({ Id });
        setModalShow(false)
        // fetchQuestion();f

    }

    const deletePaper = async () => {
        let Id = selectedQuestionPaper.id;
        // console.log()
        const result = await deleteQuestionPaper(Id);
        console.log(result);
        if (result?.success) {
            setModalShow(false);
            toast.success(result.message);
            dispatch(fetchQuestionPaper());
        }
        else {
            toast.error(result?.message);
        }
    }


    return (
        <React.Fragment>
            <Row>
                {questionPapers?.result?.map((data, i) => (
                    <>
                        <Col lg={3} key={i}>
                            <Card>
                                {/* <CardHeader>UPSC</CardHeader> */}
                                <CardBody className="mt-0 pt-0">
                                    <div className="d-flex justify-content-between">
                                        <CardTitle className="h4 mt-3">{data.examName}</CardTitle>
                                        <div className="d-flex">

                                            <button type='button' className="text-primary" onClick={() => handleCardClick(data)} style={{ fontSize: "2rem", background: "none", border: "none", fontWeight: "bolder", }}> <i className="mdi mdi-book-edit-outline "></i></button>
                                            <button type='button' className="text-danger" onClick={() => handleDeleteClick(data)} style={{ fontSize: "2rem", background: "none", border: "none", fontWeight: "bolder", }}> <i className="mdi mdi-delete "></i></button>
                                        </div>
                                    </div>

                                    <CardText>
                                        Total Questions: {data.totalQuestions}
                                        <br />
                                        Total Marks: {data.totalMarks}
                                        <br />

                                    </CardText>
                                </CardBody>
                                <CardFooter className="text-muted">
                                    <TimeAgo receivedDate={data.entryAt} />
                                </CardFooter>
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

export default connect(null, { setBreadcrumbItems })(AllQuestionPapers);
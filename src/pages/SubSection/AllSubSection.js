import React, { useEffect, useState } from "react"
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, CardTitle, Button, } from "reactstrap"

import { connect } from "react-redux";
import Select from "react-select"

//Import Action to copy breadcrumb items from local state to redux state
import { deleteSubSection, fetchClass, fetchSection, fetchSubSection, setBreadcrumbItems, updateSubSection } from "../../store/actions";

import "../Tables/datatables.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import sectionsReducer from "store/section/reducer";
import classesReducer from "store/class/reducer";
import subSectionsReducer from "store/subSection/reducer";

const AllSubSections = (props) => {
    document.title = "Question Bank | All Sub Sections";
    const [modalShow, setModalShow] = useState(false);
    const [subSectionName, setSubSectionName] = useState("");
    const [subSectionDescription, setSubSectionDescription] = useState("");
    const [subSectionCode, setSubSectionCode] = useState("");
    const [id, setId] = useState({});
    const [classs, setClasss] = useState(null);
    const [section, setSection] = useState(null);
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const dispatch = useDispatch();
    const subSections = useSelector(state => state.subSectionsReducer)
    const sections = useSelector(state => state.sectionsReducer);


    const breadcrumbItems = [
        { title: "Sub Section", link: "#" },
        { title: "All Sub Sections", link: "#" },
    ]


    useEffect(() => {
        props.setBreadcrumbItems('All Sub Sections', breadcrumbItems)


    })


    useEffect(() => {
        if (sections?.sections.length == 0) {
            dispatch(fetchSection());
        }
        if (subSections?.subSections?.length == 0) {
            dispatch(fetchSubSection());
        }
    })


    const data = {
        columns: [
            {
                label: "Serial No.",
                field: "serialNo",
                sort: "asc",
                width: 50,
            },
            {
                label: "Code",
                field: "subSectionCode",
                sort: "asc",
                width: 100,
            },
            {
                label: "Name",
                field: "subSectionName",
                sort: "asc",
                width: 150,
            },
            {
                label: "Description",
                field: "subSectionDescription",
                sort: "asc",
                width: 200,
            },
        ],
        rows: subSections?.subSections?.result,
        rows: subSections?.subSections?.result?.map((row, index) => ({
            ...row,
            serialNo: index + 1, // Add 1 to start counting from 1
            clickEvent: () => handleRowClick(row)
        }))
    }

    const handleRowClick = (row) => {

        setModalShow(true);

        setId(row.id);
        setSubSectionName(row.subSectionName);
        setSubSectionDescription(row.subSectionDescription);
        setSubSectionCode(row.subSectionCode);

        sections?.sections?.result.map((r) => {
            if (r.id === row.sectionId) {
                console.log(r);
                setSection(r);
            }
        })
    }

    const handleUpdate = () => {
        let sectionId = section?.id;
        if (!subSectionName || !subSectionDescription || !subSectionCode || !sectionId) {
            setSpanDisplay("inline")

        }
        else {
            dispatch(updateSubSection({ id, sectionId, subSectionName, subSectionDescription }))
            setModalShow(false);
        }
    };

    const handleDelete = () => {
        setModalShow(false);
        setDeleteModalShow(false)
        dispatch(deleteSubSection(id));
    };

    const handleSelectClass = selectedOption => {
        setClasss(selectedOption);
        console.log(selectedOption);
    };

    const handleSelectSection = selectedOption => {
        setSection(selectedOption);
        console.log(selectedOption);
    };
    return (
        <React.Fragment>

            <Row>
                <Col className="col-12">
                    <Card>
                        <CardBody>
                            <CardTitle className="h4">All Sub Sections </CardTitle>
                            <MDBDataTable responsive bordered data={data} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Sub Section
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Section Name
                        </label>
                        <div className="col-md-10">
                            <Select

                                value={section}
                                onChange={handleSelectSection}
                                options={sections?.sections?.result}
                                getOptionLabel={option => option.sectionName + " (" + option.sectionCode + ")"}
                                getOptionValue={option => option.id.toString()} // Convert to string if classId is a number
                                classNamePrefix="select2-selection"
                            />
                            {!section && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>

                    </Row>

                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Sub Section
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter new Sub Section"
                                value={subSectionName}
                                onChange={(e) => setSubSectionName(e.target.value)} />
                            {!subSectionName && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>
                    </Row>
                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Sub Section Description
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter New Description"
                                value={subSectionDescription}
                                onChange={(e) => setSubSectionDescription(e.target.value)} />
                            {!subSectionDescription && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>
                    </Row>

                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Sub Section Code
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Sub Section Code"
                                value={subSectionCode}
                                // onChange={(e) => setSubSectionCode(e.target.value)} 
                                readOnly />
                        </div>
                    </Row>




                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setModalShow(false)} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleUpdate} className="waves-effect waves-light">Update</Button>{" "}
                    <Button type="button" color="danger" onClick={() => { setDeleteModalShow(true); setModalShow(false) }} className="waves-effect waves-light">Delete</Button>{" "}
                </Modal.Footer>
            </Modal>
            <Modal
                show={deleteModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>

                    <h4>
                        Are you sure want to remove this sub section.
                    </h4>


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => { setDeleteModalShow(false); setModalShow(true) }} className="waves-effect waves-light">No</Button>{" "}
                    <Button type="button" color="danger" onClick={handleDelete} className="waves-effect waves-light">Yes</Button>{" "}

                </Modal.Footer>
            </Modal>

        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(AllSubSections);
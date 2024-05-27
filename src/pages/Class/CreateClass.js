import React, { useEffect, useState } from "react"

import {
    Card,
    CardBody,
    Col,
    Row,
    CardTitle,
    FormGroup,
    Form
} from "reactstrap"

import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
// import { addClass, updateClass } from './actions';

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";
import { addClass, setSuccessFalseClass } from "store/class/action";
import { useSelector } from "react-redux";
import classesReducer from '../../store/class/reducer';
import axios from "axios";
import { toast } from "react-toastify";
import { success } from "toastr";


const CreateClass = (props) => {
    document.title = "Question Bank | Create Class";



    const breadcrumbItems = [
        { title: "Class", link: "#" },
        { title: "Create Class", link: "#" },
    ]
    useEffect(() => {
        const blurDiv = document.getElementById("blur");
        var width = window.innerWidth;
        if (width <= 994) {
            blurDiv.click()
        }
    }, [])
    useEffect(() => {
        props.setBreadcrumbItems('Create Class', breadcrumbItems)
    })

    const [toggleSwitch, settoggleSwitch] = useState(true)
    const [toggleSwitchSize, settoggleSwitchSize] = useState(true)
    // const [className, setClassName] = useState("");
    const [className, setClassName] = useState("");
    const [classDescription, setClassDescription] = useState("");
    const [classCode, setClassCode] = useState("");
    const [spanDisplay, setSpanDisplay] = useState("none");
    const dispatch = useDispatch();
    const result = useSelector(state => state.classesReducer)

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(!className)
        if (!className || !classDescription || !classCode) {
            setSpanDisplay("inline")

        }
        else {
            dispatch(addClass({ className, classDescription, classCode }));
        }
    };


    useEffect(() => {
        if (result.success == true) {
            setClassCode("");
            setClassName("");
            setClassDescription("");
            dispatch(setSuccessFalseClass());
        }
    }, [result.success]);



    const checkResult = () => {

    }

    return (
        <React.Fragment>
            <Row >
                <Col>
                    <Card>
                        <CardBody className="col-lg-10 col-sm-12 col-xs-12">
                            <CardTitle className="h4">Create Class</CardTitle>
                            <form onSubmit={handleSubmit}>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Class Name
                                    </label>
                                    <div className="col-md-10">
                                        <input type="text"
                                            className='form-control'
                                            placeholder="Enter new Class"
                                            value={className}
                                            onChange={(e) => setClassName(e.target.value)} />

                                        {!className && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Class Description
                                    </label>
                                    <div className="col-md-10">
                                        <input type="text"
                                            className='form-control'
                                            placeholder="Enter New Description"
                                            value={classDescription}
                                            onChange={(e) => setClassDescription(e.target.value)} />
                                        {!classDescription && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Class Code
                                    </label>
                                    <div className="col-md-10">
                                        <input type="text"
                                            className='form-control'
                                            placeholder="Enter Class Code"
                                            value={classCode}
                                            onChange={(e) => setClassCode(e.target.value)} />
                                        {!classCode && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>

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

export default connect(null, { setBreadcrumbItems })(CreateClass);
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

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";
import { addDifficulty } from "store/difficulty/action";


const CreateDifficulty = (props) => {
    document.title = "Question Bank | Create Difficulty";



    const breadcrumbItems = [
        { title: "Difficulty", link: "#" },
        { title: "Create Difficulty", link: "#" },
    ]

    useEffect(() => {
        props.setBreadcrumbItems('Create Difficulty', breadcrumbItems)
    })

    const [difficultyName, setDifficultyName] = useState("");
    const [spanDisplay, setSpanDisplay] = useState("none");
    const dispatch = useDispatch();





    const handleSubmit = (e) => {
        e.preventDefault();
        if (!difficultyName) {
            setSpanDisplay("inline")

        }
        else {
            dispatch(addDifficulty({ difficultyName }));
        }

    };




    const checkResult = () => {

    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody className="col-lg-6 col-sm-12 col-xs-12">
                            <CardTitle className="h4">Create Difficulty</CardTitle>
                            <form onSubmit={handleSubmit}>


                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Difficulty Name
                                    </label>
                                    <div className="col-md-10">
                                        <input type="text"
                                            className='form-control'
                                            placeholder="Enter new Difficulty"
                                            value={difficultyName}
                                            onChange={(e) => setDifficultyName(e.target.value)} />
                                        {!difficultyName && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
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

export default connect(null, { setBreadcrumbItems })(CreateDifficulty);
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
import { addQuestionPaper, fetchDifficulty, setBreadcrumbItems } from "../../store/actions";
import { addClass, fetchClass } from "store/class/action";
import { useSelector } from "react-redux";
import classesReducer from '../../store/class/reducer';
// import { addQuestionPaper } from "store/questionPaper/action";
import { HtmlEditor, Image, Inject, Link, NodeSelection, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';


import { Editor } from 'primereact/editor';
import { useAuth } from "context/authContext";
import { fetchAllCoursesByClass } from "helpers/course_helper";
import { fetchAllSectionsByCourse } from "helpers/section_helper";
import { fetchAllSubSectionsBySection } from "helpers/subSection_helper";
import { createQuestionPaper } from "helpers/question_helper";
import { result } from "lodash";
import Flatpickr from "react-flatpickr"
import { toast } from "react-toastify";


const CreateQuestionPaper = (props) => {
    document.title = "QuestionPaper Bank | Create Question  Paper";



    const breadcrumbItems = [
        { title: "Question Paper", link: "#" },
        { title: "Create Question Paper", link: "#" },
    ]

    useEffect(() => {
        props.setBreadcrumbItems('Create QuestionPaper', breadcrumbItems)
    })

    const [classs, setClasss] = useState(null);
    const [selectedclasss, setSelectedClasss] = useState(null);
    const [selectedClassIds, setSelectedClassIds] = useState(null);
    const [selectedCourseIds, setSelectedCourseIds] = useState(null);
    const [selectedSectionIds, setSelectedSectionIds] = useState(null);
    const [selectedSubSectionIds, setSelectedSubSectionIds] = useState(null);
    const [selectedDifficultys, setSelectedDifficultys] = useState(null);
    const [course, setCourse] = useState(null);
    const [section, setSection] = useState(null);
    const [subSection, setSubSection] = useState(null);
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subSections, setSubSections] = useState([]);
    const [examName, setExamName] = useState("");
    const [totalSets, setTotalSets] = useState("");
    const [totalQuestions, setTotalQuestions] = useState("");
    const [totalMarks, setTotalMarks] = useState("");
    const [totalTime, setTotalTime] = useState("");
    const [mcqValue, setMcqValue] = useState("");
    const [tfValue, setTfValue] = useState("");
    const [shortValue, setShortValue] = useState("");
    const [essayValue, setEssayValue] = useState("");
    const [mcqDisplay, setMcqDisplay] = useState("none");
    const [shortDisplay, setShortDisplay] = useState("none");
    const [tfDisplay, setTfDisplay] = useState("none");
    const [essayDisplay, setEssayDisplay] = useState("none");
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [shortValues, setShortValues] = useState({});
    const [mcqValues, setMcqValues] = useState({});
    const [tfValues, setTfValues] = useState({});
    const [essayValues, setEssayValues] = useState({});
    const [examDate, setExamDate] = useState(null);


    useEffect(() => {
        console.log(examDate);
    }, [examDate])


    const [auth, setAuth] = useAuth();

    const dispatch = useDispatch();
    const classes = useSelector(state => state.classesReducer)
    const difficultys = useSelector(state => state.difficultysReducer)

    useEffect(() => {
        if (classes?.classes.length == 0) {
            dispatch(fetchClass());
        }

    })
    useEffect(() => {
        if (difficultys?.difficultys.length == 0) {
            dispatch(fetchDifficulty());
        }

    })
    const fetchCourses = async () => {
        if (classs) {
            let id = classs.id;

            let result = await fetchAllCoursesByClass(id);
            setCourses(result);
        }
    }
    useEffect(() => {
        fetchCourses();
    }, [classs]);

    const fetchSections = async () => {
        if (course) {
            let id = course.id;
            let a = [];
            course.map(d => {
                a.push(d.id);
            })

            let result = await fetchAllSectionsByCourse(a);
            setSections(result);
        }
    }
    useEffect(() => {
        fetchSections();
    }, [course]);

    const fetchSubSections = async () => {
        if (section) {
            // let id = section.id;
            let a = [];
            section.map(d => {
                a.push(d.id);
            })

            let result = await fetchAllSubSectionsBySection(a);
            setSubSections(result);
        }
    }
    useEffect(() => {
        fetchSubSections();
    }, [section]);


    useEffect(() => {
        if (mcqValue > 0) {
            setMcqDisplay("block");
        }
        else {
            setMcqDisplay("none");
        }
        if (tfValue > 0) {
            setTfDisplay("block");
        }
        else {
            setTfDisplay("none");
        }
        if (shortValue > 0) {
            setShortDisplay("block");
        }
        else {
            setShortDisplay("none");
        }
        if (essayValue > 0) {
            setEssayDisplay("block");
        }
        else {
            setEssayDisplay("none");
        }
    }, [mcqValue, tfValue, shortValue]);





    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!examName || !totalQuestions || !totalMarks || !classs || !courses || !sections || !subSections || !shortValues || !mcqValues || !tfValues || !essayValues) {
            setSpanDisplay("inline")

        }
        else {

            if (Number(totalQuestions) !== Number(mcqValue) + Number(shortValue) + Number(tfValue) + Number(essayValue)) {

                toast.error("Total Questions and the count of types of question are not match")
            }
            else if (Number(mcqValue) !== calculateTotal(mcqValues)) {
                toast.error("count of mcq questions and the difficulties count are not match")
            }
            else if (Number(shortValue) !== calculateTotal(shortValues)) {
                toast.error("count of short questions and the difficulties count are not match")
            }
            else if (Number(tfValue) !== calculateTotal(tfValues)) {
                toast.error("count of true/false questions and the difficulties count are not match")
            }
            else if (Number(essayValue) !== calculateTotal(essayValues)) {
                toast.error("count of essay questions and the difficulties count are not match")
            }
            else {



                // dispatch(createQuestionPaper(formData));
                let classId = classs.id
                // let courseIds = course;
                // let sectionIds = sections;
                // let subSectionIds = subSections;
                let courseIds = [];
                course.forEach((course) => {
                    courseIds.push(course.id)
                })
                let sectionIds = [];
                section.forEach((section) => {
                    sectionIds.push(section.id)
                })
                let subSectionIds = [];
                subSection.forEach((subSection) => {
                    subSectionIds.push(subSection.id);
                })
                console.log(totalQuestions)
                console.log(Number(mcqValue) + Number(shortValue) + Number(tfValue) + Number(essayValue))
                console.log(calculateTotal(mcqValues))
                // let result = await createQuestionPaper({ examName, totalQuestions, totalMarks, totalTime, classId, courseIds, sectionIds, subSectionIds, shortValues, mcqValues, tfValues, essayValues });
                dispatch(addQuestionPaper({ examName, totalQuestions, totalMarks, classs, course, section, subSection, classId, courseIds, sectionIds, subSectionIds, shortValues, mcqValues, tfValues, essayValues }));
            }
        }
    };

    const calculateTotal = (obj) => {
        let total = 0;
        // Iterate through object values
        for (const value of Object.values(obj)) {
            // Convert string to number and add to total
            total += parseInt(value, 10);
        }
        return total;
    };


    const handleSelectClass = selectedOption => {
        setClasss(selectedOption);
        setCourses([]);
        setSections([]);
        setCourse(null);
        setSection(null);
    };

    // function handleSelectCourse(selectedMulti) {
    //     setCourse(selectedMulti)
    //   }
    const handleSelectCourse = selectedOption => {
        setCourse(selectedOption);
        setSections([]);
        setSubSections([]);
        setSection(null);
        setSubSection(null);
    };

    const handleSelectSection = selectedOption => {
        setSection(selectedOption);
        setSubSections([]);
        setSubSection(null);
    };
    const handleSelectSubSection = selectedOption => {
        setSubSection(selectedOption);
    };
    const handleSelectDifficulty = selectedOption => {
        setSelectedDifficultys(selectedOption);
    };


    const handleShortTypeChange = (e, d) => {
        const { id } = d;
        const updatedInputValues = { ...shortValues, [id]: e.target.value };
        setShortValues(updatedInputValues);
    };
    const handleMcqTypeChange = (e, d) => {
        const { id } = d;
        const updatedInputValues = { ...mcqValues, [id]: e.target.value };
        setMcqValues(updatedInputValues);
    };
    const handleTfTypeChange = (e, d) => {
        const { id } = d;
        const updatedInputValues = { ...tfValues, [id]: e.target.value };
        setTfValues(updatedInputValues);
    };
    const handleEssayTypeChange = (e, d) => {
        const { id } = d;
        const updatedInputValues = { ...essayValues, [id]: e.target.value };
        setEssayValues(updatedInputValues);
    };

    const handleDateChange = (date) => {
        setExamDate(date[0]); // Assuming single date selection
    };








    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody style={{ width: "60%", }}>
                            <CardTitle className="h4">Create QuestionPaper</CardTitle>
                            <form onSubmit={handleSubmit}>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Question Paper Name
                                    </label>
                                    <div className="col-md-10">
                                        <input type="text"
                                            className='form-control'
                                            placeholder="Enter Name"
                                            value={examName}
                                            onChange={(e) => setExamName(e.target.value)} />
                                        {!examName && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>


                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Total No. of Question
                                    </label>
                                    <div className="col-md-10">
                                        <input type="number"
                                            className='form-control'
                                            placeholder="Enter Total No. of Questions"
                                            value={totalQuestions}
                                            onChange={(e) => setTotalQuestions(e.target.value)} />
                                        {!totalQuestions && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Total Marks
                                    </label>
                                    <div className="col-md-10">
                                        <input type="number"
                                            className='form-control'
                                            placeholder="Enter Total Marks"
                                            value={totalMarks}
                                            onChange={(e) => setTotalMarks(e.target.value)} />
                                        {!totalMarks && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>


                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Class Name
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={classs}
                                            onChange={handleSelectClass}
                                            options={classes?.classes?.result}
                                            getOptionLabel={option => option.className + " (" + option.classCode + ")"}
                                            getOptionValue={option => option.id.toString()} // Convert to string if classId is a number
                                            classNamePrefix="select2-selection"
                                        />
                                        {!classs && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>

                                </Row>

                                {courses && <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Course Name
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={course}
                                            isMulti={true}
                                            onChange={handleSelectCourse}
                                            options={courses?.result}
                                            getOptionLabel={option => option.courseName + " (" + option.courseCode + ")"}
                                            getOptionValue={option => option.id.toString()} // Convert to string if classId is a number
                                            classNamePrefix="select2-selection"
                                        />
                                        {!course && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}

                                    </div>

                                </Row>}

                                {sections && <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Section Name
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={section}
                                            isMulti={true}
                                            onChange={handleSelectSection}
                                            options={sections?.result}
                                            getOptionLabel={option => option.sectionName + " (" + option.sectionCode + ")"}
                                            getOptionValue={option => option.id.toString()}
                                            classNamePrefix="select2-selection"
                                        />
                                        {!section && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>

                                </Row>}

                                {subSections && <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Sub Section Name
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={subSection}
                                            isMulti={true}
                                            onChange={handleSelectSubSection}
                                            options={subSections?.result}
                                            getOptionLabel={option => option.subSectionName + " (" + option.subSectionCode + ")"}
                                            getOptionValue={option => option.id.toString()}
                                            classNamePrefix="select2-selection"
                                        />
                                        {!subSection && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>

                                </Row>}
                                {difficultys && <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Difficulties
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={selectedDifficultys}
                                            isMulti={true}
                                            onChange={handleSelectDifficulty}
                                            options={difficultys?.difficultys?.result}
                                            getOptionLabel={option => option.difficultyName}
                                            getOptionValue={option => option.id.toString()}
                                            classNamePrefix="select2-selection"
                                        />
                                        {!selectedDifficultys && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>

                                </Row>}



                                <Row className="mb-3">
                                    <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                        Type of Questions
                                    </label>
                                    <div className="col-md-10">
                                        <div className="mb-5">
                                            <div className="form-check form-inline d-block mb-2 p-0">
                                                <label className="form-check-label d-inline" htmlFor="exampleRadios2">
                                                    Short
                                                </label>
                                                <input
                                                    className="form-control d-inline ms-3"
                                                    type="number"
                                                    name="type"
                                                    value={shortValue}
                                                    onChange={(e) => setShortValue(e.target.value)}
                                                    style={{ width: "4rem" }}
                                                />

                                            </div>
                                            <div className="col-md-4" style={{ display: `${shortDisplay}` }}>
                                                {/* <label className=" ">Defficulty Level</label> */}
                                                <div className="d-flex  align-items-center">
                                                    {selectedDifficultys?.map((d, i) => (

                                                        <div className="me-1">
                                                            <label className=" ">{d.difficultyName} </label>
                                                            <input type="number" className='form-control' style={{ width: "4rem" }} onChange={(e) => handleShortTypeChange(e, d)} />
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <div className="form-check form-inline d-block mb-2 p-0">
                                                <label className="form-check-label d-inline" htmlFor="exampleRadios2">
                                                    Mcq
                                                </label>
                                                <input
                                                    className="form-control d-inline ms-3"
                                                    type="number"
                                                    name="type"
                                                    value={mcqValue}
                                                    onChange={(e) => setMcqValue(e.target.value)}
                                                    style={{ width: "4rem" }}
                                                />

                                            </div>
                                            <div className="col-md-4 " style={{ display: `${mcqDisplay}` }}>
                                                {/* <label className=" ">Defficulty Level</label> */}
                                                <div className="d-flex  align-items-center">
                                                    {selectedDifficultys?.map((d, i) => (

                                                        <div className="me-1">
                                                            <label className=" ">{d.difficultyName} </label>
                                                            <input type="number" className='form-control' style={{ width: "4rem" }} onChange={(e) => handleMcqTypeChange(e, d)} />
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <div className="form-check form-inline d-block mb-2 p-0">
                                                <label className="form-check-label d-inline" htmlFor="exampleRadios2">
                                                    True False
                                                </label>
                                                <input
                                                    className="form-control d-inline ms-3"
                                                    type="number"
                                                    name="type"
                                                    value={tfValue}
                                                    onChange={(e) => setTfValue(e.target.value)}
                                                    style={{ width: "4rem" }}
                                                />

                                            </div>
                                            <div className="col-md-4 " style={{ display: `${tfDisplay}` }}>
                                                {/* <label className=" ">Defficulty Level</label> */}
                                                <div className="d-flex  align-items-center">
                                                    {selectedDifficultys?.map((d, i) => (

                                                        <div className="me-1">
                                                            <label className=" ">{d.difficultyName} </label>
                                                            <input type="number" className='form-control' style={{ width: "4rem" }} onChange={(e) => handleTfTypeChange(e, d)} />
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <div className="form-check form-inline d-block mb-2 p-0">
                                                <label className="form-check-label d-inline" htmlFor="exampleRadios2">
                                                    Essay
                                                </label>
                                                <input
                                                    className="form-control d-inline ms-3"
                                                    type="number"
                                                    name="type"
                                                    value={essayValue}
                                                    onChange={(e) => setEssayValue(e.target.value)}
                                                    style={{ width: "4rem" }}
                                                />

                                            </div>
                                            <div className="col-md-4 " style={{ display: `${essayDisplay}` }}>
                                                {/* <label className=" ">Defficulty Level</label> */}
                                                <div className="d-flex  align-items-center">
                                                    {selectedDifficultys?.map((d, i) => (

                                                        <div className="me-1">
                                                            <label className=" ">{d.difficultyName} </label>
                                                            <input type="number" className='form-control' style={{ width: "4rem" }} onChange={(e) => handleEssayTypeChange(e, d)} />
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                        </div>




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

export default connect(null, { setBreadcrumbItems })(CreateQuestionPaper);
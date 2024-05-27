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
import { fetchDifficulty, fetchLanguage, setBreadcrumbItems } from "../../store/actions";
import { addClass, fetchClass } from "store/class/action";
import { useSelector } from "react-redux";


import { Editor } from 'primereact/editor';
import { useAuth } from "context/authContext";
import { fetchAllCoursesByClass } from "helpers/course_helper";
import { fetchAllSectionsByCourse } from "helpers/section_helper";
import { fetchAllSubSectionsBySection } from "helpers/subSection_helper";
import { bulkCreateQuestion } from "helpers/question_helper";
import { toast } from "react-toastify";


const CreateQuestion = (props) => {
    document.title = "Question Bank | Create Question";



    const breadcrumbItems = [
        { title: "Question", link: "#" },
        { title: "Create Question", link: "#" },
    ]

    useEffect(() => {
        props.setBreadcrumbItems('Create Question', breadcrumbItems)
    })

    const [toggleSwitch, settoggleSwitch] = useState(true)
    const [toggleSwitchSize, settoggleSwitchSize] = useState(true)
    const [classs, setClasss] = useState(null);
    const [selectedclasss, setSelectedClasss] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [course, setCourse] = useState(null);
    const [section, setSection] = useState(null);
    const [subSection, setSubSection] = useState(null);
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subSections, setSubSections] = useState([]);
    const [answer, setAnswer] = useState("");
    const [text, setText] = useState("");
    const [option, setOption] = useState("");
    const [options, setOptions] = useState([]);
    const [file, setFile] = useState(null);
    const [editOptionText, setEditOptionText] = useState("Edit Options");
    const [optionsEditDisplay, setOptionsEditDisplay] = useState("none");
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [auth, setAuth] = useAuth();
    const [language, setLanguage] = useState(null);
    const [difficulty, setDifficulty] = useState(null);

    const dispatch = useDispatch();
    const classes = useSelector(state => state.classesReducer)
    const difficultys = useSelector(state => state.difficultysReducer)
    const languages = useSelector(state => state.languagesReducer);
    const result = useSelector(state => state.questionsReducer);

    useEffect(() => {
        const blurDiv = document.getElementById("blur");
        var width = window.innerWidth;
        if (width <= 994) {
            blurDiv.click()
        }
    }, [])
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
    useEffect(() => {
        if (languages?.languages.length == 0) {
            dispatch(fetchLanguage());
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

            let result = await fetchAllSectionsByCourse([id]);
            setSections(result);
        }
    }
    useEffect(() => {
        fetchSections();
    }, [course]);

    const fetchSubSections = async () => {
        if (section) {
            let id = section.id;

            let result = await fetchAllSubSectionsBySection([id]);
            setSubSections(result);
        }
    }
    useEffect(() => {
        fetchSubSections();
    }, [section]);






    const handleFileUpload = async (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!classs || !course || !section || !subSection || !file || !difficulty || !language || !type) {
            setSpanDisplay("inline")

        }
        else {

            const formData = new FormData();

            formData.append('File', file);
            formData.append('ClassId', classs.id);
            formData.append('Class', JSON.stringify(classs))
            formData.append('CourseId', course.id);
            formData.append('Course', JSON.stringify(course));
            formData.append('SectionId', section.id);
            formData.append('Section', JSON.stringify(section));
            formData.append('SubSectionId', subSection.id);
            formData.append('SubSection', JSON.stringify(subSection));
            formData.append('DifficultyId', difficulty.id);
            formData.append('languageId', language.id);
            formData.append('Difficulty', JSON.stringify(difficulty));
            formData.append('Type', type);
            const result = await bulkCreateQuestion(formData);
            if (result?.success === true) {
                setFile(null);
                setClasss(null);
                setCourse(null);
                setSection(null);
                setSubSection(null);
                setDifficulty(null);
                setLanguage(null);
                setType("short");
                setAnswer("")
                toast.success(result?.message);
            }
            else {
                toast.error(result?.message);
            }
        }

    };




    const handleSelectClass = selectedOption => {
        setClasss(selectedOption);
        setCourses([]);
        setSections([]);
        setCourse(null);
        setSection(null);
        setSubSections([]);
        setSubSection(null);
    };

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
        setDifficulty(selectedOption);
    };

    const handleSelectLanguage = selectedOption => {
        setLanguage(selectedOption);
    };


    const checkResult = () => {

    }


    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };

    const [type, setType] = useState('short');
    const handleTypeChange = (event) => {
        setType(event.target.value);
        setAnswer("");
    };
    const addOption = () => {
        setOptions([...options, option]);
        setOption("");
    }
    const handleSetOptionsClick = () => {
        if (optionsEditDisplay == "none") {
            setOptionsEditDisplay("inline-block");
            setEditOptionText("Done");
        }
        else {
            setOptionsEditDisplay("none");
            setEditOptionText("Edit Options");
        }
    }
    const removeOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };


    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody className="col-xl-6 col-lg-10 col-md-10 col-sm-12 col-xs-12">
                            <CardTitle className="h4">Create Question</CardTitle>
                            <form onSubmit={handleSubmit}>

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
                                        Difficulty Name
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={difficulty}
                                            onChange={handleSelectDifficulty}
                                            options={difficultys?.difficultys?.result}
                                            getOptionLabel={option => option.difficultyName}
                                            getOptionValue={option => option.id.toString()}
                                            classNamePrefix="select2-selection"
                                        />
                                        {!difficulty && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>

                                </Row>}

                                {languages && <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Language Name
                                    </label>
                                    <div className="col-md-10">
                                        <Select

                                            value={language}
                                            onChange={handleSelectLanguage}
                                            options={languages?.languages?.result}
                                            getOptionLabel={option => option.languageName}
                                            getOptionValue={option => option.id.toString()}
                                            classNamePrefix="select2-selection"
                                        />
                                        {!language && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>

                                </Row>}

                                <Row className="mb-3">
                                    <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                        Question Type
                                    </label>
                                    <div className="col-md-10">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="type"
                                                id="type2"
                                                value="short"
                                                checked={type === 'short'}
                                                onChange={handleTypeChange}
                                            />
                                            <label className="form-check-label" htmlFor="exampleRadios2">
                                                Short
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline mb-3">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="type"
                                                id="type1"
                                                value="mcq"
                                                checked={type === 'mcq'}
                                                onChange={handleTypeChange}
                                            />
                                            <label className="form-check-label" htmlFor="exampleRadios1">
                                                MCQ
                                            </label>
                                        </div>

                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="type"
                                                id="type3"
                                                value="true false"
                                                checked={type === 'true false'}
                                                onChange={handleTypeChange}
                                            />
                                            <label className="form-check-label" htmlFor="exampleRadios2">
                                                True False
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="type"
                                                id="type4"
                                                value="essay"
                                                checked={type === 'essay'}
                                                onChange={handleTypeChange}
                                            />
                                            <label className="form-check-label" htmlFor="exampleRadios2">
                                                Essay
                                            </label>
                                        </div>
                                    </div>
                                </Row>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Questions file
                                    </label>
                                    <div className="col-md-10">
                                        <div className="card">
                                            <input type="file" accept='.xlsx' name='xlsxFile' id='xlsxFile' placeholder='Upload a File' className="form-control form-control-file" data-buttonname="btn-secondary" onChange={handleFileUpload} />
                                        </div>
                                        {!file && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
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

export default connect(null, { setBreadcrumbItems })(CreateQuestion);
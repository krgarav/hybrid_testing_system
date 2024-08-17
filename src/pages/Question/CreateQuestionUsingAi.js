import React, { useEffect, useState } from "react"

import {
    Card,
    CardBody,
    Col,
    Row,
    CardTitle,
    FormGroup,
    Form,
    Label,
    Button
} from "reactstrap"
import { Modal } from "react-bootstrap";
import Select from "react-select"

import { connect } from "react-redux";
import { useDispatch } from 'react-redux';
// import { addClass, updateClass } from './actions';

//Import Action to copy breadcrumb items from local state to redux state
import { fetchDifficulty, fetchLanguage, setBreadcrumbItems } from "../../store/actions";
import { addClass, fetchClass } from "store/class/action";
import { useSelector } from "react-redux";
import { addQuestion, setSuccessFalseQuestion } from "store/question/action";
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';


import { Editor } from 'primereact/editor';
import { useAuth } from "context/authContext";
import { fetchAllCoursesByClass } from "helpers/course_helper";
import { fetchAllSectionsByCourse } from "helpers/section_helper";
import { fetchAllSubSectionsBySection } from "helpers/subSection_helper";
import { useWindowSize } from 'react-use';
import Loader from "components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MDBDataTable } from "mdbreact";
import { MdAddTask } from "react-icons/md";


const CreateQuestionUsingAi = (props) => {

    const { width } = useWindowSize();
    document.title = "Question Bank | Genrate Question Using Ai";



    const breadcrumbItems = [
        { title: "Question", link: "#" },
        { title: "Genrate Question Using Ai", link: "#" },
    ]

    useEffect(() => {
        props.setBreadcrumbItems('Genrate Question Using Ai', breadcrumbItems)
    })

    const [classs, setClasss] = useState(null);
    const [type, setType] = useState('short');
    const [course, setCourse] = useState(null);
    const [section, setSection] = useState(null);
    const [subSection, setSubSection] = useState(null);
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subSections, setSubSections] = useState([]);
    const [difficulty, setDifficulty] = useState(null);
    const [language, setLanguage] = useState(null);
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [auth, setAuth] = useAuth();
    const [loader, setLoader] = useState(false);
    const [another, setAnother] = useState(false);
    const [aiQuestions, setAiQuestions] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [secondModalShow, setSecondModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [answer, setAnswer] = useState("");
    const [option, setOption] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const classes = useSelector(state => state.classesReducer)
    const difficultys = useSelector(state => state.difficultysReducer)
    const languages = useSelector(state => state.languagesReducer);
    const result = useSelector(state => state.questionsReducer);
    const [editOptionText, setEditOptionText] = useState("Edit Options");
    const [optionsEditDisplay, setOptionsEditDisplay] = useState("none");
    const [options, setOptions] = useState([]);
    const [fromTable, setFromTable] = useState("")
    const [rowIndex, setRowIndex] = useState(0);

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
            try {


                let id = classs.id;

                let result = await fetchAllCoursesByClass(id);
                setCourses(result);
            } catch (error) {

            }
        }
    }
    useEffect(() => {
        fetchCourses();
    }, [classs]);

    const fetchSections = async () => {
        if (course) {
            try {


                let id = course.id;

                let result = await fetchAllSectionsByCourse([id]);
                setSections(result);
            } catch (error) {

            }
        }
    }
    useEffect(() => {
        fetchSections();
    }, [course]);

    const fetchSubSections = async () => {
        if (section) {
            try {


                let id = section.id;

                let result = await fetchAllSubSectionsBySection([id]);
                setSubSections(result);
            } catch (error) {

            }
        }
    }
    useEffect(() => {
        fetchSubSections();
    }, [section]);





    const handleSubmit = async (e) => {
        e.preventDefault();
        try {



            if (!classs || !course || !section || !subSection || !difficulty || !language || !type) {
                setSpanDisplay("inline")

            }
            else {

                let className = classs.className;
                let courseName = course.courseName;
                let sectionName = section.sectionName;
                let subSectionName = subSection.subSectionName;
                let difficultyName = difficulty.difficultyName;
                let languageName = language.languageName;
                setLoader(true);
                const { data } = await axios.post("http://13.233.103.1:4000/generateQuestionsUsingAi", { className, courseName, sectionName, subSectionName, difficultyName, languageName, type });
                setLoader(false);
                if (data?.success) {

                    setAiQuestions(data?.result);
                    toast.success(data?.message);
                    setModalShow(true);
                }
                else {
                    toast.error(data?.message);
                }
                // setLoader(true);



            }
        } catch (error) {
            setLoader(false);
            toast.error("something went wrong");
            console.log(error);
        }
    };

    useEffect(() => {
        if (result.success == true) {

            // setAnother(false);
            // setClasss(null);
            // setCourse(null);
            // setSection(null);
            // setSubSection(null);
            // setDifficulty(null);
            // setLanguage(null);
            // setType("short");
            dispatch(setSuccessFalseQuestion());
        }
        setLoader(false);
    }, [result.success]);


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

    const handleSelectLanguage = selectedOption => {
        setLanguage(selectedOption);
    };

    const handleSelectDifficulty = selectedOption => {
        setDifficulty(selectedOption);
    };





    const handleTypeChange = (event) => {
        console.log("jfkdjfkdjfk")
        setType(event.target.value);
    };


    const removeQuestionAtIndex = (index) => {
        setAiQuestions(prevQuestions => {
            if (index < 0 || index >= prevQuestions.length) {
                console.error('Index out of bounds');
                return prevQuestions;
            }
            return [...prevQuestions.slice(0, index), ...prevQuestions.slice(index + 1)];
        });
    };



    const columns = [
        {
            label: "Serial No.",
            field: "serialNo",
            sort: "asc",
            width: 50,
        },
        {
            label: "Question",
            field: "description",
            sort: "asc",
            width: 100,
        },
        ...(type === 'mcq' ? [ // Conditionally add options columns if type is 'mcq'
            {
                label: "Option1",
                field: "option1",
                sort: "asc",
                width: 100,
            },
            {
                label: "Option2",
                field: "option2",
                sort: "asc",
                width: 100,
            },
            {
                label: "Option3",
                field: "option3",
                sort: "asc",
                width: 100,
            },
            {
                label: "Option4",
                field: "option4",
                sort: "asc",
                width: 100,
            },
        ] : []),
        ...(type !== "essay" ? [
            {
                label: "Answer",
                field: "answer",
                sort: "asc",
                width: 100,
            }]
            : []),
        {
            label: "Actions",
            field: "actions",
            width: 100,
            btn: true, // Indicate that the content should be treated as a button
        },
    ];

    // Example data rows
    // Replace with your actual data rows
    const rows = aiQuestions?.map((row, index) => ({
        ...row,
        serialNo: index + 1, // Add 1 to start counting from 1
        description: row.description,
        ...(type === 'mcq' ? { // Conditionally spread options if type is 'mcq'
            option1: row.options[0],
            option2: row.options[1],
            option3: row.options[2],
            option4: row.options[3],
        } : {}),
        answer: row.answer,
        actions: (
            <>
                <div className="d-flex">
                    <i style={{ color: "green", fontSize: "1.5rem", cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation(); // Stop event bubbling to parent elements
                            // Add specific action click logic here
                            console.log(row);
                            setDescription(row?.description);
                            setOptions(row?.options);
                            setAnswer(row?.answer);
                            setModalShow(false);

                            handleAddQuestionToQb2();
                            removeQuestionAtIndex(index);

                        }}
                    >
                        <MdAddTask />
                    </i>
                    {/* Add more actions as needed */}
                </div>
            </>
        ),
    }));


    const data = {
        columns,
        rows,
    };




    const handleCellClick = (event) => {
        const columnIndex = event.target.cellIndex;
        const columnField = columns[columnIndex]?.field;
        if (columnField !== 'actions') {
            const rowIndex = event.target.parentNode.rowIndex - 1; // Adjust for header row
            setRowIndex(rowIndex);
            const clickedRow = rows[rowIndex];
            handleRowClick(clickedRow);
        }
    };
    const handleRowClick = (row) => {
        setDescription(row?.description);
        setOptions(row?.options);
        setAnswer(row?.answer);
        setSecondModalShow(true)
        setModalShow(false);

    }

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


    const handleAdd = () => {
        toast.success("Question added successfully in the QB");

    }


    // for add question in the qb 

    function removeSpecificDivs(htmlString) {
        // Parse the HTML string into a new DOM document
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Selectors for the divs to remove based on class and id
        const selectorsToRemove = [
            'div.e-rte-content#defaultRTErte-view',
            'div.e-content.e-lib.e-keyboard#defaultRTE_rte-edit-view'
        ];

        // Iterate over selectors and remove the matching elements
        selectorsToRemove.forEach(selector => {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(element => {
                // Instead of removing the element, we replace it with its content
                while (element.firstChild) {
                    element.parentNode.insertBefore(element.firstChild, element);
                }
                element.parentNode.removeChild(element);
            });
        });

        // Serialize the updated DOM back to a string
        // Inner HTML of the body will contain the expected output
        return doc.body.innerHTML;
    }
    const removeImgTag = (htmlContent) => {
        // Create a temporary element to parse the HTML string
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlContent;

        // Find the image element
        const imageElement = tempElement.querySelector('img');

        // Check if the image element exists
        if (imageElement) {
            // Remove the image element
            imageElement.parentNode.removeChild(imageElement);
            // console.log("dsdsd", tempElement.innerHTML)
            // Update the HTML content state
            // setHtmlContent(tempElement.innerHTML);
        }
        console.log(tempElement.innerHTML);
        return tempElement.innerHTML;
    };

    const handleAddQuestionToQb2 = async () => {
        // console.log("hello")
        try {


            setModalShow(true);


            console.log('ClassId', classs.id);
            console.log('CourseId', course.id);
            console.log('SectionId', section.id);
            console.log('SubSectionId', subSection.id);
            console.log('DifficultyId', difficulty.id)
            console.log('languageId', language.id);
            console.log('Description', description);
            console.log('Type', type);
            console.log("otpions", options);
            console.log('Answer', answer);

            // const fetchedImageFiles = await fetchImageFile();
            const formData = new FormData();
            // fetchedImageFiles.forEach((image) => {
            //     formData.append('Image', image);
            // });
            options?.forEach((option) => {
                formData.append("Options", option);
            });
            formData.append('ClassId', classs.id);
            formData.append('CourseId', course.id);
            formData.append('SectionId', section.id);
            formData.append('SubSectionId', subSection.id);
            formData.append('Description', description);
            formData.append('ContentText', description);
            formData.append('DifficultyId', difficulty.id);
            formData.append('languageId', language.id);
            formData.append('Type', type);
            formData.append('Answer', answer);

            setLoader(true);
            dispatch(addQuestion(formData));
            setLoader(false);

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message);
        }
    };

    const handleAddQuestionToQb = async (e) => {
        e.preventDefault();
        removeQuestionAtIndex(rowIndex);
        const rteValue = rteObj.getContent();
        const res = rteObj.getContent();
        let desc = res.outerHTML;
        desc = removeSpecificDivs(desc);
        let tempElement = document.createElement('div');
        tempElement.innerHTML = res.outerHTML;
        let textContent = tempElement.textContent || tempElement.innerText;

        if (!classs || !course || !section || !subSection || !desc || !difficulty || !language || !type || !answer) {
            setSpanDisplay("inline")

        }
        else {

            console.log(classs);
            console.log(course);
            console.log(section);
            console.log(subSection);
            console.log(difficulty);
            console.log(type);
            console.log(language);
            console.log(description);
            console.log(options);
            console.log(answer);

            // const fetchedImageFiles = await fetchImageFile();
            const formData = new FormData();
            // fetchedImageFiles.forEach((image) => {
            //     formData.append('Image', image);
            // });
            options?.forEach((option) => {
                formData.append("Options", option);
            });
            formData.append('ClassId', classs.id);
            formData.append('CourseId', course.id);
            formData.append('SectionId', section.id);
            formData.append('SubSectionId', subSection.id);
            formData.append('Description', removeImgTag(desc));
            formData.append('ContentText', textContent);
            formData.append('DifficultyId', difficulty.id);
            formData.append('languageId', language.id);
            formData.append('Type', type);
            formData.append('Answer', answer);

            setLoader(true);
            dispatch(addQuestion(formData));
            setLoader(false);
            setSecondModalShow(false)
            setModalShow(true)
        }
    };




    // ***** code for rich text editor textarea ****************


    const toolbarSettings = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
            'LowerCase', 'UpperCase', '|',
            'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
            'Outdent', 'Indent', '|',
            'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
            'SourceCode', '|', 'Undo', 'Redo']
    };
    const quickToolbarSettings = {
        image: ['Replace', 'Align', 'Caption', 'Remove', 'InsertLink', 'OpenImageLink', '-', 'EditImageLink', 'RemoveImageLink', 'Display', 'AltText', 'Dimension'],
        link: ['Open', 'Edit', 'UnLink']
    };

    let rteObj;
    let template = description;
    // let template = description;


    // Rich Text Editor items list
    let items = ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
        'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', '|', 'Undo', 'Redo'
    ];
    return (
        <React.Fragment>
            {loader ? (
                <Loader />
            ) : ("")}
            <Row>
                <Col>
                    <Card>
                        <CardBody style={{ width: width <= 781 && "100vw" }}  >
                            <CardTitle className="h4">Genrate Question Using Ai</CardTitle>
                            <form onSubmit={handleSubmit}>

                                <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
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

                                {courses && <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
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

                                {sections && <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
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

                                {subSections && <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
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

                                {difficultys && <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
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
                                {languages && <Row className="mb-3" style={{ width: "85%", }}>
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




                                <Row className="mb-3" style={{ width: window.innerWidth <= 998 ? '95%' : '85%' }}>
                                    <label htmlFor="question-type" className="col-md-2 col-form-label">
                                        Question Type
                                    </label>
                                    <div className="col-md-10">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="type"
                                                id="type-short"
                                                value="short"
                                                checked={type === 'short'}
                                                onClick={handleTypeChange}
                                            />
                                            <label className="form-check-label" htmlFor="type-short">
                                                Short
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline mb-3">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="type"
                                                id="type-mcq"
                                                value="mcq"
                                                checked={type === 'mcq'}
                                                onClick={handleTypeChange}
                                            />
                                            <label className="form-check-label" htmlFor="type-mcq">
                                                MCQ
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="type"
                                                id="type-true-false"
                                                value="true false"
                                                checked={type === 'true false'}
                                                onClick={handleTypeChange}
                                            />
                                            <label className="form-check-label" htmlFor="type-true-false">
                                                True False
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="type"
                                                id="type-essay"
                                                value="essay"
                                                checked={type === 'essay'}
                                                onClick={handleTypeChange}
                                            />
                                            <label className="form-check-label" htmlFor="type-essay">
                                                Essay
                                            </label>
                                        </div>
                                    </div>
                                </Row>





                                <Row className="mb-3">
                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-primary w-md">Get Question</button>
                                    </div>
                                </Row>
                            </form>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Modal for list the question in the table  */}
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                className="custom-modal"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Ai Genrated Questions
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "80vh", overflowY: "scroll", maxWidth: "70vw" }}>
                    <div id="MBDTableDiv" >
                        <MDBDataTable className="table-row-hover" responsive bordered data={data} style={{ cursor: 'pointer' }} noBottomColumns onClick={handleCellClick} />

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => setModalShow(false)} className="waves-effect waves-light">Close</Button>{" "}

                </Modal.Footer>
            </Modal>

            {/* Modal for the view seprate question  */}
            <Modal
                show={secondModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Question
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="" style={{ height: "80vh", overflowY: "scroll", overflowX: "hidden" }}>
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
                                Question Description
                            </label>
                            <div className="col-md-10">
                                <div className="card">
                                    <RichTextEditorComponent id="defaultRTE" ref={(scope) => { rteObj = scope; }} valueTemplate={template} toolbarSettings={toolbarSettings}>
                                        <Inject services={[HtmlEditor, Toolbar, Link, Image, QuickToolbar]} />
                                    </RichTextEditorComponent>

                                </div>
                            </div>
                        </Row>
                        {type === "short" && <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Answer
                            </label>
                            <div className="col-md-10">
                                <input type="text"
                                    className='form-control'
                                    placeholder="Enter Answer"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)} />
                                {!answer && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                            </div>
                        </Row>}
                        {type === "mcq" &&
                            <>

                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        {/* Answer */}
                                    </label>
                                    <div className="col-md-10">
                                        <input type="text"
                                            className='form-control col-md-4 mb-2'
                                            onChange={(e) => { setOption(e.target.value) }}
                                            placeholder="write a option"
                                            value={option} />

                                        <button type="button" className="btn btn-primary w-md me-2 " onClick={addOption}>Add Option</button>
                                        <button type='button' className="btn btn-primary me-2" onClick={handleSetOptionsClick} >{editOptionText}</button>
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label
                                        htmlFor="example-text-input"
                                        className="col-md-2 col-form-label"
                                    >
                                        Select Answer
                                    </label>
                                    <div className="col-md-10">
                                        {options?.map((o, i) => (
                                            <>
                                                <div className="form-check mb-3">
                                                    <input
                                                        className="form-check-input mt-1"
                                                        type="radio"
                                                        name="options"
                                                        id={i}
                                                        value={o}
                                                        checked={answer === o}
                                                        onChange={(e) => setAnswer(e.target.value)}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="exampleRadios1"
                                                    >
                                                        {o}
                                                    </label>
                                                    <button type='button' className="text-danger" onClick={() => removeOption(i)} style={{ fontSize: "1rem", background: "none", border: "none", fontWeight: "bolder", display: `${optionsEditDisplay}` }}> <i className="mdi mdi-delete "></i></button>

                                                </div>
                                            </>
                                        ))}
                                        {!answer && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                    </div>
                                </Row>
                            </>
                        }
                        {type === "true false" && <Row className="mb-3">
                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                Answer
                            </label>
                            <div className="col-md-10">
                                <div className="">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="answer"
                                            id="answer1"
                                            value="true"
                                            checked={answer.toLowerCase() === 'true'}
                                            onChange={(e) => setAnswer(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="exampleRadios2">
                                            True
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="answer"
                                            id="answer2"
                                            value="false"
                                            checked={answer.toLowerCase() === 'false'}
                                            onChange={(e) => setAnswer(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="exampleRadios2">
                                            False
                                        </label>
                                    </div>
                                </div>
                                {!answer && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                            </div>
                        </Row>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => { setSecondModalShow(false); setModalShow(true) }} className="waves-effect waves-light">Close</Button>{" "}
                    <Button type="button" color="success" onClick={handleAddQuestionToQb} className="waves-effect waves-light">Add to the Bank</Button>{" "}
                    {/* <Button type="button" color="danger" onClick={() => { setDeleteModalShow(true); setModalShow(false) }} className="waves-effect waves-light">Delete</Button>{" "} */}

                </Modal.Footer>
            </Modal>

            {/* Modal for confirmation before delete  */}
            <Modal
                show={deleteModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>

                    <h4>
                        Are you sure want to remove this question.
                    </h4>


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={() => { setDeleteModalShow(false); setModalShow(true) }} className="waves-effect waves-light">No</Button>{" "}
                    <Button type="button" color="danger" className="waves-effect waves-light">Yes</Button>{" "}

                </Modal.Footer>
            </Modal>

        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(CreateQuestionUsingAi);



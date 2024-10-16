import React, { useEffect, useState } from "react"

import {
    Card,
    CardBody,
    Col,
    Row,
    CardTitle,
    FormGroup,
    Form,
    Button
} from "reactstrap"

import { connect } from "react-redux";

//Import Action to copy breadcrumb items from local state to redux state
import { fetchClass, fetchDifficulty, fetchLanguage, fetchUser, setBreadcrumbItems, setSuccessFalseQuestion } from "../../store/actions";
import Loader from "components/Loader/Loader";
import Tree from 'react-d3-tree';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createWorkflowTree, fetchAllWorkflowTree, fetchQuestionForQc, getChild, returnQuestion, updateWorkflowTree } from "helpers/workflow_helper";
import { toast } from "react-toastify";
import Select from "react-select"
import { Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import { deleteQuestion, fetchSingleQuestion, updateQuestion } from "helpers/question_helper";
import { IMAGE_FETCH } from "helpers/url_helper";
import { fetchAllCoursesByClass } from "helpers/course_helper";
import { fetchAllSectionsByCourse } from "helpers/section_helper";
import { fetchAllSubSectionsBySection } from "helpers/subSection_helper";
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';



const QcQuestions = (props) => {
    document.title = "Question Bank | Workflow";




    const breadcrumbItems = [
        { title: "Workflow", link: "#" },
        { title: "QC Questions", link: "#" },
    ]
    useEffect(() => {
        const blurDiv = document.getElementById("blur");
        var width = window.innerWidth;
        if (width <= 994) {
            blurDiv.click()
        }
    }, [])
    useEffect(() => {
        props.setBreadcrumbItems('QC Questions', breadcrumbItems)
    })
    const dispatch = useDispatch();


    const [loader, setLoader] = useState(false);
    const [questions, setQuestions] = useState([]);
    const { userId } = useParams();

    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [id, setId] = useState({});
    const [classs, setClasss] = useState(null);
    const [type, setType] = useState('short');
    const [difficulty, setDifficulty] = useState(null);
    const [language, setLanguage] = useState(null);
    const [answer, setAnswer] = useState("");
    const [course, setCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [section, setSection] = useState(null);
    const [sections, setSections] = useState([]);
    const [subSection, setSubSection] = useState(null);
    const [subSections, setSubSections] = useState([]);
    const [option, setOption] = useState("");
    const [options, setOptions] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [editOptionText, setEditOptionText] = useState("Edit Options");
    const [optionsEditDisplay, setOptionsEditDisplay] = useState("none");
    const [iterator, setIterator] = useState(0);
    const [comment, setComment] = useState("");
    const [returnModal, setReturnModal] = useState(false);
    const classes = useSelector(state => state.classesReducer);
    const difficultys = useSelector(state => state.difficultysReducer);
    const languages = useSelector(state => state.languagesReducer);

    useEffect(() => {
        dispatch(fetchClass());
        dispatch(fetchDifficulty());
        dispatch(fetchLanguage());

    }, []);




    const fetchCourses = async () => {
        if (classs) {
            let id = classs.id;

            let result = await fetchAllCoursesByClass(id);
            setCourses(result);
            // courses = result;
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
            // sections = result;
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
            // subSection = result;
        }
    }
    useEffect(() => {
        fetchSubSections();
    }, [section]);



    const getQuestionForQc = async () => {
        try {
            setLoader(true);
            const data = await fetchQuestionForQc(userId);
            if (data?.success) {
                setQuestions(data?.result);
                handleFirstIterator(data?.result);

            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
        getQuestionForQc();
    }, []);


    const data = {
        columns: [
            {
                label: "Serial No.",
                field: "serialNo",
                sort: "asc",
                width: 50,
            },
            {
                label: "Type",
                field: "type",
                sort: "asc",
                width: 100,
            },
            {
                label: "Question",
                field: "contentText",
                sort: "asc",
                width: 150,
            },
            {
                label: "Answer",
                field: "answer",
                sort: "asc",
                width: 200,
            },
        ],
        rows: questions?.map((row, index) => ({
            ...row,
            serialNo: index + 1, // Add 1 to start counting from 1
            clickEvent: () => handleRowClick(row)
        }))
    };

    const handleRowClick = async (row) => {

        try {
            console.log(row);
            setLoader(true);
            const data = await fetchSingleQuestion(row.id);
            if (data?.success) {
                console.log(data?.result);
                setDescription(data?.result[0]?.description);
                setAnswer(data?.result[0]?.answer)
                setType(data?.result[0]?.type);


                setCourse(data?.result[0]?.course);
                setSection(data?.result[0]?.section);
                setSubSection(data?.result[0]?.subSection);
                setDifficulty(data?.result[0]?.difficulty);
                setLanguage(data?.result[0]?.language);
                let imagesHTML;
                setClasss(data?.result[0]?.class);


                if (data?.result[0]?.type == "mcq") {
                    let arr = [];
                    data?.optionResult?.map((d) => {
                        arr.push(d.optionName);
                    })
                    setOptions(arr);
                }
                imagesHTML = data?.imageResult?.map(url =>
                    `<img  className="e-rte-image" src="${IMAGE_FETCH + url.imagePath}"  style={{ height: '20px', width: '10px' }} alt="Descriptive Text"/>`
                    // `<img className="e-rte-image" src={"${IMAGE_FETCH}${url.imagePath}"} style={{ height: '200px', width: '100px' }} alt="Descriptive Text" />`
                ).join('');
                setOldImages(imagesHTML);
                setModalShow(true);
            } else {
                toast.error(data?.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoader(false);
        }
    }


    const handleSelectClass = selectedOption => {
        setClasss(selectedOption);
        setCourses([]);
        setSections([]);
        setCourse(null);
        setSection(null);
    };

    const handleSelectCourse = selectedOption => {
        setCourse(selectedOption);
        setSections([]);
        // sections = [];
        setSubSections([]);
        // subSections = [];
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

    const handleTypeChange = (event) => {
        setType(event.target.value);
        setAnswer("");
    };

    const addOption = () => {
        console.log(options)
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

    const handleFirstIterator = (questions) => {
        console.log("calling --->")
        console.log("the iterator is ---> ", iterator)
        console.log("the question is ---> ")
        console.log(questions?.[iterator]);
        setDescription(questions?.[iterator]?.description);
        setAnswer(questions?.[iterator]?.answer)
        setType(questions?.[iterator]?.type);


        setCourse(questions?.[iterator]?.course);
        setSection(questions?.[iterator]?.section);
        setSubSection(questions?.[iterator]?.subSection);
        setDifficulty(questions?.[iterator]?.difficulty);
        setLanguage(questions?.[iterator]?.language);
        let imagesHTML;
        setClasss(questions?.[iterator]?.class);


        if (questions?.[iterator]?.type == "mcq") {
            let arr = [];
            questions?.[iterator]?.options?.map((d) => {
                arr.push(d.optionName);
            })
            setOptions(arr);
        }
        imagesHTML = questions?.[iterator]?.images?.map(url =>
            `<img  className="e-rte-image" src="${IMAGE_FETCH + url.imagePath}"  style={{ height: '20px', width: '10px' }} alt="Descriptive Text"/>`
            // `<img className="e-rte-image" src={"${IMAGE_FETCH}${url.imagePath}"} style={{ height: '200px', width: '100px' }} alt="Descriptive Text" />`
        ).join('');
        setOldImages(imagesHTML);

    }
    const handleIteratorChagne = (iterator) => {
        console.log("calling --->")
        console.log("the iterator is ---> ", iterator)
        console.log("the question is ---> ")
        console.log(questions?.[iterator]);
        setDescription(questions?.[iterator]?.description);
        setAnswer(questions?.[iterator]?.answer)
        setType(questions?.[iterator]?.type);


        setCourse(questions?.[iterator]?.course);
        setSection(questions?.[iterator]?.section);
        setSubSection(questions?.[iterator]?.subSection);
        setDifficulty(questions?.[iterator]?.difficulty);
        setLanguage(questions?.[iterator]?.language);
        let imagesHTML;
        setClasss(questions?.[iterator]?.class);


        if (questions?.[iterator]?.type == "mcq") {
            let arr = [];
            questions?.[iterator]?.options?.map((d) => {
                arr.push(d.optionName);
            })
            setOptions(arr);
        }
        imagesHTML = questions?.[iterator]?.images?.map(url =>
            `<img  className="e-rte-image" src="${IMAGE_FETCH + url.imagePath}"  style={{ height: '20px', width: '10px' }} alt="Descriptive Text"/>`
            // `<img className="e-rte-image" src={"${IMAGE_FETCH}${url.imagePath}"} style={{ height: '200px', width: '100px' }} alt="Descriptive Text" />`
        ).join('');
        setOldImages(imagesHTML);

    }

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

        // Find all image elements
        const imageElements = tempElement.querySelectorAll('img');

        // Remove each image element
        imageElements.forEach(imageElement => {
            imageElement.parentNode.removeChild(imageElement);
        });

        // Return the modified HTML
        return tempElement.innerHTML;
    };

    const fetchImageFile = async () => {

        const tempDiv = rteObj.getContent();
        const objectElements = tempDiv.querySelectorAll('.e-rte-image');

        if (objectElements.length > 0) {
            try {
                const filesPromises = Array.from(objectElements).map(async (objectElement) => {
                    const imageUrl = objectElement.getAttribute('src');
                    const name = objectElement.getAttribute('alt') || 'unnamed';

                    const response = await fetch(imageUrl);
                    const blob = await response.blob();

                    return new File([blob], `image_${name}.png`, { type: 'image/png' });
                });

                return await Promise.all(filesPromises);
            } catch (error) {
                console.error('Error fetching images:', error);
                return [];
            }
        } else {
            console.log('No img element found within .e-rte-image');
            return [];
        }
    };

    const handleAccept = async () => {
        // const rteValue = rteObj.getText();
        // Get the HTML content from rteObj.getContent()
        const res = rteObj.getContent();
        let desc = res.outerHTML;

        // Remove the specified div and update the HTML content
        desc = removeSpecificDivs(desc);

        let tempElement = document.createElement('div');
        tempElement.innerHTML = res.outerHTML;
        let textContent = tempElement.textContent || tempElement.innerText;
        if (!classs || !course || !section || !subSection || !desc || !difficulty || !language || !type || !answer) {
            setSpanDisplay("inline")

        }
        else {

            const fetchedImageFiles = await fetchImageFile();
            const formData = new FormData();
            fetchedImageFiles.forEach((image) => {
                formData.append('Image', image);
            });
            options?.forEach((option) => {
                formData.append("Options", option);
            });
            formData.append('Id', questions?.[iterator]?.id);
            formData.append('ClassId', classs.id);
            formData.append('Class', JSON.stringify(classs))
            formData.append('CourseId', course.id);
            formData.append('Course', JSON.stringify(course));
            formData.append('SectionId', section.id);
            formData.append('Section', JSON.stringify(section));
            formData.append('SubSectionId', subSection.id);
            formData.append('SubSection', JSON.stringify(subSection));
            formData.append('Description', removeImgTag(desc));
            formData.append('ContentText', textContent);
            formData.append('DifficultyId', difficulty.id);
            formData.append('languageId', language.id);
            formData.append('Difficulty', JSON.stringify(difficulty));
            formData.append('Type', type);
            formData.append('Answer', answer);
            formData.append('qc', 1);

            setLoader(true);
            dispatch(updateQuestion(formData));
            console.log(questions)
        }
    }


    useEffect(() => {
        if (questions.success == true) {
            setModalShow(false);
            setDeleteModalShow(false);
            // dispatch(setSuccessFalseQuestion());
        }
        setLoader(false);
        getQuestionForQc();
    }, [questions.success]);


    const handleReject = () => {

        setLoader(true);
        dispatch(deleteQuestion(questions?.[iterator]?.id));
    }


    const handleReturn = async () => {
        try {
            if (!comment) {
                setSpanDisplay(true);
            } else {
                setLoader(true);
                const data = await returnQuestion({ questionId: questions?.[iterator]?.id, Comment: comment });
                if (data?.success) {
                    setReturnModal(false);
                    getQuestionForQc();
                } else {
                    toast.error(data?.message);
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoader(false);
            getQuestionForQc();
        }
    }




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
    // set the value to Rich Text Editor
    // let template = `<div style="display:block;"><p style="margin-right:10px">${description} ${oldImages}</p></div>`;
    let template = description + oldImages;
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

            <Row >
                <Col>
                    <Card>
                        <CardBody className="col-lg-10 col-sm-12 col-xs-12 " >

                            {/* <div id="MBDTableDiv" >
                                <MDBDataTable className="table-row-hover" responsive bordered data={data} style={{ cursor: 'pointer' }} noBottomColumns />

                            </div> */}


                            <div className="container d-flex align-items-center justify-content-between">
                                <button className="btn btn-primary me-2" onClick={() => { setIterator(iterator - 1); handleIteratorChagne(iterator - 1) }} disabled={iterator === 0} >
                                    <i className="bi bi-arrow-left"></i>
                                </button>

                                <div className="" style={{ overflowX: "visible" }}>
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
                                                        checked={answer === 'true'}
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
                                                        checked={answer === 'false'}
                                                        onChange={(e) => setAnswer(e.target.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor="exampleRadios2">
                                                        false
                                                    </label>
                                                </div>
                                            </div>
                                            {!answer && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                                        </div>
                                    </Row>}
                                </div>

                                <button className="btn btn-primary ms-2" onClick={() => { setIterator(iterator + 1); handleIteratorChagne(iterator + 1) }} disabled={iterator === questions.length - 1} >
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>
                            <div className="d-flex justify-content-center">

                                <button className="btn btn-success me-2" onClick={handleAccept}  >
                                    Accept
                                </button>
                                <button className="btn btn-warning me-2" onClick={() => setReturnModal(true)} >
                                    Return
                                </button>
                                <button className="btn btn-danger me-2" onClick={handleReject}  >
                                    Reject
                                </button>
                            </div>

                        </CardBody>
                    </Card>
                </Col>
            </Row>




            <Modal
                show={returnModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>

                    <Row className="mb-3">
                        <label
                            htmlFor="example-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Comment
                        </label>
                        <div className="col-md-10">
                            <input type="text"
                                className='form-control'
                                placeholder="Enter Comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)} />
                            {!comment && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>}
                        </div>
                    </Row>


                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" color="primary" onClick={handleReturn} className="waves-effect waves-light">Return</Button>{" "}


                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(QcQuestions);

// krutrim ai
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
import { fetchDifficulty, setBreadcrumbItems } from "../../store/actions";
import { addClass, fetchClass } from "store/class/action";
import { useSelector } from "react-redux";
import classesReducer from '../../store/class/reducer';
import { addQuestion } from "store/question/action";
import { HtmlEditor, Image, Inject, Link, NodeSelection, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';


import { Editor } from 'primereact/editor';
import { useAuth } from "context/authContext";
import { fetchAllCoursesByClass } from "helpers/course_helper";
import { fetchAllSectionsByCourse } from "helpers/section_helper";
import { fetchAllSubSectionsBySection } from "helpers/subSection_helper";
import { useWindowSize } from 'react-use';

const CreateQuestion = (props) => {

    const { width } = useWindowSize();
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
    const [type, setType] = useState('short');
    const [course, setCourse] = useState(null);
    const [section, setSection] = useState(null);
    const [subSection, setSubSection] = useState(null);
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subSections, setSubSections] = useState([]);
    const [answer, setAnswer] = useState("");
    const [difficulty, setDifficulty] = useState(null);
    const [text, setText] = useState("");
    const [option, setOption] = useState("");
    const [options, setOptions] = useState([]);
    const [editOptionText, setEditOptionText] = useState("Edit Options");
    const [optionsEditDisplay, setOptionsEditDisplay] = useState("none");
    const [spanDisplay, setSpanDisplay] = useState("none");
    const [auth, setAuth] = useAuth();

    const dispatch = useDispatch();
    const classes = useSelector(state => state.classesReducer)
    const difficultys = useSelector(state => state.difficultysReducer)

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("hello")
        const rteValue = rteObj.getContent();
        const res = rteObj.getContent();
        let desc = res.outerHTML;
        desc = removeSpecificDivs(desc);
        let tempElement = document.createElement('div');
        tempElement.innerHTML = res.outerHTML;
        let textContent = tempElement.textContent || tempElement.innerText;

        if (!classs || !course || !section || !subSection || !desc || !difficulty || !type || !answer) {
            setSpanDisplay("inline")

        }
        else {

            const fetchedImageFiles = await fetchImageFile();
            const formData = new FormData();
            fetchedImageFiles.forEach((image) => {
                formData.append('Image', image);
            });
            options.forEach((option) => {
                formData.append("Options", option);
            });
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
            formData.append('Difficulty', JSON.stringify(difficulty));
            formData.append('Type', type);
            formData.append('Answer', answer);
            dispatch(addQuestion(formData));



        }
    };


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




    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };


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
    // let template = `<div style="display:block;"><p style="margin-right:10px"></p></div>`;
    let template = "";

    let selection = new NodeSelection();
    let ranges;
    let dialogObj;
    // Rich Text Editor items list
    let items = ['Bold', 'Italic', 'Underline', '|', 'Formats', 'Alignments', 'OrderedList',
        'UnorderedList', '|', 'CreateLink', 'Image', '|', 'SourceCode', '|', 'Undo', 'Redo'
    ];


    const htmlString = '<div class="e-rte-content" id="defaultRTErte-view" style="height: auto; margin-top: 0px; border-bottom: none;"><div class="e-content e-lib e-keyboard" id="defaultRTE_rte-edit-view" contenteditable="true" tabindex="0"><div style="display:block;"><p> </p><p style="margin-right: 10px; text-align: center;"><span style="font-size: 14pt;"><span style="font-family: &quot;Times New Roman&quot;, Times, serif;"><strong><span style="text-decoration: underline;"><span style="text-decoration: line-through;">dfkfdlfkdlkfdlfkdkfjdkf</span></span> fkdjfkdfjkdjfkdjfkoeiroeiroeiorieorioeiroeivm,cvmc,vmc,vmc,mv,cmv,c</strong></span></span></p><p style="margin-right:10px"> </p><ul><li style="margin-right:10px"><span style="font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; background-color: unset; text-align: inherit;">dfkfdlfkdlkfdlfkdkfjdkf fkdjfkdfjkdjfkdjfkoeiroeiroeiorieorioeiroeivm,cvmc,vmc,vmc,mv,cmv,ewewew</span></li></ul><span style="font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont;">dfkfdlfkdlkfdlfkdkfjdkf fkdjfkdfjkdjfkdjfkoeiroeiroeiorieorioeiroeivm,cvmc,vmc,vmc,mv,cmv</span></div><ul><li style="display:block;"><span style="font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont;">dfkfdlfkdlkfdlfkdkfjdkf fkdjfkdfjkdjfkdjfkoeiroeiroeiorieorioeiroeivm,cvmc,vmc,vmc,mv,cmv,c klklk</span><p style="margin-right: 10px; cursor: auto;"><img src="blob:http://localhost:3000/5a96c08a-fe90-4ee0-9d74-83bb7376a00e" class="e-rte-image e-imginline" alt="Screenshot (648).png" width="126" height="auto" style="min-width: 20px; min-height: 0px;">  </p><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li><span style="font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont;">dfkfdlfkdlkfdlfkdkfjdkf fkdjfkdfjkdjfkdjfkoeiroeiroeiorieorioeiroeivm,cvmc,vmc,vmc,mv,cmv,c</span><span style="font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; background-color: unset; text-align: inherit;"> </span></li></ul></li></ul></li></ul></li></ul></div></div>';

    const htmlContent = { __html: htmlString };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <CardBody style={{ width: width <= 781 && "100vw" }}  >
                            <CardTitle className="h4">Create Question</CardTitle>
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

                                <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
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

                                <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
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
                                            {/* {!rteObj.getContent() && <span style={{ color: "red", display: spanDisplay }}>This feild is required</span>} */}
                                        </div>
                                    </div>
                                </Row>
                                {type === "short" && <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
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

                                        <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
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
                                        <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Select Answer
                                            </label>
                                            <div className="col-md-10">
                                                {options.map((o, i) => (
                                                    <>
                                                        {/* <p>{o}</p> */}
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
                                {type === "true false" && <Row className="mb-3" style={{ width: width <= 998 ? "95%" : "85%" }}>
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

                                <Row className="mb-3">
                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-primary w-md">Submit</button>
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



        </React.Fragment>
    )
}

export default connect(null, { setBreadcrumbItems })(CreateQuestion);